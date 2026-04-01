// frontend/app/posts/create/page.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function CreatePostContent() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", status: "draft" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e, overrideStatus) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = { ...form };
    if (overrideStatus) payload.status = overrideStatus;
    try {
      const res = await api.post("/posts", payload);
      const newId = res.data?.data?.post?.id;
      router.push(newId ? `/posts/${newId}` : "/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href="/dashboard" className="back-link" style={{ marginBottom: 0 }}>← Back</Link>
        <h1 className="page-title">New Post</h1>
      </div>

      {error && <div className="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Give your post a title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            placeholder="Write your post here..."
          />
          <div className="word-count">{wordCount} words</div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "draft")}
            disabled={loading}
            className="btn"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "published")}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
          <Link href="/dashboard" className="cancel-link">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default function CreatePostPage() {
  return (
    <ProtectedRoute>
      <CreatePostContent />
    </ProtectedRoute>
  );
}