"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/lib/api";
import type { Employee, User } from "@/lib/types";

export default function ProfilePage() {
  return (
    <AuthGate roles={["EMPLOYEE"]}>
      {(user) => <ProfileContent user={user} />}
    </AuthGate>
  );
}

function ProfileContent({ user }: { user: User }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user.employeeId) return;
    api<Employee>(`/employees/${user.employeeId}`).then(setEmployee).catch((err) => setError(err.message));
  }, [user.employeeId]);

  return (
    <AppShell user={user}>
      <PageHeader title="Profile" description="Your employee information." />
      {error ? <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      {employee ? (
        <section className="panel grid gap-4 p-5 md:grid-cols-2">
          <Info label="Employee Code" value={employee.employee_code} />
          <Info label="Name" value={employee.full_name} />
          <Info label="Email" value={employee.email} />
          <Info label="Phone" value={employee.phone || "-"} />
          <Info label="Department" value={employee.department} />
          <Info label="Designation" value={employee.designation} />
          <Info label="Joining Date" value={employee.joining_date.slice(0, 10)} />
          <Info label="Status" value={employee.status} />
          <Info label="Bank" value={employee.bank_name || "-"} />
          <Info label="Account No" value={employee.bank_account_no || "-"} />
          <Info label="Tax ID" value={employee.tax_id || "-"} />
        </section>
      ) : null}
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-ink">{value}</div>
    </div>
  );
}
