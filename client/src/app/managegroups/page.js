"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";

export default function ManageGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchAdminGroups() {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/group/user-admin-groups`,
      { withCredentials: true }
    );
    setGroups(response.data);
  }

  async function fetchAll() {
    try {
      await fetchAdminGroups();
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <section className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col gap-6 p-8">

        <div className="flex flex-row justify-between items-center">
          <p className="text-xl font-semibold">Your Groups</p>
          <button
            onClick={() => router.push("/create-group")}
            className="bg-[#E5E5E5] text-black text-sm px-4 py-2 rounded-md hover:bg-white transition-colors"
          >
            Create New Group
          </button>
        </div>

        <p className="text-sm text-[#6B6B6B] -mt-3">
          Groups you are the admin of. Click to manage members and connections.
        </p>

        {loading ? (
          <p className="text-sm text-[#6B6B6B]">Loading...</p>
        ) : groups.length === 0 ? (
          <p className="text-sm text-[#6B6B6B]">
            You don't admin any groups.{" "}
            <button
              onClick={() => router.push("/create-group")}
              className="text-white hover:underline"
            >
              Create one
            </button>
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {groups.map((group) => (
              <button
                key={group._id}
                onClick={() => router.push(`/group/${group._id}`)}
                className="flex flex-row justify-between items-center bg-[#171717] border border-[#2E2E2E] rounded-lg px-4 py-3 hover:border-white transition-colors"
              >
                <p className="text-sm font-medium">{group.name}</p>
                <p className="text-xs text-[#6B6B6B]">
                  {new Date(group.createdAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
