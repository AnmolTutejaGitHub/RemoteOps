"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar/Navbar";

export default function EditConnection() {
  const { connectionId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [hostName, setHostName] = useState("");
  const [ip, setIp] = useState("");

  useEffect(() => {
    async function fetchConnection() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/connection/${connectionId}`,
          { withCredentials: true }
        );

        setName(res.data.name || "");
        setHostName(res.data.hostName || "");
        setIp(res.data.ip || "");
      } catch {
        toast.error("Failed to load connection");
      } finally {
        setLoading(false);
      }
    }

    fetchConnection();
  }, [connectionId]);

  async function updateConnection() {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/connection/${connectionId}`,
        { name, hostName, ip },
        { withCredentials: true }
      );

      toast.success("Connection updated");
      router.back();
    } catch {
      toast.error("Update failed");
    }
  }

  return (
    <section className="h-screen w-screen flex flex-col">
      <Navbar />

      <div className="flex items-center justify-center justify-center items-center flex-1">

        <div className="bg-[#171717] border border-[#2E2E2E] rounded-xl p-8 w-full max-w-md flex flex-col gap-4">

          <p className="text-xl font-semibold">Edit Connection</p>

          {loading ? (
            <>
              <div className="h-10 bg-[#2E2E2E] rounded-md animate-pulse"></div>
              <div className="h-10 bg-[#2E2E2E] rounded-md animate-pulse"></div>
              <div className="h-10 bg-[#2E2E2E] rounded-md animate-pulse"></div>
              <div className="h-10 w-24 bg-[#2E2E2E] rounded-md animate-pulse"></div>
            </>
          ) : (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="bg-[#212121] border border-[#434343] rounded-md p-2.5 text-sm"
              />

              <input
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Hostname"
                className="bg-[#212121] border border-[#434343] rounded-md p-2.5 text-sm"
              />

              <input
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="IP Address"
                className="bg-[#212121] border border-[#434343] rounded-md p-2.5 text-sm"
              />

              <button
                onClick={updateConnection}
                className="bg-white text-black text-sm px-5 py-2 rounded-md cursor-pointer w-24"
              >
                Submit
              </button>
            </>
          )}

        </div>

      </div>
    </section>
  );
}