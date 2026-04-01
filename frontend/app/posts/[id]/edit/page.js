"use client";
 
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ArrowLeft, Save, Eye, AlertCircle } from "lucide-react";
 
function EditPostContent() {
  const { id }   = useParams();
  const router   = useRouter();
 
  const [form, setForm]       = useState({ title: "", content: "", status: "draft" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
 
  /* Pre-fill form with existing post data */
  useEffect(() => {
    api.get(`/posts/${id}`)
      .then((res) => {
        const post = res.data?.data?.post;
        if (post) setForm({ title: post.title, content: post.content, status: post.status });
      })
      .catch(() => setError("Failed to load post."))
      .finally(() => setLoading(false));
  }, [id]);
 
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
 
  const handleSubmit = async (e, overrideStatus) => {
    e.preventDefault();
    setSaving(true);
    setError("");
 
    const payload = { ...form };
    if (overrideStatus) payload.status = overrideStatus;
 
    try {
      await api.put(`/posts/${id}`, payload);
      router.push(`/posts/${id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save post.");
    } finally {
      setSaving(false);
    }
  };
 
  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;
 
  /* Loading state */
  if (loading) {
    return (
      <div style={{ maxWidth: 780, margin: "4rem auto", padding: "0 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
        <span className="spinner" />
        Loading post…
      </div>
    );
  }
 
  return (
    <div className="page-enter" style={{ maxWidth: 780, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
 
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
        <Link
          href={`/posts/${id}`}
          style={{ display: "flex", alignItems: "center", padding: "0.35rem", color: "var(--color-muted)", textDecoration: "none" }}
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.625rem", letterSpacing: "-0.03em" }}>
          Edit Post
        </h1>
      </div>
 
      {/* Error */}
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
          <AlertCircle size={16} />
          {error}
        </div>
      )}
 
      <div className="card" style={{ padding: "2rem" }}>
        <form onSubmit={handleSubmit}>
 
          {/* Title */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", fontFamily: "'DM Sans', sans-serif" }}>
              Title
            </label>
            <input
              type="text" name="title" className="input-base"
              value={form.title} onChange={handleChange}
              required
              style={{ fontSize: "1rem", fontWeight: 600 }}
            />
          </div>
 
          {/* Content */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                Content
              </label>
              <span style={{ fontSize: "0.75rem", color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
                {wordCount} word{wordCount !== 1 ? "s" : ""}
              </span>
            </div>
            <textarea
              name="content" className="input-base"
              value={form.content} onChange={handleChange}
              required rows={12}
              style={{ resize: "vertical", minHeight: 240, lineHeight: 1.75 }}
            />
          </div>
 
          {/* Status radio */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.625rem", fontFamily: "'DM Sans', sans-serif" }}>
              Status
            </label>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {["draft", "published"].map((s) => (
                <label
                  key={s}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.6rem 1rem",
                    border: `1.5px solid ${form.status === s ? "var(--color-accent)" : "var(--color-border)"}`,
                    borderRadius: 8, cursor: "pointer",
                    background: form.status === s ? "rgba(99,102,241,0.06)" : "transparent",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: 500,
                    color: form.status === s ? "var(--color-accent)" : "var(--color-text)",
                    transition: "all 0.15s",
                  }}
                >
                  <input
                    type="radio" name="status" value={s}
                    checked={form.status === s}
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />
                  {s === "draft" ? "📝" : "🌍"}{" "}
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </label>
              ))}
            </div>
          </div>
 
          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
            <Link href={`/posts/${id}`} className="btn-secondary" style={{ textDecoration: "none" }}>
              Cancel
            </Link>
            <button
              type="button" className="btn-secondary"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={saving}
            >
              <Save size={15} />
              Save as Draft
            </button>
            <button
              type="submit" className="btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                  Saving…
                </>
              ) : (
                <>
                  <Eye size={15} />
                  Save &amp; Publish
                </>
              )}
            </button>
          </div>
 
        </form>
      </div>
    </div>
  );
}
 
export default function EditPostPage() {
  return (
    <ProtectedRoute>
      <EditPostContent />
    </ProtectedRoute>
  );
}