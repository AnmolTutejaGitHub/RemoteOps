"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function AddConnection() {
  const router = useRouter();

  const [connectionName, setConnectionName] = useState("");
  const [ssh, setSsh] = useState("");
  const [hostName, setHostName] = useState("");
  const [ip, setIP] = useState("");
  const [type, setType] = useState("personal");
  const [groupId, setGroupId] = useState("");
  const [adminGroups, setAdminGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchAdminGroups() {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/group/user-admin-groups`,
        { withCredentials: true }
      );
      setAdminGroups(response.data);
    } catch {
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (type !== "group") return;
    fetchAdminGroups();
  }, [type]);

  async function createConnection() {
    if (!connectionName || !ssh || !hostName || !ip || !type) {
      toast.error("All fields are required");
      return;
    }
    if (type == "group" && !groupId) {
      toast.error("Please select a group");
      return;
    }

    const id = toast.loading("Creating connection...");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/connection/add-connection`,
        { connectionName, ssh, hostName, ip, type, groupId: type == "group" ? groupId : undefined },
        { withCredentials: true }
      );
      toast.success("Connection created!");
      router.push(`/connection/${response.data._id}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Some error occurred"
      );
    } finally {
      toast.dismiss(id);
    }
  }

  return (
    <section className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center">
        <div className="bg-[#171717] p-6 rounded-2xl border border-[#2E2E2E] flex flex-col gap-4 w-full max-w-sm">
          <p className="text-lg font-semibold">Add Connection</p>

          <div className="flex flex-col gap-2">
            <label className="text-sm">Connection Name</label>
            <input
              placeholder="My Server"
              value={connectionName}
              onChange={(e) => setConnectionName(e.target.value)}
              className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm">SSH Private Key</label>
            <textarea
              rows={4}
              placeholder="-----BEGIN RSA PRIVATE KEY-----"
              value={ssh}
              onChange={(e) => setSsh(e.target.value)}
              className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm resize-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm">IP Address</label>
            <input
              placeholder="x.x.x.x"
              value={ip}
              onChange={(e) => setIP(e.target.value)}
              className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm">Host Name</label>
            <input
              placeholder="root"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm">Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setType("personal");
                  setGroupId("");
                }}
                className={`flex-1 py-2 rounded-md text-sm border transition-colors ${type == "personal"
                  ? "bg-[#E5E5E5] text-black border-transparent"
                  : "border-[#434343] text-[#A1A1A1] hover:border-white"
                  }`}
              >
                Personal
              </button>

              <button
                type="button"
                onClick={() => {
                  setType("group");
                  setGroupId("");
                }}
                className={`flex-1 py-2 rounded-md text-sm border transition-colors ${type == "group"
                  ? "bg-[#E5E5E5] text-black border-transparent"
                  : "border-[#434343] text-[#A1A1A1] hover:border-white"
                  }`}
              >
                Group
              </button>
            </div>
          </div>

          {type == "group" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm">Select Group</label>
              {loading ? (
                <p className="text-sm text-[#6B6B6B]">Loading...</p>
              ) : adminGroups.length == 0 ? (
                <p className="text-xs text-[#6B6B6B]">
                  You don't admin any groups.{" "}
                  <button
                    onClick={() => router.push("/create-group")}
                    className="text-white hover:underline"
                  >
                    Create one
                  </button>
                </p>
              ) : (
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
                >
                  <option value="">-- select a group --</option>
                  {adminGroups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <button
            onClick={createConnection}
            className="bg-[#E5E5E5] text-black p-2 rounded-md font-medium hover:bg-white transition-colors"
          >
            Create Connection
          </button>
        </div>
      </div>
    </section>
  );
}
