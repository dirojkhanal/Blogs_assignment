"use client";
 
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { ArrowLeft, Pencil, Trash2, Clock, User, Eye, AlertCircle } from "lucide-react";
 
function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}
 
export default function SinglePostPage() {
  const { id }              = useParams();
  const router              = useRouter();
  const { data: session }   = useSession();
  const [post, setPost]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]   = useState("");
 
  useEffect(() => {
    api.get(`/posts/${id}`)
      .then((res) => setPost(res.data?.data?.post))
      .catch(() => setError("Post not found or has been removed."))
      .finally(() => setLoading(false));
  }, [id]);
 
  const isOwner = session?.user?.email === post?.author_email ||
                  session?.user?.name  === post?.author_name;
  const isAdmin = session?.user?.role === "admin";
 
  const handleDelete = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      router.push(isAdmin ? "/admin" : "/dashboard");
    } catch {
      alert("Failed to delete post.");
      setDeleting(false);
    }
  };
 
  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ maxWidth: 780, margin: "4rem auto", padding: "0 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
        <span className="spinner" />
        Loading post…
      </div>
    );
  }
 
  /* ── Error / not found ── */
  if (error || !post) {
    return (
      <div style={{ maxWidth: 780, margin: "4rem auto", padding: "0 1.5rem" }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: "0.625rem",
            padding: "1rem 1.25rem",
            background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10,
            color: "#B91C1C", fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <AlertCircle size={18} />
          {error || "Post not found."}
        </div>
        <Link
          href="/posts"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", marginTop: "1rem", color: "var(--color-accent)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}
        >
          <ArrowLeft size={14} />
          Back to posts
        </Link>
      </div>
    );
  }
 
  /* ── Post ── */
  return (
    <div className="page-enter" style={{ maxWidth: 780, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
 
      {/* Back link */}
      <Link
        href="/posts"
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.35rem",
          color: "var(--color-muted)", textDecoration: "none",
          fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif",
          marginBottom: "2rem", transition: "color 0.15s",
        }}
      >
        <ArrowLeft size={14} />
        All posts
      </Link>
 
      <article>
        {/* Status badge */}
        <div style={{ marginBottom: "1rem" }}>
          <span className={`badge ${post.status === "published" ? "badge-published" : "badge-draft"}`}>
            {post.status}
          </span>
        </div>
 
        {/* Title */}
        <h1
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1.12,
            marginBottom: "1.25rem",
            color: "var(--color-text)",
          }}
        >
          {post.title}
        </h1>
 
        {/* Meta row */}
        <div
          style={{
            display: "flex", flexWrap: "wrap", alignItems: "center",
            gap: "1.25rem",
            paddingBottom: "1.5rem",
            marginBottom: "2rem",
            borderBottom: "2px solid var(--color-border)",
          }}
        >
          {post.author_name && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif", color: "var(--color-muted)" }}>
              <div
                style={{
                  width: 28, height: 28,
                  background: "var(--color-accent)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <User size={13} color="white" />
              </div>
              <strong style={{ color: "var(--color-text)" }}>{post.author_name}</strong>
            </span>
          )}
          {(post.published_at || post.created_at) && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.875rem", color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
              <Clock size={14} />
              {formatDate(post.published_at || post.created_at)}
            </span>
          )}
          {post.views_count !== undefined && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.875rem", color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
              <Eye size={14} />
              {post.views_count + 1} views
            </span>
          )}
        </div>
 
        {/* Body */}
        <div
          style={{
            fontSize: "1.0625rem",
            lineHeight: 1.85,
            color: "#374151",
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "pre-wrap",
            marginBottom: "3rem",
          }}
        >
          {post.content}
        </div>
 
        {/* Owner / admin actions */}
        {(isOwner || isAdmin) && (
          <div
            style={{
              display: "flex", gap: "0.75rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            {isOwner && (
              <Link href={`/posts/${post.id}/edit`} className="btn-secondary" style={{ textDecoration: "none" }}>
                <Pencil size={14} />
                Edit Post
              </Link>
            )}
            <button
              className="btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting
                ? <span className="spinner" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white", width: 14, height: 14 }} />
                : <Trash2 size={14} />
              }
              Delete
            </button>
          </div>
        )}
      </article>
    </div>
  );
}