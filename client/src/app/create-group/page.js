"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const router = useRouter();

  async function createGroup() {
    if (!groupName.trim()) return;
    const id = toast.loading("Creating group...");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/group/create-group`,
        { groupName },
        { withCredentials: true }
      );
      toast.success("Group created!");
      router.push("/managegroups");
    } catch (err) {
        toast.error(
            err.response?.data?.errorResponse?.errmsg ||
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Error creating group"
      );
    } finally {
      toast.dismiss(id);
    }
  }

  return (
    <section className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex justify-center items-center flex-1">
        <div className="bg-[#171717] border border-[#2E2E2E] rounded-2xl p-6 flex flex-col gap-4 w-full max-w-sm">
          <div>
            <p className="text-xl font-semibold">Create Group</p>
            <p className="text-[#6B6B6B] text-sm mt-1">
              You will be the admin of this group.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm">Group Name</label>
            <input
              type="text"
              placeholder="e.g. DevOps Team"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="bg-[#212121] border border-[#434343] rounded-md p-2 text-sm focus:border-white focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={createGroup}
              className="flex-1 bg-[#E5E5E5] text-black text-sm py-2 rounded-md hover:bg-white transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}