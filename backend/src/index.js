import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { query } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

function toNumber(value) {
  return Number(value || 0);
}

function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    employeeId: row.employee_id
  };
}

function signToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role, employeeId: user.employee_id },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
}

async function addAudit(userId, action, entityType, entityId) {
  await query(
    "INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)",
    [userId, action, entityType, entityId || null]
  );
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission for this action" });
    }
    return next();
  };
}

function route(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "payroll-backend" });
});

app.post("/api/auth/login", route(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const result = await query("SELECT * FROM users WHERE email = $1", [email]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return res.json({ token: signToken(user), user: publicUser(user) });
}));

app.get("/api/auth/me", requireAuth, route(async (req, res) => {
  const result = await query("SELECT * FROM users WHERE id = $1", [req.user.userId]);
  res.json({ user: publicUser(result.rows[0]) });
}));

app.get("/api/employees", requireAuth, requireRole("ADMIN", "HR"), route(async (_req, res) => {
  const result = await query("SELECT * FROM employees ORDER BY id DESC");
  res.json(result.rows);
}));

app.post("/api/employees", requireAuth, requireRole("ADMIN", "HR"), route(async (req, res) => {
  const body = req.body;
  const result = await query(
    `INSERT INTO employees (
      employee_code, full_name, email, phone, department, designation,
      joining_date, bank_name, bank_account_no, tax_id, status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *`,
    [
      body.employee_code,
      body.full_name,
      body.email,
      body.phone || null,
      body.department,
      body.designation,
      body.joining_date,
      body.bank_name || null,
      body.bank_account_no || null,
      body.tax_id || null,
      body.status || "ACTIVE"
    ]
  );
  await addAudit(req.user.userId, "CREATE_EMPLOYEE", "employees", result.rows[0].id);
  res.status(201).json(result.rows[0]);
}));

app.get("/api/employees/:id", requireAuth, route(async (req, res) => {
  if (req.user.role === "EMPLOYEE" && Number(req.params.id) !== req.user.employeeId) {
    return res.status(403).json({ message: "You can only view your own profile" });
  }

  const result = await query("SELECT * FROM employees WHERE id = $1", [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ message: "Employee not found" });
  res.json(result.rows[0]);
}));

app.put("/api/employees/:id", requireAuth, requireRole("ADMIN", "HR"), route(async (req, res) => {
  const body = req.body;
  const result = await query(
    `UPDATE employees SET
      employee_code=$1, full_name=$2, email=$3, phone=$4, department=$5,
      designation=$6, joining_date=$7, bank_name=$8, bank_account_no=$9,
      tax_id=$10, status=$11
    WHERE id=$12
    RETURNING *`,
    [
      body.employee_code,
      body.full_name,
      body.email,
      body.phone || null,
      body.department,
      body.designation,
      body.joining_date,
      body.bank_name || null,
      body.bank_account_no || null,
      body.tax_id || null,
      body.status || "ACTIVE",
      req.params.id
    ]
  );

  if (!result.rows[0]) return res.status(404).json({ message: "Employee not found" });
  await addAudit(req.user.userId, "UPDATE_EMPLOYEE", "employees", result.rows[0].id);
  res.json(result.rows[0]);
}));

app.delete("/api/employees/:id", requireAuth, requireRole("ADMIN", "HR"), route(async (req, res) => {
  const result = await query("DELETE FROM employees WHERE id = $1 RETURNING id", [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ message: "Employee not found" });
  await addAudit(req.user.userId, "DELETE_EMPLOYEE", "employees", result.rows[0].id);
  res.json({ message: "Employee deleted" });
}));

app.get("/api/salaries", requireAuth, requireRole("ADMIN", "HR"), route(async (_req, res) => {
  const result = await query(
    `SELECT s.*, e.full_name, e.employee_code
     FROM salary_structures s
     JOIN employees e ON e.id = s.employee_id
     ORDER BY e.full_name`
  );
  res.json(result.rows);
}));

app.get("/api/salaries/:employeeId", requireAuth, requireRole("ADMIN", "HR"), route(async (req, res) => {
  const result = await query("SELECT * FROM salary_structures WHERE employee_id = $1", [
    req.params.employeeId
  ]);
  res.json(result.rows[0] || null);
}));

app.post("/api/salaries", requireAuth, requireRole("ADMIN", "HR"), route(async (req, res) => {
  const body = req.body;
  const result = await query(
    `INSERT INTO salary_structures (
      employee_id, basic_salary, hra, allowances, tax, pf, other_deductions, effective_from
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    ON CONFLICT (employee_id) DO UPDATE SET
      basic_salary=EXCLUDED.basic_salary,
      hra=EXCLUDED.hra,
      allowances=EXCLUDED.allowances,
      tax=EXCLUDED.tax,
      pf=EXCLUDED.pf,
      other_deductions=EXCLUDED.other_deductions,
      effective_from=EXCLUDED.effective_from
    RETURNING *`,
    [
      body.employee_id,
      toNumber(body.basic_salary),
      toNumber(body.hra),
      toNumber(body.allowances),
      toNumber(body.tax),
      toNumber(body.pf),
      toNumber(body.other_deductions),
      body.effective_from || new Date().toISOString().slice(0, 10)
    ]
  );
  await addAudit(req.user.userId, "UPSERT_SALARY", "salary_structures", result.rows[0].id);
  res.status(201).json(result.rows[0]);
}));

app.put("/api/salaries/:employeeId", requireAuth, requireRole("ADMIN", "HR"), route(async (req, res) => {
  req.body.employee_id = req.params.employeeId;
  const result = await query(
    `UPDATE salary_structures SET
      basic_salary=$1, hra=$2, allowances=$3, tax=$4, pf=$5,
      other_deductions=$6, effective_from=$7
    WHERE employee_id=$8
    RETURNING *`,
    [
      toNumber(req.body.basic_salary),
      toNumber(req.body.hra),
      toNumber(req.body.allowances),
      toNumber(req.body.tax),
      toNumber(req.body.pf),
      toNumber(req.body.other_deductions),
      req.body.effective_from || new Date().toISOString().slice(0, 10),
      req.params.employeeId
    ]
  );
  if (!result.rows[0]) return res.status(404).json({ message: "Salary structure not found" });
  await addAudit(req.user.userId, "UPDATE_SALARY", "salary_structures", result.rows[0].id);
  res.json(result.rows[0]);
}));

app.get("/api/attendance", requireAuth, requireRole("ADMIN", "HR"), route(async (_req, res) => {
  const result = await query(
    `SELECT a.*, e.full_name, e.employee_code
     FROM attendance a
     JOIN employees e ON e.id = a.employee_id
     ORDER BY a.year DESC, a.month DESC, e.full_name`
  );
  res.json(result.rows);
}));

app.post("/api/attendance", requireAuth, requireRole("ADMIN", "HR"), route(async (req, res) => {
  const body = req.body;
  const result = await query(
    `INSERT INTO attendance (
      employee_id, month, year, working_days, present_days, absent_days, leave_days
    ) VALUES ($1,$2,$3,$4,$5,$6,$7)
    ON CONFLICT (employee_id, month, year) DO UPDATE SET
      working_days=EXCLUDED.working_days,
      present_days=EXCLUDED.present_days,
      absent_days=EXCLUDED.absent_days,
      leave_days=EXCLUDED.leave_days
    RETURNING *`,
    [
      body.employee_id,
      toNumber(body.month),
      toNumber(body.year),
      toNumber(body.working_days),
      toNumber(body.present_days),
      toNumber(body.absent_days),
      toNumber(body.leave_days)
    ]
  );
  await addAudit(req.user.userId, "UPSERT_ATTENDANCE", "attendance", result.rows[0].id);
  res.status(201).json(result.rows[0]);
}));

app.post("/api/payroll/generate", requireAuth, requireRole("ADMIN", "HR"), route(async (req, res) => {
  const employeeId = Number(req.body.employee_id);
  const month = Number(req.body.month);
  const year = Number(req.body.year);

  const duplicate = await query(
    "SELECT id FROM payroll_records WHERE employee_id=$1 AND month=$2 AND year=$3",
    [employeeId, month, year]
  );
  if (duplicate.rows[0]) {
    return res.status(409).json({ message: "Payroll already generated for this employee and month" });
  }

  const salaryResult = await query("SELECT * FROM salary_structures WHERE employee_id=$1", [employeeId]);
  const attendanceResult = await query(
    "SELECT * FROM attendance WHERE employee_id=$1 AND month=$2 AND year=$3",
    [employeeId, month, year]
  );
  const salary = salaryResult.rows[0];
  const attendance = attendanceResult.rows[0];

  if (!salary) return res.status(400).json({ message: "Salary structure is missing" });
  if (!attendance) return res.status(400).json({ message: "Attendance is missing for this month" });

  const grossSalary = toNumber(salary.basic_salary) + toNumber(salary.hra) + toNumber(salary.allowances);
  const perDaySalary = attendance.working_days > 0 ? grossSalary / attendance.working_days : 0;
  const attendanceDeduction = toNumber(attendance.absent_days) * perDaySalary;
  const totalDeductions =
    toNumber(salary.tax) + toNumber(salary.pf) + toNumber(salary.other_deductions) + attendanceDeduction;
  const netSalary = grossSalary - totalDeductions;

  const result = await query(
    `INSERT INTO payroll_records (
      employee_id, month, year, gross_salary, attendance_deduction,
      total_deductions, net_salary, generated_by
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      employeeId,
      month,
      year,
      grossSalary.toFixed(2),
      attendanceDeduction.toFixed(2),
      totalDeductions.toFixed(2),
      netSalary.toFixed(2),
      req.user.userId
    ]
  );

  await addAudit(req.user.userId, "GENERATE_PAYROLL", "payroll_records", result.rows[0].id);
  res.status(201).json(result.rows[0]);
}));

app.get("/api/payroll", requireAuth, requireRole("ADMIN", "HR"), route(async (_req, res) => {
  const result = await query(
    `SELECT p.*, e.full_name, e.employee_code
     FROM payroll_records p
     JOIN employees e ON e.id = p.employee_id
     ORDER BY p.year DESC, p.month DESC, e.full_name`
  );
  res.json(result.rows);
}));

app.get("/api/payroll/:id", requireAuth, route(async (req, res) => {
  const result = await query(
    `SELECT p.*, e.full_name, e.employee_code, e.department, e.designation
     FROM payroll_records p
     JOIN employees e ON e.id = p.employee_id
     WHERE p.id = $1`,
    [req.params.id]
  );
  const record = result.rows[0];
  if (!record) return res.status(404).json({ message: "Payroll record not found" });
  if (req.user.role === "EMPLOYEE" && record.employee_id !== req.user.employeeId) {
    return res.status(403).json({ message: "You can only view your own payslips" });
  }
  res.json(record);
}));

app.get("/api/payslips/me", requireAuth, requireRole("EMPLOYEE"), route(async (req, res) => {
  const result = await query(
    `SELECT p.*, e.full_name, e.employee_code
     FROM payroll_records p
     JOIN employees e ON e.id = p.employee_id
     WHERE p.employee_id = $1
     ORDER BY p.year DESC, p.month DESC`,
    [req.user.employeeId]
  );
  res.json(result.rows);
}));

app.get("/api/payslips/:id", requireAuth, route(async (req, res) => {
  const result = await query(
    `SELECT p.*, e.full_name, e.employee_code, e.department, e.designation
     FROM payroll_records p
     JOIN employees e ON e.id = p.employee_id
     WHERE p.id = $1`,
    [req.params.id]
  );
  const payslip = result.rows[0];
  if (!payslip) return res.status(404).json({ message: "Payslip not found" });
  if (req.user.role === "EMPLOYEE" && payslip.employee_id !== req.user.employeeId) {
    return res.status(403).json({ message: "You can only view your own payslips" });
  }
  res.json(payslip);
}));

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.code === "23505") {
    return res.status(409).json({ message: "A record with this unique value already exists" });
  }
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Payroll backend running on http://localhost:${PORT}`);
});
