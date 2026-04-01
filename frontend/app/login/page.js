"use client";
 
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, AlertCircle, PenLine } from "lucide-react";
 
export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
 
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
 
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
 
    setLoading(false);
 
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }
 
    router.push("/dashboard");
    router.refresh();
  };
 
  return (
    <div
      className="page-enter"
      style={{
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
 
        {/* ── Logo block ── */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: 52, height: 52,
              background: "var(--nav-bg)",
              borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <PenLine size={22} color="var(--color-accent)" />
          </div>
          <h1
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: "1.625rem",
              letterSpacing: "-0.03em",
              marginBottom: "0.35rem",
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "0.9375rem", fontFamily: "'DM Sans', sans-serif" }}>
            Sign in to your BlogSphere account
          </p>
        </div>
 
        {/* ── Form card ── */}
        <div className="card" style={{ padding: "2rem" }}>
 
          {/* Error banner */}
          {error && (
            <div
              style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.75rem 1rem",
                background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8,
                marginBottom: "1.5rem",
                color: "#B91C1C", fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}
 
          <form onSubmit={handleSubmit}>
 
            {/* Email */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", fontFamily: "'DM Sans', sans-serif" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={15} color="var(--color-muted)"
                  style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                />
                <input
                  type="email" name="email" className="input-base"
                  placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                  required
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>
            </div>
 
            {/* Password */}
            <div style={{ marginBottom: "1.75rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", fontFamily: "'DM Sans', sans-serif" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={15} color="var(--color-muted)"
                  style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                />
                <input
                  type={showPwd ? "text" : "password"} name="password" className="input-base"
                  placeholder="••••••••"
                  value={form.password} onChange={handleChange}
                  required
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  style={{
                    position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    color: "var(--color-muted)",
                  }}
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
 
            <button
              type="submit" className="btn-primary"
              disabled={loading}
              style={{ width: "100%", padding: "0.875rem" }}
            >
              {loading ? (
                <>
                  <span className="spinner"
                    style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }}
                  />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
 
        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "var(--color-accent)", fontWeight: 600, textDecoration: "none" }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}