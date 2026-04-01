"use client";
 
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PostCard from "@/components/ui/PostCard";
import api from "@/lib/axios";
import { PenLine, FileText, BookOpen, Eye, Plus } from "lucide-react";
 
/* ── Small stat card ── */
function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div
      className="card"
      style={{
        padding: "1.25rem 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        borderLeft: accent ? "3px solid var(--color-accent)" : "3px solid transparent",
      }}
    >
      <div
        style={{
          width: 40, height: 40,
          background: accent ? "rgba(99,102,241,0.08)" : "#F3F4F6",
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={accent ? "var(--color-accent)" : "var(--color-muted)"} />
      </div>
      <div>
        <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.03em" }}>
          {value}
        </div>
        <div style={{ fontSize: "0.8125rem", color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
          {label}
        </div>
      </div>
    </div>
  );
}
 
/* ── Inner page (rendered only when auth passes) ── */
function DashboardContent() {
  const { data: session } = useSession();
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
 
  useEffect(() => {
    api.get("/posts/user/my-posts")
      .then((res) => setPosts(res.data?.data?.posts || []))
      .catch(() => setError("Failed to load your posts."))
      .finally(() => setLoading(false));
  }, []);
 
  const handleDelete = async (postId) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      alert("Failed to delete post.");
    }
  };
 
  const published  = posts.filter((p) => p.status === "published");
  const drafts     = posts.filter((p) => p.status === "draft");
  const totalViews = posts.reduce((sum, p) => sum + (p.views_count || 0), 0);
 
  return (
    <div className="page-enter" style={{ maxWidth: 1000, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
 
      {/* Header */}
      <div
        style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", flexWrap: "wrap",
          gap: "1rem", marginBottom: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>
            My Dashboard
          </h1>
          <p style={{ color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
            Welcome back, <strong style={{ color: "var(--color-text)" }}>{session?.user?.name}</strong>
          </p>
        </div>
        <Link href="/posts/create" className="btn-primary" style={{ textDecoration: "none" }}>
          <Plus size={15} />
          New Post
        </Link>
      </div>
 
      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        <StatCard icon={FileText} label="Total Posts"  value={posts.length}    accent />
        <StatCard icon={BookOpen} label="Published"    value={published.length} />
        <StatCard icon={PenLine}  label="Drafts"       value={drafts.length}    />
        <StatCard icon={Eye}      label="Total Views"  value={totalViews}       />
      </div>
 
      {/* Section header */}
      <div
        style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "1.25rem",
        }}
      >
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.125rem", letterSpacing: "-0.02em" }}>
          Your Posts
        </h2>
        <Link
          href="/posts"
          style={{ fontSize: "0.875rem", color: "var(--color-accent)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
        >
          Browse all public posts →
        </Link>
      </div>
 
      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "2rem", color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
          <span className="spinner" />
          Loading your posts…
        </div>
      )}
 
      {/* Error */}
      {error && (
        <div style={{ padding: "1rem", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, color: "#B91C1C", fontFamily: "'DM Sans', sans-serif" }}>
          {error}
        </div>
      )}
 
      {/* Empty state */}
      {!loading && !error && posts.length === 0 && (
        <div className="card" style={{ padding: "3.5rem", textAlign: "center" }}>
          <PenLine size={38} color="var(--color-muted)" style={{ margin: "0 auto 1rem" }} />
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, marginBottom: "0.5rem" }}>
            No posts yet
          </h3>
          <p style={{ color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "1.5rem" }}>
            Write your first post and share it with the world.
          </p>
          <Link href="/posts/create" className="btn-primary" style={{ textDecoration: "none" }}>
            <Plus size={15} />
            Create your first post
          </Link>
        </div>
      )}
 
      {/* Posts grid */}
      {!loading && posts.length > 0 && (
        <div style={{ display: "grid", gap: "1rem" }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
 
/* Exported page — wrapped in ProtectedRoute */
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}