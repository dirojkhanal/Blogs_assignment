"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";

export default function SinglePost() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);

        //FIX HERE
        setPost(res.data?.data?.post);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${id}`);
      router.push("/posts");
    } catch (err) {
      console.error(err);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{post.title}</h1>

      <p className="mt-2 text-gray-600">
        Status: {post.status}
      </p>

      <p className="mt-4">{post.content}</p>

      <button
        onClick={handleDelete}
        className="mt-4 bg-red-500 text-white px-4 py-2"
      >
        Delete
      </button>
    </div>
  );
}