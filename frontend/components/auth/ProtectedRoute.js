"use client";
 
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
 
/**
 * Wrap any page that needs authentication.
 *
 * Usage (auth only):
 *   <ProtectedRoute> <YourPage /> </ProtectedRoute>
 *
 * Usage (admin only):
 *   <ProtectedRoute requiredRole="admin"> <AdminPage /> </ProtectedRoute>
 *
 * @param {string}  [requiredRole]  - "admin" | "user" — if set, enforces role
 * @param {string}  [redirectTo]   - where unauthenticated users go (default /login)
 */
export default function ProtectedRoute({
  children,
  requiredRole = null,
  redirectTo = "/login",
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
 
  useEffect(() => {
    if (status === "loading") return;
 
    // Not logged in → go to login
    if (!session) {
      router.replace(redirectTo);
      return;
    }
 
    // Logged in but wrong role → send to their own dashboard
    if (requiredRole && session.user?.role !== requiredRole) {
      router.replace("/dashboard");
    }
  }, [session, status, requiredRole, redirectTo, router]);
 
  // Still checking session
  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: "1rem",
          fontFamily: "'DM Sans', sans-serif",
          color: "var(--color-muted)",
        }}
      >
        <span
          className="spinner"
          style={{ width: 36, height: 36, borderWidth: 3 }}
        />
        <p>Loading…</p>
      </div>
    );
  }
 
  // Not authorised — return nothing while redirect fires
  if (!session) return null;
  if (requiredRole && session.user?.role !== requiredRole) return null;
 
  return <>{children}</>;
}