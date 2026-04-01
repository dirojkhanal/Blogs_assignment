"use client";
 
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PenLine, ArrowRight, Shield, Users, BookOpen } from "lucide-react";
 
const FEATURES = [
  {
    icon: PenLine,
    title: "Write & Publish",
    desc: "Draft posts privately or publish them instantly to the world.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    desc: "Authors manage their own posts. Admins have full platform oversight.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    desc: "JWT auth, bcrypt-hashed passwords, and server-enforced permissions.",
  },
];
 
export default function HomePage() {
  const { data: session, status } = useSession();
 
  return (
    <div className="page-enter" style={{ minHeight: "calc(100vh - 60px)" }}>
 
      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "6rem 1.5rem 4rem",
          textAlign: "center",
        }}
      >
        {/* Eyebrow pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.35rem 1rem",
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.18)",
            borderRadius: 999,
            marginBottom: "2rem",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--color-accent)",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.03em",
          }}
        >
          <BookOpen size={13} />
          Open Blog Platform
        </div>
 
        <h1
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            color: "var(--color-text)",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}
        >
          Write stories{" "}
          <span style={{ color: "var(--color-accent)" }}>worth reading.</span>
        </h1>
 
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--color-muted)",
            maxWidth: 480,
            margin: "0 auto 2.5rem",
            lineHeight: 1.75,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          A clean, secure blogging platform with authentication and
          role-based access control built in.
        </p>
 
        {/* CTA buttons — only render once session resolves */}
        {status !== "loading" && (
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {session ? (
              <>
                <Link href="/dashboard" className="btn-primary" style={{ textDecoration: "none" }}>
                  <LayoutDashboard />
                  Go to Dashboard
                  <ArrowRight size={15} />
                </Link>
                {session.user?.role === "admin" && (
                  <Link href="/admin" className="btn-secondary" style={{ textDecoration: "none" }}>
                    <Shield size={15} />
                    Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/register" className="btn-primary" style={{ textDecoration: "none" }}>
                  Start Writing Free
                  <ArrowRight size={15} />
                </Link>
                <Link href="/posts" className="btn-secondary" style={{ textDecoration: "none" }}>
                  Browse Posts
                </Link>
              </>
            )}
          </div>
        )}
      </section>
 
      {/* ── Dark stats bar ── */}
      <div style={{ background: "var(--nav-bg)", padding: "2rem 1.5rem", marginBottom: "5rem" }}>
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            gap: "4rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Roles", value: "2" },
            { label: "Auth Strategy", value: "JWT" },
            { label: "Stack", value: "Next + Express" },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.625rem",
                  color: "white",
                  letterSpacing: "-0.03em",
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "'DM Sans', sans-serif",
                  marginTop: "0.2rem",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* ── Feature cards ── */}
      <section
        style={{ maxWidth: 1000, margin: "0 auto", padding: "0 1.5rem 6rem" }}
      >
        <h2
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "1.75rem",
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: "-0.03em",
            marginBottom: "0.5rem",
          }}
        >
          Everything you need
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "var(--color-muted)",
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: "2.5rem",
          }}
        >
          Built with real-world engineering fundamentals.
        </p>
 
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card" style={{ padding: "1.75rem" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <Icon size={20} color="var(--color-accent)" />
              </div>
              <h3
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  color: "var(--color-muted)",
                  fontSize: "0.9rem",
                  lineHeight: 1.65,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>
 
      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid var(--color-border)",
          padding: "1.75rem 1.5rem",
          textAlign: "center",
          color: "var(--color-muted)",
          fontSize: "0.8125rem",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        © {new Date().getFullYear()} BlogSphere · Next.js + PostgreSQL + Express
      </footer>
    </div>
  );
}
 
/* Inline icon to avoid import issue with conditional rendering */
function LayoutDashboard() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}