"use client";
 
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Eye, Pencil, Trash2, Clock, User } from "lucide-react";
 
function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
 
/**
 * @param {object}   post              - post object from API
 * @param {function} [onDelete]        - called with post.id when Delete is clicked
 * @param {boolean}  [showAdminActions]- if true, always shows the delete button (admin view)
 */
export default function PostCard({ post, onDelete, showAdminActions = false }) {
  const { data: session } = useSession();
 
  const isOwner =
    session?.user?.email === post.author_email ||
    session?.user?.name === post.author_name;
  const isAdmin = session?.user?.role === "admin";
 
  const canEdit   = isOwner;
  const canDelete = isOwner || isAdmin || showAdminActions;
 
  const excerpt =
    post.content?.length > 130
      ? post.content.slice(0, 130) + "…"
      : post.content;
 
  return (
    <article
      className="card"
      style={{ padding: "1.5rem", transition: "box-shadow 0.2s, transform 0.2s" }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* ── Title + status ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          marginBottom: "0.625rem",
        }}
      >
        <Link href={`/posts/${post.id}`} style={{ textDecoration: "none", flex: 1 }}>
          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: "1.0625rem",
              color: "var(--color-text)",
              lineHeight: 1.35,
              transition: "color 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
            onMouseOut={(e) => (e.currentTarget.style.color = "var(--color-text)")}
          >
            {post.title}
          </h2>
        </Link>
        <span className={`badge ${post.status === "published" ? "badge-published" : "badge-draft"}`}>
          {post.status}
        </span>
      </div>
 
      {/* ── Excerpt ── */}
      <p
        style={{
          color: "var(--color-muted)",
          fontSize: "0.9rem",
          lineHeight: 1.65,
          marginBottom: "1rem",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {excerpt}
      </p>
 
      {/* ── Meta ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.875rem",
          fontSize: "0.8125rem",
          color: "var(--color-muted)",
          marginBottom: "1rem",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {post.author_name && (
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <User size={13} />
            {post.author_name}
          </span>
        )}
        {(post.published_at || post.created_at) && (
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Clock size={13} />
            {formatDate(post.published_at || post.created_at)}
          </span>
        )}
        {post.views_count !== undefined && (
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Eye size={13} />
            {post.views_count} views
          </span>
        )}
      </div>
 
      {/* ── Action buttons ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          paddingTop: "0.875rem",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <Link
          href={`/posts/${post.id}`}
          style={{
            display: "flex", alignItems: "center", gap: "0.3rem",
            padding: "0.35rem 0.75rem", borderRadius: 6,
            fontSize: "0.8125rem", fontWeight: 500,
            color: "var(--color-accent)",
            background: "rgba(99,102,241,0.08)",
            textDecoration: "none",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <Eye size={13} />
          Read
        </Link>
 
        {canEdit && (
          <Link
            href={`/posts/${post.id}/edit`}
            style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              padding: "0.35rem 0.75rem", borderRadius: 6,
              fontSize: "0.8125rem", fontWeight: 500,
              color: "#374151", background: "#F3F4F6",
              textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Pencil size={13} />
            Edit
          </Link>
        )}
 
        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(post.id)}
            style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              padding: "0.35rem 0.75rem", borderRadius: 6,
              fontSize: "0.8125rem", fontWeight: 500,
              color: "var(--color-danger)", background: "#FEF2F2",
              border: "none", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Trash2 size={13} />
            Delete
          </button>
        )}
      </div>
    </article>
  );
}