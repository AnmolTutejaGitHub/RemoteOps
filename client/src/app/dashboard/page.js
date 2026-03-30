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
          ) : personalConnections.length === 0 ? (
            <p className="text-sm text-[#6B6B6B]">No personal connections yet.</p>
          ) : (
            <div className="flex flex-row flex-wrap gap-3">
              {personalConnections.map((personalconnection) => (
                <button
                  key={personalconnection._id}
                  onClick={() => router.push(`/connection/${personalconnection._id}`)}
                  className="w-36 h-36 flex flex-col justify-center items-center bg-[#171717] border border-[#2E2E2E] rounded-lg p-3 hover:border-white transition-colors"
                >
                  <p className="text-sm text-center font-medium">{personalconnection.name}</p>
                  <p className="text-xs text-[#6B6B6B] text-center mt-1">{personalconnection.ip}</p>
                </button>
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
          ) : groups.length == 0 ? (
            <p className="text-sm text-[#6B6B6B]">You are not part of any group.</p>
          ) : (
            <div className="flex flex-row flex-wrap gap-3">
              {groups.map((group) => (
                <button
                  key={group._id}
                  onClick={() => router.push(`/group/${group._id}`)}
                  className="w-36 h-36 flex flex-col justify-center items-center bg-[#171717] border border-[#2E2E2E] rounded-lg p-3 hover:border-white transition-colors"
                >
                  <p className="text-sm text-center font-medium">{group.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
