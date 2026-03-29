"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function GroupDetail() {
  const { groupId } = useParams();
  const router = useRouter();

  const [group, setGroup] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberEmail, setMemberEmail] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  async function fetchGroup() {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/group/${groupId}`,
      { withCredentials: true }
    );
    setGroup(response.data);
  }

  async function fetchConnections() {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/connection/group-connections/${groupId}`,
      { withCredentials: true }
    );
    setConnections(response.data);
  }

  async function fetchAll() {
    try {
      await fetchGroup();
      await fetchConnections();
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, [groupId]);

  async function handleAddMember() {
    if (!memberEmail.trim()) return;
    setAddingMember(true);
    const id = toast.loading("Adding member...");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/group/add-member`,
        { member_email: memberEmail, grp_id: groupId },
        { withCredentials: true }
      );
      toast.success("Member added!");
      setMemberEmail("");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error adding member"
      );
    } finally {
      toast.dismiss(id);
      setAddingMember(false);
    }
  }

  return (
    <section className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col gap-6 p-8">

        {loading ? (
          <div className="flex flex-col gap-2">
            <div className="h-6 w-40 rounded bg-[#2E2E2E] animate-pulse" />
            <div className="h-4 w-52 rounded bg-[#2E2E2E] animate-pulse" />
          </div>
        ) : group ? (
          <div>
            <p className="text-xl font-semibold">{group.name}</p>
            <p className="text-sm text-[#6B6B6B] mt-1">
              Admin: {group.createdBy?.email}
            </p>
          </div>
        ) : (
          <p className="text-sm text-[#6B6B6B]">Group not found.</p>
        )}

        {!loading && group?.members?.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Members</p>
            <div className="flex flex-col gap-1">
              {group.members.map((member) => (
                <p key={member._id} className="text-sm text-[#A1A1A1]">
                  {member.email}
                </p>
              ))}
            </div>
          </div>
        )}

        {!loading && group?.isAdmin && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Add Member</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="member@example.com"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                className="flex-1 bg-[#212121] border border-[#434343] rounded-md p-2 text-sm focus:border-white focus:outline-none"
              />
              <button
                onClick={handleAddMember}
                disabled={addingMember}
                className="bg-[#E5E5E5] text-black text-sm px-4 py-2 rounded-md hover:bg-white transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <p className="text-lg font-semibold">Connections</p>
          {loading ? (
            <div className="flex gap-3">
              <div className="w-36 h-36 rounded-lg bg-[#2E2E2E] animate-pulse" />
              <div className="w-36 h-36 rounded-lg bg-[#2E2E2E] animate-pulse" />
              <div className="w-36 h-36 rounded-lg bg-[#2E2E2E] animate-pulse" />
            </div>
          ) : connections.length == 0 ? (
            <p className="text-sm text-[#6B6B6B]">No connections in this group.</p>
          ) : (
            <div className="flex flex-row flex-wrap gap-3">
              {connections.map((connection) => (
                <button
                  key={connection._id}
                  onClick={() => router.push(`/connection/${connection._id}`)}
                  className="w-36 h-36 flex flex-col justify-center items-center bg-[#171717] border border-[#2E2E2E] rounded-lg p-3 hover:border-white transition-colors"
                >
                  <p className="text-sm text-center font-medium">{connection.name}</p>
                  <p className="text-xs text-[#6B6B6B] text-center mt-1">{connection.ip}</p>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
