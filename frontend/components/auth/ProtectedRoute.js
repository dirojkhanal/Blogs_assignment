"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  requiredRole = null,
  redirectTo = "/login",
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // Not logged in
    if (!session) {
      router.replace(redirectTo);
      return;
    }

    // Role mismatch
    if (requiredRole && session.user?.role !== requiredRole) {
      router.replace("/dashboard");
      return;
    }
  }, [session, status, requiredRole, redirectTo, router]);

  //  Loading state
  if (status === "loading") {
    return <div className="page" style={{ color: "#888" }}>Loading...</div>;
  }

  //  Not logged in → don't render anything
  if (!session) return null;

  //  Wrong role → don't render
  if (requiredRole && session.user?.role !== requiredRole) return null;

  return <>{children}</>;
}