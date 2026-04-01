"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function EditPostContent() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", status: "draft" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then((res) => {
        const post = res.data?.data?.post;
        if (post) setForm({ title: post.title, content: post.content, status: post.status });
      })
      .catch(() => setError("Failed to load post."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e, overrideStatus) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = { ...form };
    if (overrideStatus) payload.status = overrideStatus;
    try {
      await api.put(`/posts/${id}`, payload);
      router.push(`/posts/${id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;

  if (loading) return <div className="page" style={{ color: "#888" }}>Loading...</div>;

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href={`/posts/${id}`} className="back-link" style={{ marginBottom: 0 }}>← Back</Link>
        <h1 className="page-title">Edit Post</h1>
      </div>

      {error && <div className="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            required
          />
          <div className="word-count">{wordCount} words</div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <div className="radio-group">
            {["draft", "published"].map((s) => (
              <label key={s}>
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={form.status === s}
                  onChange={handleChange}
                />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "draft")}
            disabled={saving}
            className="btn"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? "Saving..." : "Save & Publish"}
          </button>
          <Link href={`/posts/${id}`} className="cancel-link">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default function EditPostPage() {
  return (
    <ProtectedRoute>
      <EditPostContent />
    </ProtectedRoute>
  );
}