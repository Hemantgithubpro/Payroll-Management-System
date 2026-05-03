# Simple Payroll Management System

A simple full-stack payroll management MVP for an academic Software Engineering Lab project.

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- Auth: JWT with role-based access

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@payroll.com` | `admin123` |
| HR | `hr@payroll.com`, `hr2@payroll.com` | `hr123` |
| Employee 1 | `employee1@payroll.com` | `employee123` |
| Employee 2 | `employee2@payroll.com` | `employee123` |
| Employee 3 | `employee3@payroll.com` | `employee123` |
| Employee 4 | `employee4@payroll.com` | `employee123` |
| Employee 5 | `employee5@payroll.com` | `employee123` |

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure backend environment:

```bash
cp backend/.env.example backend/.env
```

Put your Prisma Postgres connection string in `backend/.env`:

```txt
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/postgres?sslmode=require
```

3. Create tables and load demo data into that database:

```bash
npm run db:reset --workspace backend
```

This runs `database/schema.sql` and `database/seed.sql` using the `DATABASE_URL` from `backend/.env`.

4. Configure frontend environment:

```bash
cp frontend/.env.example frontend/.env.local
```

## Run

Start backend:

```bash
npm run dev:backend
```

Start frontend in another terminal:

```bash
npm run dev:frontend
```

Open:

```txt
http://localhost:3000
```

Backend runs on:

```txt
http://localhost:5001
```

The backend is configured for port `5001` because port `5000` is often already used on macOS.

## Main Features

- Default role-based login
- Admin/HR employee CRUD
- Admin/HR salary structure setup
- Admin/HR monthly attendance entry
- Admin/HR payroll generation
- Duplicate payroll prevention by employee/month/year
- Employee-only profile and payslip access

## Notes

- This project is intentionally simple and demo-friendly.
- Passwords are stored as bcrypt hashes in PostgreSQL.
- Payslips are shown as web pages; PDF export can be added later.
- The payroll calculation is simplified and does not implement real tax compliance rules.
