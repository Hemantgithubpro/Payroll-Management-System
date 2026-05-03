"use client";

import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/lib/api";
import type { Attendance, Employee } from "@/lib/types";

const now = new Date();

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    employee_id: "",
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
    working_days: "22",
    present_days: "22",
    absent_days: "0",
    leave_days: "0"
  });

  function load() {
    Promise.all([api<Employee[]>("/employees"), api<Attendance[]>("/attendance")]).then(([employeeData, attendanceData]) => {
      setEmployees(employeeData);
      setAttendance(attendanceData);
    });
  }

  useEffect(load, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await api("/attendance", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        employee_id: Number(form.employee_id),
        month: Number(form.month),
        year: Number(form.year),
        working_days: Number(form.working_days),
        present_days: Number(form.present_days),
        absent_days: Number(form.absent_days),
        leave_days: Number(form.leave_days)
      })
    });
    setMessage("Attendance saved.");
    load();
  }

  return (
    <AuthGate roles={["ADMIN", "HR"]}>
      {(user) => (
        <AppShell user={user}>
          <PageHeader title="Attendance" description="Record monthly attendance used for payroll deductions." />
          <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
            <form className="panel p-5" onSubmit={submit}>
              {message ? <div className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{message}</div> : null}
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
                {[
                  ["working_days", "Working Days"],
                  ["present_days", "Present Days"],
                  ["absent_days", "Absent Days"],
                  ["leave_days", "Leave Days"]
                ].map(([name, label]) => (
                  <label className="block text-sm font-medium" key={name}>
                    {label}
                    <input
                      className="field mt-1"
                      min="0"
                      required
                      type="number"
                      value={form[name as keyof typeof form]}
                      onChange={(e) => setForm((current) => ({ ...current, [name]: e.target.value }))}
                    />
                  </label>
                ))}
                <button className="btn btn-primary w-full">
                  <Save size={16} />
                  Save Attendance
                </button>
              </div>
            </form>

            <section className="panel overflow-hidden">
              <div className="border-b border-slate-100 px-4 py-3 font-semibold">Attendance Records</div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="table-cell">Employee</th>
                      <th className="table-cell">Month</th>
                      <th className="table-cell">Working</th>
                      <th className="table-cell">Present</th>
                      <th className="table-cell">Absent</th>
                      <th className="table-cell">Leave</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((item) => (
                      <tr key={item.id}>
                        <td className="table-cell">{item.full_name}</td>
                        <td className="table-cell">{item.month}/{item.year}</td>
                        <td className="table-cell">{item.working_days}</td>
                        <td className="table-cell">{item.present_days}</td>
                        <td className="table-cell">{item.absent_days}</td>
                        <td className="table-cell">{item.leave_days}</td>
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
