"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  async function fetchUser() {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
        { withCredentials: true }
      );
      setUser(res.data);
    } catch {
      router.push("/login");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <section className="h-screen w-screen flex flex-col">
      <Navbar />

      <div className="flex flex-col gap-8 p-8">
        <div className="flex flex-row justify-between items-center">
          {user ? (
            <div>
              <p className="text-xl font-semibold">{user.username}</p>
              <p className="text-[#6B6B6B] text-sm">{user.email}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="h-5 w-32 rounded bg-[#2E2E2E] animate-pulse" />
              <div className="h-4 w-48 rounded bg-[#2E2E2E] animate-pulse" />
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/add-project")}
              className="bg-[#E5E5E5] text-black text-sm px-4 py-2 rounded-md hover:bg-white transition-colors"
            >
              Manage Projects
            </button>
            <button
              onClick={() => router.push("/managegroups")}
              className="border border-[#2E2E2E] text-sm px-4 py-2 rounded-md hover:border-white transition-colors"
            >
              Manage Groups
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-lg font-semibold">Projects</p>
        </div>


      </div>
    </section>
  );
}
