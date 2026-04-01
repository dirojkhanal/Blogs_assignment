"use client";
 
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PostCard from "@/components/ui/PostCard";
import api from "@/lib/axios";
 
export default function PostsPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
 
  const fetchPosts = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/posts?page=${p}&limit=9`);
      setPosts(res.data?.data?.posts || []);
      setPagination(res.data?.data?.pagination || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { fetchPosts(page); }, [page]);
 
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Blog</h1>
          <p className="page-subtitle">
            {pagination?.total
              ? `${pagination.total} published post${pagination.total !== 1 ? "s" : ""}`
              : "All published posts"}
          </p>
        </div>
        {session && (
          <Link href="/posts/create" className="btn btn-primary btn-sm">Write a Post</Link>
        )}
      </div>
 
      {loading && <p style={{ color: "#888" }}>Loading...</p>}
 
      {!loading && posts.length === 0 && (
        <div className="empty-state">
          <p>No posts published yet.</p>
          {session && (
            <Link href="/posts/create" className="btn btn-sm">Be the first to write</Link>
          )}
        </div>
      )}
 
      {!loading && posts.length > 0 && (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
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