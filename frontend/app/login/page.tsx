"use client";

import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, setSession } from "@/lib/api";
import type { User } from "@/lib/types";

const demoAccounts = [
  { label: "Admin", email: "admin@payroll.com", password: "admin123" },
  { label: "HR", email: "hr@payroll.com", password: "hr123" },
  { label: "Employee", email: "employee1@payroll.com", password: "employee123" }
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@payroll.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await api<{ token: string; user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setSession(result.token, result.user);
      router.replace(result.user.role === "EMPLOYEE" ? "/payslips" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:grid-cols-[1fr_420px]">
        <section className="bg-ink p-8 text-white md:p-10">
          <div className="mb-10">
            <div className="text-2xl font-bold">Payroll Management System</div>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              Manage employees, salary structures, attendance, payroll generation, and employee payslips from one simple demo app.
            </p>
          </div>

          <div className="grid gap-3">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                className="rounded-md border border-white/15 bg-white/5 p-4 text-left transition hover:bg-white/10"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
                type="button"
              >
                <div className="font-semibold">{account.label}</div>
                <div className="mt-1 text-sm text-slate-300">{account.email}</div>
                <div className="text-sm text-slate-300">{account.password}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="p-6 md:p-8">
          <h1 className="text-xl font-bold text-ink">Login</h1>
          <p className="mt-1 text-sm text-slate-500">Use any default demo account to continue.</p>

          <form className="mt-6 space-y-4" onSubmit={login}>
            {error ? <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
            <label className="block text-sm font-medium">
              Email
              <input className="field mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input className="field mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <button className="btn btn-primary w-full" disabled={loading}>
              <LogIn size={16} />
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
