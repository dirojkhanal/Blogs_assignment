"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">BlogSphere</Link>

      <div className="navbar-links">
        <Link href="/posts" className={pathname.startsWith("/posts") ? "active" : ""}>
          Blog
        </Link>
        {session && (
          <Link href="/dashboard" className={pathname === "/dashboard" ? "active" : ""}>
            Dashboard
          </Link>
        )}
        {session?.user?.role === "admin" && (
          <Link href="/admin" className={pathname === "/admin" ? "active" : ""}>
            Admin
          </Link>
        )}
      </div>

      <div className="navbar-auth">
        {session ? (
          <>
            <span className="navbar-user">
              {session.user.name}
              {session.user.role === "admin" && (
                <span className="role-badge">admin</span>
              )}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="btn btn-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Sign in</Link>
            <Link href="/register" className="btn btn-sm btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}