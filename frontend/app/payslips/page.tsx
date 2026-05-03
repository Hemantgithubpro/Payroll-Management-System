"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/lib/api";
import type { PayrollRecord, User } from "@/lib/types";

export default function PayslipsPage() {
  return (
    <AuthGate roles={["ADMIN", "HR", "EMPLOYEE"]}>
      {(user) => <PayslipsContent user={user} />}
    </AuthGate>
  );
}

function PayslipsContent({ user }: { user: User }) {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const path = user.role === "EMPLOYEE" ? "/payslips/me" : "/payroll";
    api<PayrollRecord[]>(path).then(setRecords).catch((err) => setError(err.message));
  }, [user.role]);

  return (
    <AppShell user={user}>
      <PageHeader title="Payslips" description="View available payslips." />
      {error ? <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      <section className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="table-cell">Employee</th>
                <th className="table-cell">Month</th>
                <th className="table-cell">Gross</th>
                <th className="table-cell">Deductions</th>
                <th className="table-cell">Net</th>
                <th className="table-cell">View</th>
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
                    <Link className="btn btn-secondary h-9 px-3" href={`/payslips/${record.id}`} title="View payslip">
                      <FileText size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
              {!records.length ? (
                <tr>
                  <td className="table-cell text-slate-500" colSpan={6}>No payslips available yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
