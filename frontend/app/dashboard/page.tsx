"use client";

import { Banknote, ReceiptText, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/lib/api";
import type { Employee, PayrollRecord } from "@/lib/types";

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);

  useEffect(() => {
    Promise.all([api<Employee[]>("/employees"), api<PayrollRecord[]>("/payroll")]).then(([employeeData, payrollData]) => {
      setEmployees(employeeData);
      setPayroll(payrollData);
    });
  }, []);

  const totalPaid = payroll.reduce((sum, item) => sum + Number(item.net_salary), 0);

  return (
    <AuthGate roles={["ADMIN", "HR"]}>
      {(user) => (
        <AppShell user={user}>
          <PageHeader title="Dashboard" description="Quick overview of employee and payroll activity." />
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard icon={<UsersRound size={22} />} label="Employees" value={employees.length.toString()} />
            <StatCard icon={<ReceiptText size={22} />} label="Payroll Runs" value={payroll.length.toString()} />
            <StatCard icon={<Banknote size={22} />} label="Net Salary Paid" value={`Rs. ${totalPaid.toFixed(2)}`} />
          </div>

          <section className="panel mt-6 overflow-hidden">
            <div className="border-b border-slate-100 px-4 py-3 font-semibold">Recent Payroll</div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="table-cell">Employee</th>
                    <th className="table-cell">Month</th>
                    <th className="table-cell">Gross</th>
                    <th className="table-cell">Deductions</th>
                    <th className="table-cell">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {payroll.slice(0, 5).map((item) => (
                    <tr key={item.id}>
                      <td className="table-cell">{item.full_name}</td>
                      <td className="table-cell">{item.month}/{item.year}</td>
                      <td className="table-cell">Rs. {item.gross_salary}</td>
                      <td className="table-cell">Rs. {item.total_deductions}</td>
                      <td className="table-cell font-semibold">Rs. {item.net_salary}</td>
                    </tr>
                  ))}
                  {!payroll.length ? (
                    <tr>
                      <td className="table-cell text-slate-500" colSpan={5}>No payroll records yet.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        </AppShell>
      )}
    </AuthGate>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="panel p-5">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-brand">{icon}</div>
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-ink">{value}</div>
    </div>
  );
}
