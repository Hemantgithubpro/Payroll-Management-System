"use client";

import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { EmployeeForm } from "@/components/EmployeeForm";
import { PageHeader } from "@/components/PageHeader";

export default function NewEmployeePage() {
  return (
    <AuthGate roles={["ADMIN", "HR"]}>
      {(user) => (
        <AppShell user={user}>
          <PageHeader title="Add Employee" description="Create a new employee profile." />
          <EmployeeForm />
        </AppShell>
      )}
    </AuthGate>
  );
}
