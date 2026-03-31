"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { 
  PenTool, 
  LayoutDashboard, 
  ShieldCheck, 
  LogOut, 
  User 
} from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Simple Navbar */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2 rounded-lg">
              <PenTool className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">BlogSphere</h1>
          </div>

          {session && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">{session.user.name}</p>
                  <p className="text-xs text-gray-500">{session.user.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Share your stories<br />with the world
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto">
          A clean and simple platform to write, publish, and grow your blog.
        </p>

        {!session ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <button className="bg-black text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition">
                Login
              </button>
            </Link>

            <Link href="/register">
              <button className="border border-gray-300 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transition">
                Create Account
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <button className="bg-black text-white px-8 py-4 rounded-xl text-lg font-medium flex items-center gap-2 hover:bg-gray-800 transition">
                <LayoutDashboard className="w-5 h-5" />
                Go to Dashboard
              </button>
            </Link>

            {session.user.role === "admin" && (
              <Link href="/admin">
                <button className="border border-gray-300 px-8 py-4 rounded-xl text-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition">
                  <ShieldCheck className="w-5 h-5" />
                  Admin Panel
                </button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Simple Features */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 p-8 rounded-2xl text-center">
              <div className="text-4xl mb-4">✍️</div>
              <h3 className="text-2xl font-semibold mb-3">Easy Writing</h3>
              <p className="text-gray-600">
                Clean editor with Markdown support. Just start writing.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-8 rounded-2xl text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-2xl font-semibold mb-3">Reach Readers</h3>
              <p className="text-gray-600">
                Publish your posts and share them easily with your audience.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-8 rounded-2xl text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-2xl font-semibold mb-3">Secure</h3>
              <p className="text-gray-600">
                Your content is safe. Full control over your blog.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          © 2026 BlogSphere • Simple Blogging Platform
        </div>
      </footer>

      {/* Logout Button - only when logged in */}
      {session && (
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="fixed bottom-6 right-6 bg-red-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg hover:bg-red-700 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      )}
    </div>
  );
}