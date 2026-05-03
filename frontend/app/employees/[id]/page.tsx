"use client";

import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { EmployeeForm } from "@/components/EmployeeForm";
import { PageHeader } from "@/components/PageHeader";

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  return (
    <AuthGate roles={["ADMIN", "HR"]}>
      {(user) => (
        <AppShell user={user}>
          <PageHeader title="Edit Employee" description="Update employee profile and banking details." />
          <EmployeeForm id={params.id} />
        </AppShell>
      )}
    </AuthGate>
  );
}
