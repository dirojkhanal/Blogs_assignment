"use client";
 
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PostCard from "@/components/ui/PostCard";
import api from "@/lib/axios";
 
function AdminContent() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
 
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
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      alert("Failed to delete.");
    }
  };
 
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">Manage all posts on the platform.</p>
        </div>
      </div>
 
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-number">{pagination?.total ?? "—"}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{posts.filter((p) => p.status === "published").length}</div>
          <div className="stat-label">Published</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{posts.filter((p) => p.status === "draft").length}</div>
          <div className="stat-label">Drafts</div>
        </div>
      </div>
 
      <div className="notice">
        As admin, you can delete any post regardless of who wrote it.
      </div>
 
      {loading && <p style={{ color: "#888" }}>Loading...</p>}
      {error && <div className="alert">{error}</div>}
      {!loading && posts.length === 0 && <p style={{ color: "#888" }}>No posts yet.</p>}
 
      {!loading && posts.length > 0 && (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handleDelete} showAdminActions />
          ))}
 
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!pagination.hasPrev}
                className="btn btn-sm"
              >
                Prev
              </button>
              <span>Page {pagination.page} of {pagination.totalPages}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                className="btn btn-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
 
export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  );
}