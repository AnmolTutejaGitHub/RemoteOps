"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar/Navbar";
import { IoIosAdd } from "react-icons/io";

export default function GroupDetail() {
  const { groupId } = useParams();
  const router = useRouter();

  const [group, setGroup] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberEmail, setMemberEmail] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState(null);

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
      await fetchGroup();
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

  async function handleRemoveMember(memberId) {
    setRemovingMemberId(memberId);
    const id = toast.loading("Removing member...");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/group/remove-member/${groupId}`,
        { member_id: memberId },
        { withCredentials: true }
      );
      toast.success("Member removed!");
      await fetchGroup();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error removing member"
      );
    } finally {
      toast.dismiss(id);
      setRemovingMemberId(null);
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
          <div className="border border-[#2E2E2E] rounded-xl text-sm">
            <div className="flex bg-[#121212] text-xs text-[#6B6B6B] uppercase border-b border-[#2E2E2E]">
              <div className="flex-1 px-4 py-3">Members</div>
              {group?.isAdmin && (
                <div className="w-28 px-4 py-3 text-right">Action</div>
              )}
            </div>

            {group.members.map((member) => (
              <div
                key={member._id}
                className="flex items-center border-b border-[#1E1E1E] bg-[#171717] hover:bg-[#121212] last:border-none"
              >
                <div
                  className="flex-1 px-4 py-3 text-[#E5E5E5] truncate"
                  title={member.email}
                >
                  {member.email}
                </div>

                {group?.isAdmin && (
                  <div className="w-28 px-4 py-3 flex justify-end">
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      disabled={removingMemberId == member._id}
                      className="bg-[#212121] text-white border border-[#434343] text-xs cursor-pointer p-2 px-3 rounded-md hover:border-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      {removingMemberId == member._id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                )}
              </div>
            ))}

          </div>
        )}

        {!loading && group?.isAdmin && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Add Member</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="member@gmail.com"
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
          <div className="flex flex-row gap-6">
            <p className="text-lg font-semibold">Connections</p>
            {group?.isAdmin && (
              <div className="flex items-center gap-1 text-xs text-blue-400 cursor-pointer"
                onClick={() => router.push(`/add-connection`)}
              >
                <IoIosAdd />
                <p>Add Connection</p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex gap-3">
              <div className="w-36 h-36 rounded-lg bg-[#2E2E2E] animate-pulse" />
              <div className="w-36 h-36 rounded-lg bg-[#2E2E2E] animate-pulse" />
              <div className="w-36 h-36 rounded-lg bg-[#2E2E2E] animate-pulse" />
            </div>
          ) : (
            <div className="border border-[#2E2E2E] rounded-xl">

              <div className="flex bg-[#121212] text-[#6B6B6B] uppercase border-b border-[#2E2E2E] text-sm">
                <div className="flex-1 px-4 py-3">Connection ID</div>
                <div className="w-60 px-4 py-3">Name</div>
                <div className="w-50 px-4 py-3">IP Address</div>
                <div className="w-80 px-4 py-3">Created At</div>
                {group?.isAdmin && (
                  <div className="w-28 px-4 py-3 text-right">Action</div>
                )}
              </div>

              {connections.map((connection) => (
                <div
                  key={connection._id}
                  className="flex border-b border-[#1E1E1E] bg-[#171717] hover:bg-[#121212] text-sm"
                >
                  <div className="flex-1 px-4 py-3">
                    <span className="text-blue-400 cursor-pointer" onClick={() => router.push(`/connection/${connection._id}`)}
                      title={connection._id}>
                      {connection._id}
                    </span>
                  </div>

                  <div className="w-60 px-4 py-3 text-[#E5E5E5] truncate" title={connection.name}>
                    {connection.name}
                  </div>

                  <div className="w-50 px-4 py-3 text-[#9CA3AF] truncate" title={connection.ip}>
                    {connection.ip}
                  </div>

                  <div className="w-80 px-4 py-3 text-[#9CA3AF] truncate" title={connection.createdAt}>
                    {connection?.createdAt}
                  </div>

                  {group?.isAdmin && (
                    <div className="w-28 px-4 py-3 flex justify-end items-center">
                      <button
                        onClick={() => router.push(`/connection/edit/${connection._id}`)}
                        className="bg-[#212121] text-white border border-[#434343] text-xs cursor-pointer p-2 px-3 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}

            </div>
          )}
        </div>

      </div>
    </section>
  );
}
