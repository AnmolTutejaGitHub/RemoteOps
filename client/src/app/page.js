"use client"

import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  return (
    <section className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col justify-center items-center gap-8 flex-1">
        <p className="text-2xl border p-3 pl-4 pr-4 rounded-full">Introducting RemoteOps</p>
        <div className="flex flex-col justify-center items-center gap-8">
          <div className="flex flex-col justify-center items-center gap-3">
            <p className="text-6xl text-center">
              Control Your Servers with <br /> Confidence
            </p>
            <p className="text-gray-400 text-lg">Built for developers who want speed, control, and simplicity.</p>
          </div>

          <div className="flex gap-8 justify-center">
            <Link href="/dashboard" className="bg-white text-black p-2 pl-3 pr-3 rounded-md cursor-pointer"
            >Get Started</Link>
            <Link
              href="https://github.com/AnmolTutejaGitHub/RemoteOps"
              target="_blank"
              className="border border-[#2E2E2E] text-sm px-5 py-2.5 rounded-md hover:border-[#6B6B6B] transition-colors flex items-center gap-2"
            >
              <FaGithub size={16} />
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}