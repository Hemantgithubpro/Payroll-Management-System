# Test Cases: Payroll Management System

This document outlines the test cases for the major modules of the Payroll Management System, following standard software testing practices.

## 1. Authentication & Authorization Module

| Test Case ID | Description | Pre-conditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TC_AUTH_01` | Verify successful Admin login | System is running; Admin account exists | 1. Navigate to `/login`<br>2. Enter Admin email & password<br>3. Click 'Login' | Redirected to Admin Dashboard; token generated | Pass |
| `TC_AUTH_02` | Verify successful HR login | System is running; HR account exists | 1. Navigate to `/login`<br>2. Enter HR email & password<br>3. Click 'Login' | Redirected to HR Dashboard; HR specific menus visible | Pass |
| `TC_AUTH_03` | Verify successful Employee login | System is running; Employee account exists | 1. Navigate to `/login`<br>2. Enter Employee email & password<br>3. Click 'Login' | Redirected to Employee Profile/Payslip page | Pass |
| `TC_AUTH_04` | Verify invalid login handling | System is running | 1. Navigate to `/login`<br>2. Enter invalid credentials<br>3. Click 'Login' | Error message "Invalid email or password" displayed | Fail |
| `TC_AUTH_05` | Verify Role-Based Access Control | Logged in as Employee | 1. Attempt to navigate to `/employees/new` (HR/Admin route) | Access Denied / Redirected to unauthorized page | Pass |

## 2. Employee Management Module

| Test Case ID | Description | Pre-conditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TC_EMP_01` | Add new employee successfully | Logged in as HR/Admin | 1. Navigate to Employee Management<br>2. Click 'Add Employee'<br>3. Fill mandatory fields (Name, Email, Role, Dept)<br>4. Submit | Employee is created successfully and appears in the list | Pass |
| `TC_EMP_02` | Add employee with duplicate email | Logged in as HR/Admin; Email already in use | 1. Navigate to Add Employee<br>2. Fill fields with an existing email<br>3. Submit | Error "Email already exists" displayed | In Progress |
| `TC_EMP_03` | View employee list | Logged in as HR/Admin | 1. Navigate to Employee List page | All active and inactive employees are listed with correct basic details | Pass |

## 3. Salary Structure & Configuration Module

| Test Case ID | Description | Pre-conditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TC_SAL_01` | Define salary structure for employee| Logged in as HR/Admin; Employee exists | 1. Navigate to Salary Structure setup<br>2. Select an employee<br>3. Enter Basic, HRA, Allowances, PF, Tax<br>4. Save | Salary structure is saved and linked to the employee successfully | Pass |
| `TC_SAL_02` | Update existing salary structure | Logged in as HR/Admin; Salary structure exists | 1. Select employee with existing salary<br>2. Modify Basic Salary<br>3. Save | Updated salary details reflect correctly in the DB and UI | Pending |

## 4. Attendance Integration Module

| Test Case ID | Description | Pre-conditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TC_ATT_01` | Add monthly attendance | Logged in as HR/Admin | 1. Navigate to Attendance tracking<br>2. Select employee, month, and year<br>3. Enter Working days, Present, Absent<br>4. Save | Attendance recorded successfully for that month | Pass |
| `TC_ATT_02` | Prevent duplicate attendance entry | Logs exists for specific employee/month/year | 1. Try to add attendance for the same employee, month, and year | Error "Attendance already recorded for this period" | Blocked |

## 5. Payroll Processing Engine Module

| Test Case ID | Description | Pre-conditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TC_PAY_01` | Generate monthly payroll | Logged in as HR/Admin; Salary & Attendance exist for the month | 1. Navigate to Payroll<br>2. Select Employee, Month, Year<br>3. Click 'Generate Payroll' | Net salary calculated correctly based on structural & attendance deductions | Pass |
| `TC_PAY_02` | Prevent duplicate payroll generation| Payroll already generated for the period | 1. Attempt to generate payroll for the same employee/month/year again | Error "Payroll already generated" displayed | Pass |
| `TC_PAY_03` | Missing attendance verification | No attendance recorded for the period | 1. Attempt to generate payroll for employee | System prompts that attendance data is missing | Fail |

## 6. Payslips & Reporting Module

| Test Case ID | Description | Pre-conditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TC_REP_01` | Employee views their payslip | Logged in as Employee; Payroll generated | 1. Navigate to Payslips tab<br>2. Click on the recent month's payslip | Payslip displays correct gross, deductions, and net salary. | Pass |
| `TC_REP_02` | HR views generated payrolls | Logged in as Admin/HR | 1. Navigate to generated payrolls/reports list | Dashboard lists all generated payrolls correctly | Pending |
