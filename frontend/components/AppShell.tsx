"use client";

import {
  Banknote,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  UserRound,
  UsersRound,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession } from "@/lib/api";
import type { Role, User } from "@/lib/types";

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
};

const links: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "HR"] },
  { href: "/employees", label: "Employees", icon: UsersRound, roles: ["ADMIN", "HR"] },
  { href: "/salary", label: "Salary", icon: Banknote, roles: ["ADMIN", "HR"] },
  { href: "/attendance", label: "Attendance", icon: CalendarCheck, roles: ["ADMIN", "HR"] },
  { href: "/payroll", label: "Payroll", icon: ReceiptText, roles: ["ADMIN", "HR"] },
  { href: "/payslips", label: "Payslips", icon: FileText, roles: ["ADMIN", "HR", "EMPLOYEE"] },
  { href: "/profile", label: "Profile", icon: UserRound, roles: ["EMPLOYEE"] }
];

export function AppShell({ user, children }: { user: User; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const visibleLinks = links.filter((link) => link.roles.includes(user.role));

  function logout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-paper lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between px-5 lg:h-20">
          <div>
            <div className="text-lg font-bold text-ink">Payroll</div>
            <div className="text-xs font-medium uppercase text-slate-500">{user.role}</div>
          </div>
          <button className="btn btn-secondary lg:hidden" onClick={logout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium ${
                  active ? "bg-blue-50 text-brand" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={18} />
                <span className="whitespace-nowrap">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-slate-100 p-4 lg:absolute lg:bottom-0 lg:block lg:w-full">
          <div className="mb-3 text-sm">
            <div className="font-semibold text-ink">{user.name}</div>
            <div className="truncate text-slate-500">{user.email}</div>
          </div>
          <button className="btn btn-secondary w-full" onClick={logout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="w-full p-4 lg:ml-64 lg:p-8">{children}</main>
    </div>
  );
}
