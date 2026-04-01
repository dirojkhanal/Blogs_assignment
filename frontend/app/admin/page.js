"use client";
 
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PostCard from "@/components/ui/PostCard";
import api from "@/lib/axios";
import { ShieldCheck, FileText, BookOpen, PenLine, Eye, ChevronLeft, ChevronRight } from "lucide-react";
 
/* ── Inner page (rendered only when admin role passes) ── */
function AdminContent() {
  const [posts, setPosts]         = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [page, setPage]           = useState(1);
 
  const fetchPosts = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/posts/admin/all?page=${p}&limit=10`);
      setPosts(res.data?.data?.posts || []);
      setPagination(res.data?.data?.pagination || null);
    } catch {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { fetchPosts(page); }, [page]);
 
  const handleDelete = async (postId) => {
    if (!confirm("Permanently delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      alert("Failed to delete post.");
    }
  };
 
  const published = posts.filter((p) => p.status === "published");
  const drafts    = posts.filter((p) => p.status === "draft");
 
  return (
    <div className="page-enter" style={{ maxWidth: 1000, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
 
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
          <div
            style={{
              width: 36, height: 36,
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.18)",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ShieldCheck size={18} color="var(--color-accent)" />
          </div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.03em" }}>
            Admin Panel
          </h1>
        </div>
        <p style={{ color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
          Full visibility and control over all posts on the platform.
        </p>
      </div>
 
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          { icon: Eye,      label: "Total Posts",  value: pagination?.total ?? "—", accent: true },
          { icon: FileText, label: "This Page",    value: posts.length },
          { icon: BookOpen, label: "Published",    value: published.length },
          { icon: PenLine,  label: "Drafts",       value: drafts.length },
        ].map(({ icon: Icon, label, value, accent }) => (
          <div
            key={label}
            className="card"
            style={{
              padding: "1.25rem",
              borderLeft: accent ? "3px solid var(--color-accent)" : "3px solid transparent",
              display: "flex", alignItems: "center", gap: "0.875rem",
            }}
          >
            <Icon size={18} color={accent ? "var(--color-accent)" : "var(--color-muted)"} />
            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.375rem", letterSpacing: "-0.03em" }}>
                {value}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>
 
      {/* Info banner */}
      <div
        style={{
          padding: "0.75rem 1rem",
          background: "rgba(99,102,241,0.05)",
          border: "1px solid rgba(99,102,241,0.14)",
          borderRadius: 8,
          marginBottom: "1.5rem",
          display: "flex", alignItems: "center", gap: "0.5rem",
          fontSize: "0.875rem", color: "#4338CA",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <ShieldCheck size={15} />
        As admin, you can delete any post regardless of author.
      </div>
 
      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "2rem", color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
          <span className="spinner" />
          Loading all posts…
        </div>
      )}
 
      {/* Error */}
      {error && (
        <div style={{ padding: "1rem", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, color: "#B91C1C", fontFamily: "'DM Sans', sans-serif" }}>
          {error}
        </div>
      )}
 
      {/* Empty */}
      {!loading && !error && posts.length === 0 && (
        <div className="card" style={{ padding: "2.5rem", textAlign: "center", color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
          No posts on the platform yet.
        </div>
      )}
 
      {/* Post list */}
      {!loading && posts.length > 0 && (
        <>
          <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={handleDelete} showAdminActions />
            ))}
          </div>
 
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
              <button
                className="btn-secondary"
                onClick={() => setPage((p) => p - 1)}
                disabled={!pagination.hasPrev}
                style={{ padding: "0.5rem 1rem" }}
              >
                <ChevronLeft size={15} />
                Prev
              </button>
              <span style={{ fontSize: "0.875rem", color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="btn-secondary"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                style={{ padding: "0.5rem 1rem" }}
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
 
/* Exported page — admin role enforced by ProtectedRoute */
export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  );
}