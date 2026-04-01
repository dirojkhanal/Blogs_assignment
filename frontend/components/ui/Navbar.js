"use client";
 
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { PenLine, LayoutDashboard, ShieldCheck, FileText, LogOut, User } from "lucide-react";
 
export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
 
  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + "/");
 
  return (
    <nav
      style={{
        background: "var(--nav-bg)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 1.5rem",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
        >
          <div
            style={{
              width: 32, height: 32,
              background: "var(--color-accent)",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <PenLine size={15} color="white" />
          </div>
          <span
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: "1.125rem",
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            BlogSphere
          </span>
        </Link>
 
        {/* ── Nav Links ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          {/* Posts — always visible */}
          <NavLink href="/posts" active={isActive("/posts")} icon={<FileText size={14} />}>
            Blog
          </NavLink>
 
          {/* Dashboard — logged-in only */}
          {session && (
            <NavLink href="/dashboard" active={isActive("/dashboard")} icon={<LayoutDashboard size={14} />}>
              Dashboard
            </NavLink>
          )}
 
          {/* Admin — admin role only */}
          {session?.user?.role === "admin" && (
            <NavLink href="/admin" active={isActive("/admin")} icon={<ShieldCheck size={14} />}>
              Admin
            </NavLink>
          )}
        </div>
 
        {/* ── Auth Area ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {session ? (
            <>
              {/* User chip */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.3rem 0.75rem",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 999,
                }}
              >
                <div
                  style={{
                    width: 24, height: 24,
                    background: "var(--color-accent)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <User size={12} color="white" />
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    fontFamily: "'DM Sans', sans-serif",
                    maxWidth: 120,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {session.user.name}
                </span>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    padding: "0.1rem 0.4rem",
                    borderRadius: 999,
                    background:
                      session.user.role === "admin"
                        ? "rgba(99,102,241,0.3)"
                        : "rgba(255,255,255,0.1)",
                    color:
                      session.user.role === "admin"
                        ? "#A5B4FC"
                        : "rgba(255,255,255,0.55)",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {session.user.role}
                </span>
              </div>
 
              {/* Logout */}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{
                  display: "flex", alignItems: "center", gap: "0.35rem",
                  padding: "0.4rem 0.75rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.875rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  borderRadius: 6,
                  transition: "color 0.15s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "white")}
                onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  padding: "0.4rem 0.875rem",
                  borderRadius: 6,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                style={{
                  padding: "0.4rem 0.875rem",
                  borderRadius: 6,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "white",
                  background: "var(--color-accent)",
                  textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
 
/* Small helper so nav links stay DRY */
function NavLink({ href, active, icon, children }) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.4rem 0.875rem",
        borderRadius: 6,
        fontSize: "0.875rem",
        fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif",
        textDecoration: "none",
        color: active ? "white" : "rgba(255,255,255,0.55)",
        background: active ? "rgba(255,255,255,0.1)" : "transparent",
        transition: "all 0.15s",
      }}
    >
      {icon}
      {children}
    </Link>
  );
}