"use client";
 
import { useSession } from "next-auth/react";
import Link from "next/link";
 
export default function HomePage() {
  const { data: session } = useSession();
 
  return (
    <>
      <div className="home-hero">
        <h1>BlogSphere</h1>
        <p>
          A simple blog platform with authentication and role-based access control.
          Users can create and manage their own posts. Admins can moderate everything.
        </p>
        <div className="home-btns">
          {session ? (
            <>
              <Link href="/dashboard" className="btn btn-primary">Dashboard</Link>
              {session.user?.role === "admin" && (
                <Link href="/admin" className="btn">Admin Panel</Link>
              )}
            </>
          ) : (
            <>
              <Link href="/register" className="btn btn-primary">Get Started</Link>
              <Link href="/posts" className="btn">Browse Posts</Link>
            </>
          )}
        </div>
      </div>
 
      <div className="home-stats">
        <div>
          <div className="home-stat-val">2</div>
          <div className="home-stat-lbl">Roles (User & Admin)</div>
        </div>
        <div>
          <div className="home-stat-val">JWT</div>
          <div className="home-stat-lbl">Auth Strategy</div>
        </div>
        <div>
          <div className="home-stat-val">CRUD</div>
          <div className="home-stat-lbl">Post Operations</div>
        </div>
      </div>
    </>
  );
}