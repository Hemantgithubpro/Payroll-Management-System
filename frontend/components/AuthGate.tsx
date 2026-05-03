"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser, getToken } from "@/lib/api";
import type { Role, User } from "@/lib/types";

type AuthGateProps = {
  roles?: Role[];
  children: (user: User) => React.ReactNode;
};

export function AuthGate({ roles, children }: AuthGateProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();

    if (!token || !storedUser) {
      router.replace("/login");
      return;
    }

    if (roles && !roles.includes(storedUser.role)) {
      router.replace(storedUser.role === "EMPLOYEE" ? "/payslips" : "/dashboard");
      return;
    }

    setUser(storedUser);
    setReady(true);
  }, [roles, router]);

  if (!ready || !user) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading...</div>;
  }

  return <>{children(user)}</>;
}
