"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user.role !== "admin") {
      router.push("/dashboard"); // redirect normal user
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-600">
        Admin Dashboard
      </h1>

      <p className="mt-2">
        Welcome Admin: {session?.user?.name}
      </p>
    </div>
  );
}