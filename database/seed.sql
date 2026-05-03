TRUNCATE audit_logs, payroll_records, attendance, salary_structures, users, employees RESTART IDENTITY CASCADE;

INSERT INTO employees (
  employee_code, full_name, email, phone, department, designation,
  joining_date, bank_name, bank_account_no, tax_id, status
) VALUES
  ('EMP001', 'Aarav Sharma', 'employee1@payroll.com', '9876543210', 'Engineering', 'Frontend Developer', '2024-01-15', 'State Bank', '12345678901', 'TAXEMP001', 'ACTIVE'),
  ('EMP002', 'Priya Patel', 'employee2@payroll.com', '9876501234', 'Finance', 'Account Executive', '2023-08-01', 'HDFC Bank', '98765432101', 'TAXEMP002', 'ACTIVE'),
  ('EMP003', 'Rohan Singh', 'employee3@payroll.com', '9988776655', 'Engineering', 'Backend Developer', '2024-03-10', 'ICICI Bank', '11223344556', 'TAXEMP003', 'ACTIVE'),
  ('EMP004', 'Nikhil Gupta', 'employee4@payroll.com', '9988771122', 'Marketing', 'SEO Specialist', '2022-11-20', 'Axis Bank', '55667788990', 'TAXEMP004', 'ACTIVE'),
  ('EMP005', 'Sneha Rao', 'employee5@payroll.com', '9123456789', 'HR', 'HR Executive', '2025-02-01', 'Kotak Bank', '66778899001', 'TAXEMP005', 'ACTIVE');

INSERT INTO users (name, email, password_hash, role, employee_id) VALUES
  ('System Admin', 'admin@payroll.com', '$2a$10$32jZFb5DX6v1MrUE/3Is3eSJrgstpAdS55P9AxoFxa0jc0DA.yYC6', 'ADMIN', NULL),
  ('HR Manager', 'hr@payroll.com', '$2a$10$0l9aQi.oTsP8rQI4XAuTYO9XmgtTonK2R.S2Pg3NPPO/pGMl9yr12', 'HR', NULL),
  ('HR Coordinator', 'hr2@payroll.com', '$2a$10$0l9aQi.oTsP8rQI4XAuTYO9XmgtTonK2R.S2Pg3NPPO/pGMl9yr12', 'HR', NULL),
  ('Aarav Sharma', 'employee1@payroll.com', '$2a$10$UG90AY25uGDRouyx5W5gNup5mRnWSWyU81wlVINjS8l9Ply0GUIMy', 'EMPLOYEE', 1),
  ('Priya Patel', 'employee2@payroll.com', '$2a$10$UG90AY25uGDRouyx5W5gNup5mRnWSWyU81wlVINjS8l9Ply0GUIMy', 'EMPLOYEE', 2),
  ('Rohan Singh', 'employee3@payroll.com', '$2a$10$UG90AY25uGDRouyx5W5gNup5mRnWSWyU81wlVINjS8l9Ply0GUIMy', 'EMPLOYEE', 3),
  ('Nikhil Gupta', 'employee4@payroll.com', '$2a$10$UG90AY25uGDRouyx5W5gNup5mRnWSWyU81wlVINjS8l9Ply0GUIMy', 'EMPLOYEE', 4),
  ('Sneha Rao', 'employee5@payroll.com', '$2a$10$UG90AY25uGDRouyx5W5gNup5mRnWSWyU81wlVINjS8l9Ply0GUIMy', 'EMPLOYEE', 5);

INSERT INTO salary_structures (
  employee_id, basic_salary, hra, allowances, tax, pf, other_deductions, effective_from
) VALUES
  (1, 45000, 12000, 6000, 3500, 1800, 500, '2024-01-15'),
  (2, 38000, 9500, 4500, 2600, 1500, 300, '2023-08-01'),
  (3, 50000, 15000, 7000, 4500, 1800, 400, '2024-03-10'),
  (4, 32000, 8000, 3000, 1500, 1500, 200, '2022-11-20'),
  (5, 40000, 10000, 5000, 2800, 1800, 300, '2025-02-01');

INSERT INTO attendance (
  employee_id, month, year, working_days, present_days, absent_days, leave_days
) VALUES
  (1, 5, 2026, 22, 21, 1, 0),
  (2, 5, 2026, 22, 20, 2, 0),
  (3, 5, 2026, 22, 22, 0, 0),
  (4, 5, 2026, 22, 19, 1, 2),
  (5, 5, 2026, 22, 21, 0, 1),
  (1, 4, 2026, 21, 20, 0, 1),
  (2, 4, 2026, 21, 21, 0, 0),
  (3, 4, 2026, 21, 19, 2, 0),
  (4, 4, 2026, 21, 21, 0, 0),
  (5, 4, 2026, 21, 20, 1, 0);

INSERT INTO payroll_records (
  employee_id, month, year, gross_salary, attendance_deduction, total_deductions, net_salary, generated_by
) VALUES
  (1, 4, 2026, 63000, 0, 5800, 57200, 2),
  (2, 4, 2026, 52000, 0, 4400, 47600, 2),
  (3, 4, 2026, 72000, 6857.14, 6700, 58442.86, 2),
  (4, 4, 2026, 43000, 0, 3200, 39800, 2),
  (5, 4, 2026, 55000, 2619.05, 4900, 47480.95, 2);
