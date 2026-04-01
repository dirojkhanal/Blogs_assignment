"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function PostCard({ post, onDelete, showAdminActions = false }) {
  const { data: session } = useSession();

  const isOwner =
    session?.user?.email === post.author_email ||
    session?.user?.name === post.author_name;
  const isAdmin = session?.user?.role === "admin";

  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin || showAdminActions;

  const excerpt =
    post.content?.length > 130 ? post.content.slice(0, 130) + "..." : post.content;

  return (
    <div className="post-card">
      <div className="post-card-header">
        <Link href={`/posts/${post.id}`} className="post-card-title">
          {post.title}
        </Link>
        <span className="post-badge">{post.status}</span>
      </div>

      <p className="post-excerpt">{excerpt}</p>

      <div className="post-meta">
        {post.author_name && <span>{post.author_name}</span>}
        <span>{formatDate(post.published_at || post.created_at)}</span>
        {post.views_count !== undefined && <span>{post.views_count} views</span>}
      </div>

      <div className="post-actions">
        <Link href={`/posts/${post.id}`}>Read</Link>
        {canEdit && <Link href={`/posts/${post.id}/edit`}>Edit</Link>}
        {canDelete && onDelete && (
          <button onClick={() => onDelete(post.id)}>Delete</button>
        )}
      </div>
    </div>
  );
}