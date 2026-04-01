"use client";
 
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PostCard from "@/components/ui/PostCard";
import api from "@/lib/axios";
 
function DashboardContent() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  useEffect(() => {
    api.get("/posts/user/my-posts")
      .then((res) => setPosts(res.data?.data?.posts || []))
      .catch(() => setError("Failed to load posts."))
      .finally(() => setLoading(false));
  }, []);
 
  const handleDelete = async (postId) => {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      alert("Failed to delete.");
    }
  };
 
  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;
 
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {session?.user?.name}</p>
        </div>
        <Link href="/posts/create" className="btn btn-primary btn-sm">+ New Post</Link>
      </div>
 
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-number">{posts.length}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{published}</div>
          <div className="stat-label">Published</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{drafts}</div>
          <div className="stat-label">Drafts</div>
        </div>
      </div>
 
      <div className="section-header">
        <span className="section-title">Your Posts</span>
        <Link href="/posts" className="section-link">Browse all posts →</Link>
      </div>
 
      {loading && <p style={{ color: "#888" }}>Loading...</p>}
      {error && <div className="alert">{error}</div>}
 
      {!loading && posts.length === 0 && (
        <div className="empty-state">
          <p>You havent written any posts yet.</p>
          <Link href="/posts/create" className="btn btn-sm">Write your first post</Link>
        </div>
      )}
 
      {!loading && posts.length > 0 && posts.map((post) => (
        <PostCard key={post.id} post={post} onDelete={handleDelete} />
      ))}
    </div>
  );
}
 
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}