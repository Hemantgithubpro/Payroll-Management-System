"use client";

import { FileText, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/lib/api";
import type { Employee, PayrollRecord } from "@/lib/types";

const now = new Date();

export default function PayrollPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    employee_id: "",
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear())
  });

  function load() {
    Promise.all([api<Employee[]>("/employees"), api<PayrollRecord[]>("/payroll")]).then(([employeeData, payrollData]) => {
      setEmployees(employeeData);
      setRecords(payrollData);
    });
  }

  useEffect(load, []);

  async function generate(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api("/payroll/generate", {
        method: "POST",
        body: JSON.stringify({
          employee_id: Number(form.employee_id),
          month: Number(form.month),
          year: Number(form.year)
        })
      });
      setMessage("Payroll generated successfully.");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate payroll");
    }
  }

  return (
    <AuthGate roles={["ADMIN", "HR"]}>
      {(user) => (
        <AppShell user={user}>
          <PageHeader title="Payroll" description="Generate monthly payroll and view payroll records." />
          <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
            <form className="panel p-5" onSubmit={generate}>
              {message ? <div className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{message}</div> : null}
              {error ? <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
              <div className="space-y-4">
                <label className="block text-sm font-medium">
                  Employee
                  <select className="field mt-1" required value={form.employee_id} onChange={(e) => setForm((current) => ({ ...current, employee_id: e.target.value }))}>
                    <option value="">Select employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.employee_code} - {employee.full_name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block text-sm font-medium">
                    Month
                    <input className="field mt-1" min="1" max="12" required type="number" value={form.month} onChange={(e) => setForm((current) => ({ ...current, month: e.target.value }))} />
                  </label>
                  <label className="block text-sm font-medium">
                    Year
                    <input className="field mt-1" min="2000" required type="number" value={form.year} onChange={(e) => setForm((current) => ({ ...current, year: e.target.value }))} />
                  </label>
                </div>
                <button className="btn btn-primary w-full">
                  <Play size={16} />
                  Generate Payroll
                </button>
              </div>
            </form>

            <section className="panel overflow-hidden">
              <div className="border-b border-slate-100 px-4 py-3 font-semibold">Payroll Records</div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="table-cell">Employee</th>
                      <th className="table-cell">Month</th>
                      <th className="table-cell">Gross</th>
                      <th className="table-cell">Deductions</th>
                      <th className="table-cell">Net</th>
                      <th className="table-cell">Payslip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id}>
                        <td className="table-cell">{record.full_name}</td>
                        <td className="table-cell">{record.month}/{record.year}</td>
                        <td className="table-cell">Rs. {record.gross_salary}</td>
                        <td className="table-cell">Rs. {record.total_deductions}</td>
                        <td className="table-cell font-semibold">Rs. {record.net_salary}</td>
                        <td className="table-cell">
                          <Link className="btn btn-secondary h-9 px-3" href={`/payroll/${record.id}`} title="View payslip">
                            <FileText size={15} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </AppShell>
      )}
    </AuthGate>
  );
}
