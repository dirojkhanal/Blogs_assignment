"use client";
 
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PostCard from "@/components/ui/PostCard";
import api from "@/lib/axios";
import { PenLine, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
 
export default function PostsPage() {
  const { data: session }           = useSession();
  const [posts, setPosts]           = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
 
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <BookOpen size={20} color="var(--color-accent)" />
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.03em" }}>
              Blog
            </h1>
          </div>
          <p style={{ color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif" }}>
            {pagination?.total ? `${pagination.total} published post${pagination.total !== 1 ? "s" : ""}` : "All published posts"}
          </p>
        </div>
        {session && (
          <Link href="/posts/create" className="btn-primary" style={{ textDecoration: "none" }}>
            <PenLine size={15} />
            Write a Post
          </Link>
        )}
      </div>
 
      {/* Loading */}
      {loading && (
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.75rem", padding: "4rem",
            color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <span className="spinner" />
          Loading posts…
        </div>
      )}
 
      {/* Empty state */}
      {!loading && posts.length === 0 && (
        <div className="card" style={{ padding: "4rem", textAlign: "center" }}>
          <BookOpen size={42} color="var(--color-muted)" style={{ margin: "0 auto 1rem" }} />
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, marginBottom: "0.5rem" }}>
            No posts yet
          </h3>
          <p style={{ color: "var(--color-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "1.5rem" }}>
            Be the first to publish a post.
          </p>
          {session && (
            <Link href="/posts/create" className="btn-primary" style={{ textDecoration: "none" }}>
              Write the first post
            </Link>
          )}
        </div>
      )}
 
      {/* Grid */}
      {!loading && posts.length > 0 && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2rem",
            }}
          >
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
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