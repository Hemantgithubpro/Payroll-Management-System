"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/lib/api";
import type { Employee } from "@/lib/types";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState("");

  function loadEmployees() {
    api<Employee[]>("/employees").then(setEmployees).catch((err) => setError(err.message));
  }

  useEffect(loadEmployees, []);

  async function remove(id: number) {
    if (!window.confirm("Delete this employee?")) return;
    await api(`/employees/${id}`, { method: "DELETE" });
    loadEmployees();
  }

  return (
    <AuthGate roles={["ADMIN", "HR"]}>
      {(user) => (
        <AppShell user={user}>
          <PageHeader
            title="Employees"
            description="Create and maintain employee records."
            action={
              <Link className="btn btn-primary" href="/employees/new">
                <Plus size={16} />
                Add Employee
              </Link>
            }
          />
          {error ? <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
          <section className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="table-cell">Code</th>
                    <th className="table-cell">Name</th>
                    <th className="table-cell">Department</th>
                    <th className="table-cell">Designation</th>
                    <th className="table-cell">Status</th>
                    <th className="table-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="table-cell">{employee.employee_code}</td>
                      <td className="table-cell">
                        <div className="font-semibold">{employee.full_name}</div>
                        <div className="text-xs text-slate-500">{employee.email}</div>
                      </td>
                      <td className="table-cell">{employee.department}</td>
                      <td className="table-cell">{employee.designation}</td>
                      <td className="table-cell">{employee.status}</td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <Link className="btn btn-secondary h-9 px-3" href={`/employees/${employee.id}`} title="Edit employee">
                            <Pencil size={15} />
                          </Link>
                          <button className="btn btn-danger h-9 px-3" onClick={() => remove(employee.id)} title="Delete employee">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </AppShell>
      )}
    </AuthGate>
  );
}
