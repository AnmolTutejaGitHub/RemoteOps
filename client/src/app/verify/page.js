"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

export default function Verify() {
  const [email, setEmail] = useState("");

  async function sendVerificationEmail() {
    const id = toast.loading("Sending verification mail...");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/generate-Verification-Token`,
        { email }
      );
      toast.success("Check your inbox!");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Error sending mail"
      );
    } finally {
      toast.dismiss(id);
    }
  }

  return (
    <section className="h-screen w-screen flex justify-center items-center">
      <div className="bg-[#171717] p-6 rounded-2xl border border-[#2E2E2E] flex flex-col gap-4 w-full max-w-sm">
        <div>
          <p className="text-xl font-semibold">Get Verified</p>
          <p className="text-[#6B6B6B] text-sm mt-1">
            Enter your email to receive a verification link.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm">Email</label>
          <input
            type="email"
            id="email"
            placeholder="me@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
          />
        </div>
        <button
          onClick={sendVerificationEmail}
          className="bg-[#E5E5E5] text-black p-2 rounded-md font-medium hover:bg-white transition-colors"
        >
          Send Verification Email
        </button>
        <p className="text-sm text-center text-[#6B6B6B]">
          Already verified?{" "}
          <Link href="/login" className="text-white hover:underline">Login</Link>
        </p>
      </div>
    </section>
  );
}
