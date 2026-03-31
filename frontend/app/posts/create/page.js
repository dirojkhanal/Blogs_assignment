"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function CreatePost() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    content: "",
    status: "published",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/posts", form);

      // ✅ correct access
      const createdPost = res.data?.data?.post;

      console.log("Created:", createdPost);

      router.push("/posts");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Post</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <textarea
          name="content"
          placeholder="Content"
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <select
          name="status"
          onChange={handleChange}
          className="w-full border p-2"
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}