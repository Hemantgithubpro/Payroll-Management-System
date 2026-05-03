"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Employee } from "@/lib/types";

const emptyEmployee = {
  employee_code: "",
  full_name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  joining_date: "",
  bank_name: "",
  bank_account_no: "",
  tax_id: "",
  status: "ACTIVE"
};

export function EmployeeForm({ id }: { id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyEmployee);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    api<Employee>(`/employees/${id}`)
      .then((employee) =>
        setForm({
          employee_code: employee.employee_code,
          full_name: employee.full_name,
          email: employee.email,
          phone: employee.phone || "",
          department: employee.department,
          designation: employee.designation,
          joining_date: employee.joining_date.slice(0, 10),
          bank_name: employee.bank_name || "",
          bank_account_no: employee.bank_account_no || "",
          tax_id: employee.tax_id || "",
          status: employee.status
        })
      )
      .catch((err) => setError(err.message));
  }, [id]);

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api(id ? `/employees/${id}` : "/employees", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(form)
      });
      router.push("/employees");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save employee");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="panel p-5" onSubmit={submit}>
      {error ? <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Employee Code
          <input className="field mt-1" required value={form.employee_code} onChange={(e) => update("employee_code", e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Full Name
          <input className="field mt-1" required value={form.full_name} onChange={(e) => update("full_name", e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Email
          <input className="field mt-1" required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Phone
          <input className="field mt-1" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Department
          <input className="field mt-1" required value={form.department} onChange={(e) => update("department", e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Designation
          <input className="field mt-1" required value={form.designation} onChange={(e) => update("designation", e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Joining Date
          <input className="field mt-1" required type="date" value={form.joining_date} onChange={(e) => update("joining_date", e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Status
          <select className="field mt-1" value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Bank Name
          <input className="field mt-1" value={form.bank_name} onChange={(e) => update("bank_name", e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Bank Account No
          <input className="field mt-1" value={form.bank_account_no} onChange={(e) => update("bank_account_no", e.target.value)} />
        </label>
        <label className="text-sm font-medium md:col-span-2">
          Tax ID
          <input className="field mt-1" value={form.tax_id} onChange={(e) => update("tax_id", e.target.value)} />
        </label>
      </div>
      <div className="mt-5 flex justify-end">
        <button className="btn btn-primary" disabled={saving}>
          <Save size={16} />
          {saving ? "Saving..." : "Save Employee"}
        </button>
      </div>
    </form>
  );
}
