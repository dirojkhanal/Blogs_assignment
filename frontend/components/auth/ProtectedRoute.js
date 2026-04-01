// frontend/components/auth/ProtectedRoute.js

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, requiredRole = null, redirectTo = "/login" }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) { router.replace(redirectTo); return; }
    if (requiredRole && session.user?.role !== requiredRole) router.replace("/dashboard");
  }, [session, status, requiredRole, redirectTo, router]);

  if (status === "loading") {
    return <div className="page" style={{ color: "#888" }}>Loading...</div>;
  }

  if (!session) return null;
  if (requiredRole && session.user?.role !== requiredRole) return null;

  return <>{children}</>;
}