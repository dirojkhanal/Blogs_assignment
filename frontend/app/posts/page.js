"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import PostCard from "@/components/ui/PostCard";
import Link from "next/link";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await api.get("/posts");
      setPosts(res.data?.data?.posts || []);
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-6">
      <Link href="/posts/create">
        <button className="mb-4 bg-black text-white px-4 py-2">
          Create Post
        </button>
      </Link>

      <div className="grid gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}