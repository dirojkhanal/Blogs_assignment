"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, PenLine } from "lucide-react";
 
/* Live password-strength hints */
function PasswordHints({ password }) {
  const rules = [
    { label: "8+ characters",    ok: password.length >= 8 },
    { label: "Uppercase",        ok: /[A-Z]/.test(password) },
    { label: "Lowercase",        ok: /[a-z]/.test(password) },
    { label: "Number",           ok: /\d/.test(password) },
  ];
  if (!password) return null;
  return (
    <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
      {rules.map(({ label, ok }) => (
        <span
          key={label}
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.25rem",
            fontSize: "0.75rem", fontFamily: "'DM Sans', sans-serif",
            color: ok ? "var(--color-success)" : "var(--color-muted)",
          }}
        >
          <CheckCircle size={11} color={ok ? "var(--color-success)" : "#D1D5DB"} />
          {label}
        </span>
      ))}
    </div>
  );
}
 
export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
 
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
 
    try {
      // Role is always "user" — backend validator enforces this too
      await api.post("/auth/register", { ...form, role: "user" });
      router.push("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
            Create your account
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "0.9375rem", fontFamily: "'DM Sans', sans-serif" }}>
            Start writing and sharing today
          </p>
        </div>
 
        {/* ── Form card ── */}
        <div className="card" style={{ padding: "2rem" }}>
 
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
 
            {/* Full Name */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", fontFamily: "'DM Sans', sans-serif" }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User size={15} color="var(--color-muted)"
                  style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                />
                <input
                  type="text" name="name" className="input-base"
                  placeholder="Jane Smith"
                  value={form.name} onChange={handleChange}
                  required minLength={2}
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>
            </div>
 
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
                  placeholder="Min. 8 characters"
                  value={form.password} onChange={handleChange}
                  required minLength={8}
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
              <PasswordHints password={form.password} />
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
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
 
        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--color-accent)", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}