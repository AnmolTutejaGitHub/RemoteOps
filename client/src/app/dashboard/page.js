"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar/Navbar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [personalConnections, setPersonalConnections] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchUser() {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
      { withCredentials: true }
    );
    setUser(response.data);
  }

  async function fetchPersonalConnections() {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/connection/user-connections/personal`,
      { withCredentials: true }
    );
    setPersonalConnections(response.data);
  }

  async function fetchGroups() {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/group/user-groups`,
      { withCredentials: true }
    );
    console.log(response.data);
    setGroups(response.data);
  }

  async function fetchAll() {
    try {
      await fetchUser();
      await fetchPersonalConnections();
      await fetchGroups();
    } catch {
      router.push("/login");
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
              onClick={() => router.push("/add-connection")}
              className="bg-[#E5E5E5] text-black text-sm px-4 py-2 rounded-md hover:bg-white transition-colors"
            >
              Add Connection
            </button>
            <button
              onClick={() => router.push("/managegroups")}
              className="border border-[#2E2E2E] text-sm px-4 py-2 rounded-md hover:border-white transition-colors"
            >
              Manage Groups
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-lg font-semibold">Personal Connections</p>
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
              </div>

              {personalConnections.map((connection) => (
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
                </div>
              ))}

            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-lg font-semibold">Groups</p>
          {loading ? (
            <div className="flex gap-3">
              <div className="w-36 h-36 rounded-lg bg-[#2E2E2E] animate-pulse" />
              <div className="w-36 h-36 rounded-lg bg-[#2E2E2E] animate-pulse" />
            </div>
          ) : (
            <div className="border border-[#2E2E2E] rounded-xl text-sm">
              <div className="flex bg-[#121212] text-[#6B6B6B] uppercase border-b border-[#2E2E2E]">
                <div className="flex-1 px-4 py-3">Group Name</div>
                <div className="w-100 px-4 py-3">Admin Email</div>
                <div className="w-100 px-4 py-3">Created At</div>
              </div>

              {groups.map((group) => (
                <div
                  key={group._id}
                  className="flex border-b border-[#1E1E1E] bg-[#171717] hover:bg-[#121212] text-sm"
                >
                  <div
                    className="flex-1 px-4 py-3 truncate"
                    title={group.name}
                  >
                    <span onClick={() => router.push(`/group/${group._id}`)} className="text-blue-400 cursor-pointer">{group.name}</span>
                  </div>

                  <div
                    className="w-100 px-4 py-3 text-[#E5E5E5] truncate"
                    title={group.createdBy?.email}
                  >
                    {group.createdBy?.email}
                  </div>

                  <div className="w-100 px-4 py-3 text-[#9CA3AF] truncate">
                    {group.createdAt}
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

      </div>
    </section>
  );
}
