"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/", // ✅ FIX HERE
    });
  };

  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <Link href="/">
        <h1 className="font-bold text-lg">Blog App</h1>
      </Link>

      <div className="space-x-3">
        <Link href="/posts">Posts</Link>

        {session && (
          <>
            <Link href="/dashboard">Dashboard</Link>

            {session.user.role === "admin" && (
              <Link href="/admin">Admin</Link>
            )}

            {/* ✅ FIXED LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="text-red-500"
            >
              Logout
            </button>
          </>
        )}

        {!session && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}