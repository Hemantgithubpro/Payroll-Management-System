"use client";

import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/lib/api";
import type { Employee, Salary } from "@/lib/types";

const emptySalary = {
  employee_id: "",
  basic_salary: "",
  hra: "",
  allowances: "",
  tax: "",
  pf: "",
  other_deductions: "",
  effective_from: new Date().toISOString().slice(0, 10)
};

export default function SalaryPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [form, setForm] = useState(emptySalary);
  const [message, setMessage] = useState("");

  function load() {
    Promise.all([api<Employee[]>("/employees"), api<Salary[]>("/salaries")]).then(([employeeData, salaryData]) => {
      setEmployees(employeeData);
      setSalaries(salaryData);
    });
  }

  useEffect(load, []);

  function selectEmployee(employeeId: string) {
    const existing = salaries.find((salary) => salary.employee_id === Number(employeeId));
    setForm(
      existing
        ? {
            employee_id: String(existing.employee_id),
            basic_salary: existing.basic_salary,
            hra: existing.hra,
            allowances: existing.allowances,
            tax: existing.tax,
            pf: existing.pf,
            other_deductions: existing.other_deductions,
            effective_from: existing.effective_from.slice(0, 10)
          }
        : { ...emptySalary, employee_id: employeeId }
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await api("/salaries", {
      method: "POST",
      body: JSON.stringify({ ...form, employee_id: Number(form.employee_id) })
    });
    setMessage("Salary structure saved.");
    load();
  }

  return (
    <AuthGate roles={["ADMIN", "HR"]}>
      {(user) => (
        <AppShell user={user}>
          <PageHeader title="Salary" description="Create or update salary structures." />
          <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
            <form className="panel p-5" onSubmit={submit}>
              {message ? <div className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{message}</div> : null}
              <div className="space-y-4">
                <label className="block text-sm font-medium">
                  Employee
                  <select className="field mt-1" required value={form.employee_id} onChange={(e) => selectEmployee(e.target.value)}>
                    <option value="">Select employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.employee_code} - {employee.full_name}
                      </option>
                    ))}
                  </select>
                </label>
                {[
                  ["basic_salary", "Basic Salary"],
                  ["hra", "HRA"],
                  ["allowances", "Allowances"],
                  ["tax", "Tax"],
                  ["pf", "PF"],
                  ["other_deductions", "Other Deductions"]
                ].map(([name, label]) => (
                  <label className="block text-sm font-medium" key={name}>
                    {label}
                    <input
                      className="field mt-1"
                      min="0"
                      required
                      step="0.01"
                      type="number"
                      value={form[name as keyof typeof form]}
                      onChange={(e) => setForm((current) => ({ ...current, [name]: e.target.value }))}
                    />
                  </label>
                ))}
                <label className="block text-sm font-medium">
                  Effective From
                  <input
                    className="field mt-1"
                    required
                    type="date"
                    value={form.effective_from}
                    onChange={(e) => setForm((current) => ({ ...current, effective_from: e.target.value }))}
                  />
                </label>
                <button className="btn btn-primary w-full">
                  <Save size={16} />
                  Save Salary
                </button>
              </div>
            </form>

            <section className="panel overflow-hidden">
              <div className="border-b border-slate-100 px-4 py-3 font-semibold">Current Structures</div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="table-cell">Employee</th>
                      <th className="table-cell">Gross</th>
                      <th className="table-cell">Fixed Deductions</th>
                      <th className="table-cell">Effective From</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaries.map((salary) => (
                      <tr key={salary.id}>
                        <td className="table-cell">{salary.full_name}</td>
                        <td className="table-cell">Rs. {(Number(salary.basic_salary) + Number(salary.hra) + Number(salary.allowances)).toFixed(2)}</td>
                        <td className="table-cell">Rs. {(Number(salary.tax) + Number(salary.pf) + Number(salary.other_deductions)).toFixed(2)}</td>
                        <td className="table-cell">{salary.effective_from.slice(0, 10)}</td>
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
