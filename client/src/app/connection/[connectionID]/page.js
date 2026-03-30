"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import toast from "react-hot-toast";

export default function Connection() {
  const { connectionID } = useParams();
  const router = useRouter();
  const [metrics, setMetrics] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchMetrics() {
    setFetching(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/connection/metric/${connectionID}`,
        { withCredentials: true }
      );
      setMetrics(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch metrics");
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
  }, [connectionID]);

  async function handleDelete() {
    setDeleting(true);
    const id = toast.loading("Deleting connection...");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/connection/${connectionID}`,
        { withCredentials: true }
      );
      toast.success("Connection deleted!");
      router.back();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete connection");
    } finally {
      toast.dismiss(id);
      setDeleting(false);
    }
  }

  function formatTime(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleTimeString();
  }

  return (
    <section className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col gap-6 p-8">

        <div className="flex flex-row justify-between items-center">
          <div>
            <p className="text-xl font-semibold">Connection Metrics</p>
            <p className="text-sm text-[#6B6B6B] mt-1">Live CPU and RAM stats fetched directly from the remote server.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/connection/terminal/${connectionID}`)}
              className="bg-[#E5E5E5] text-black text-sm px-4 py-2 rounded-md hover:bg-white transition-colors"
            >
              Emulate Terminal
            </button>
            <button
              onClick={fetchMetrics}
              disabled={fetching}
              className="flex items-center gap-2 border border-[#2E2E2E] text-sm px-4 py-2 rounded-md hover:border-white transition-colors disabled:opacity-40"
            >
              {fetching ? <><Loader2 size={14} className="animate-spin" /> Refreshing...</> : "Refresh"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 border border-[#2E2E2E] text-sm px-4 py-2 rounded-md hover:border-red-500 hover:text-red-400 transition-colors disabled:opacity-40"
            >
              {deleting ? <><Loader2 size={14} className="animate-spin" /> Deleting...</> : "Delete"}
            </button>
          </div>
        </div>

        {fetching && !metrics ? (
          <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
            <Loader2 size={14} className="animate-spin" />
            Fetching data...
          </div>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : metrics ? (
          <div className="flex gap-4">

            <div className="flex flex-col gap-1 bg-[#171717] border border-[#2E2E2E] rounded-lg p-5 w-52">
              <p className="text-xs text-[#6B6B6B] uppercase tracking-wide">CPU Usage</p>
              <p className={`text-3xl font-semibold ${fetching ? "opacity-40" : ""} transition-opacity`}>
                {metrics.cpu?.usagePercent != null ? `${metrics.cpu.usagePercent}%` : "—"}
              </p>
              <p className="text-xs text-[#6B6B6B] mt-1">
                Updated: {formatTime(metrics.cpu?.lastUpdated)}
              </p>
            </div>

            <div className="flex flex-col gap-1 bg-[#171717] border border-[#2E2E2E] rounded-lg p-5 w-52">
              <p className="text-xs text-[#6B6B6B] uppercase tracking-wide">RAM Usage</p>
              <p className={`text-3xl font-semibold ${fetching ? "opacity-40" : ""} transition-opacity`}>
                {metrics.ram?.used != null ? `${metrics.ram.used} MB` : "—"}
              </p>
              {metrics.ram?.total != null && (
                <p className="text-xs text-[#6B6B6B]">of {metrics.ram.total} MB</p>
              )}
              <p className="text-xs text-[#6B6B6B] mt-1">
                Updated: {formatTime(metrics.ram?.lastUpdated)}
              </p>
            </div>

          </div>
        ) : null}

      </div>
    </section>
  );
}