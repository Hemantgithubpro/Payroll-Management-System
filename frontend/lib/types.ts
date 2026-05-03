export type Role = "ADMIN" | "HR" | "EMPLOYEE";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  employeeId: number | null;
};

export type Employee = {
  id: number;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string | null;
  department: string;
  designation: string;
  joining_date: string;
  bank_name: string | null;
  bank_account_no: string | null;
  tax_id: string | null;
  status: "ACTIVE" | "INACTIVE";
};

export type Salary = {
  id: number;
  employee_id: number;
  employee_code?: string;
  full_name?: string;
  basic_salary: string;
  hra: string;
  allowances: string;
  tax: string;
  pf: string;
  other_deductions: string;
  effective_from: string;
};

export type Attendance = {
  id: number;
  employee_id: number;
  employee_code?: string;
  full_name?: string;
  month: number;
  year: number;
  working_days: number;
  present_days: number;
  absent_days: number;
  leave_days: number;
};

export type PayrollRecord = {
  id: number;
  employee_id: number;
  employee_code: string;
  full_name: string;
  department?: string;
  designation?: string;
  month: number;
  year: number;
  gross_salary: string;
  attendance_deduction: string;
  total_deductions: string;
  net_salary: string;
  generated_at: string;
};
