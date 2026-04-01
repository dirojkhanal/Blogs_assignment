"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function SinglePostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then((res) => setPost(res.data?.data?.post))
      .catch(() => setError("Post not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner =
    session?.user?.email === post?.author_email ||
    session?.user?.name === post?.author_name;
  const isAdmin = session?.user?.role === "admin";

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`);
      router.push(isAdmin ? "/admin" : "/dashboard");
    } catch {
      alert("Failed to delete.");
    }
  };

  if (loading) return <div className="page" style={{ color: "#888" }}>Loading...</div>;

  if (error || !post) {
    return (
      <div className="page">
        <div className="alert">{error || "Post not found."}</div>
        <Link href="/posts" className="back-link">← Back to posts</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <Link href="/posts" className="back-link">← All posts</Link>

      <article>
        <span className="article-status">{post.status}</span>
        <h1 className="article-title">{post.title}</h1>

        <div className="article-meta">
          {post.author_name && <span>{post.author_name}</span>}
          <span>{formatDate(post.published_at || post.created_at)}</span>
          {post.views_count !== undefined && <span>{post.views_count + 1} views</span>}
        </div>

        <div className="article-body">{post.content}</div>

        {(isOwner || isAdmin) && (
          <div className="article-footer">
            {isOwner && (
              <Link href={`/posts/${post.id}/edit`}>Edit Post</Link>
            )}
            <button onClick={handleDelete}>Delete Post</button>
          </div>
        )}
      </article>
    </div>
  );
}