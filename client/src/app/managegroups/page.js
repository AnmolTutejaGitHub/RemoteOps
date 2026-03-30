"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar/Navbar";

export default function ManageGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingGroupId, setDeletingGroupId] = useState(null);
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

  async function handleDeleteGroup(groupId) {
    setDeletingGroupId(groupId);
    const id = toast.loading("Deleting group...");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/group/delete/${groupId}`,
        { withCredentials: true }
      );
      toast.success("Group deleted!");
      await fetchAll();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error deleting group"
      );
    } finally {
      toast.dismiss(id);
      setDeletingGroupId(null);
    }
  }

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
          <div className="flex flex-col gap-2">
            <div className="h-12 rounded-lg bg-[#2E2E2E] animate-pulse" />
            <div className="h-12 rounded-lg bg-[#2E2E2E] animate-pulse" />
            <div className="h-12 rounded-lg bg-[#2E2E2E] animate-pulse" />
          </div>
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
          <div className="border border-[#2E2E2E] rounded-xl text-sm">

            <div className="flex bg-[#121212] text-xs text-[#6B6B6B] uppercase border-b border-[#2E2E2E]">
              <div className="flex-1 px-4 py-3">Group Name</div>
              <div className="w-100 px-4 py-3">Created</div>
              <div className="w-28 px-4 py-3 text-right">Action</div>
            </div>

            {groups.map((group) => (
              <div
                key={group._id}
                className="flex cursor-pointer border-b border-[#1E1E1E] bg-[#171717] hover:bg-[#121212] items-center"
              >

                <div
                  className="flex-1 px-4 py-3 text-[#E5E5E5] truncate"
                  title={group.name}
                >
                  <span onClick={() => router.push(`/group/${group._id}`)} className="text-blue-400">{group.name}</span>
                </div>

                <div className="w-100 px-4 py-3 text-[#9CA3AF]">
                  {group.createdAt}
                </div>

                <div
                  className="w-28 px-4 py-3 flex justify-end"
                >
                  <button
                    onClick={() => handleDeleteGroup(group._id)}
                    disabled={deletingGroupId === group._id}
                    className="bg-[#212121] text-white border border-[#434343] text-xs cursor-pointer p-2 px-3 rounded-md hover:border-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    {deletingGroupId === group._id ? "Deleting..." : "Delete"}
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}
