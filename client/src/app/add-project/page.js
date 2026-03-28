"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

export default function AddProjects() {

  const [connectionName, setConnectionName] = useState("");
  const [ssh, setSsh] = useState("");
  const [hostName, setHostName] = useState("");
  const [ip, setIP] = useState("");
  const [type, setType] = useState("");
  const router = useRouter();

  async function createConnection(){
    const id = toast.loading("Creating Connection...");
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/connection/add-connection`,
                { connectionName, ssh, hostName, ip, type },
                { withCredentials: true }
            );
            toast.success("Connection Created successfully!");
            router.push(`/connection/${response.data._id}`);
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.response?.data ||
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
           <p className="text-lg font-semibold">Add Connection to a remote Server</p>
           <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row justify-between items-center">
                            <label htmlFor="name" className="text-sm">
                                Connection Name
                            </label>
                        </div>
                        <input
                            id="name"
                            placeholder="My Connection Name"
                            className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
                            value={connectionName}
                            onChange={(e) => setConnectionName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="ssh" className="text-sm">
                            ssh key
                        </label>
                        <textarea
                            type="textarea"
                            id="ssh"
                            placeholder="------Your SSH private key-------"
                            value={ssh}
                            onChange={(e) => setSsh(e.target.value)}
                            className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row justify-between items-center">
                            <label htmlFor="ip" className="text-sm">
                                IP Address
                            </label>
                        </div>
                        <input
                            id="ip"
                            placeholder="x.x.x.x"
                            value={ip}
                            onChange={(e) => setIP(e.target.value)}
                            className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row justify-between items-center">
                            <label htmlFor="hostName" className="text-sm">
                                Host Name
                            </label>
                        </div>
                        <input
                            id="hostName"
                            placeholder="root"
                            value={hostName}
                            onChange={(e) => setHostName(e.target.value)}
                            className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row justify-between items-center">
                            <label htmlFor="type" className="text-sm">
                                Type
                            </label>
                        </div>
                          <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
                          >
                            <option value="">-- Select type --</option>
                            <option value="Personal">Personal</option>
                            <option value="Group">Group</option>
                          </select>
                    </div>
                </div>
                <button
                    className="bg-[#E5E5E5] text-black p-2 rounded-md font-medium hover:bg-white transition-colors"
                    onClick={createConnection}
                >
                    Create Connection
                </button>
        </div>
      </div>
    </section>
  );
}
