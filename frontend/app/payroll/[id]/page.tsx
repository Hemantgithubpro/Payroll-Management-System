"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { PayslipCard } from "@/components/PayslipCard";
import { api } from "@/lib/api";
import type { PayrollRecord } from "@/lib/types";

export default function PayrollDetailPage({ params }: { params: { id: string } }) {
  const [record, setRecord] = useState<PayrollRecord | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<PayrollRecord>(`/payroll/${params.id}`).then(setRecord).catch((err) => setError(err.message));
  }, [params.id]);

  return (
    <AuthGate roles={["ADMIN", "HR"]}>
      {(user) => (
        <AppShell user={user}>
          <PageHeader title="Payroll Detail" description="View generated payroll as a simple payslip." />
          {error ? <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
          {record ? <PayslipCard record={record} /> : null}
        </AppShell>
      )}
    </AuthGate>
  );
}
