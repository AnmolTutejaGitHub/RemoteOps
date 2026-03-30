"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function sendResetLink() {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    const id = toast.loading("Sending reset link...");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/resetPasswordToken`,
        { email }
      );
      toast.success(res.data?.message || "Reset link sent!");
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to send reset link"
      );
    } finally {
      toast.dismiss(id);
    }
  }

  return (
    <section className="h-screen w-screen flex justify-center items-center">
      <div className="bg-[#171717] p-6 rounded-2xl border border-[#2E2E2E] flex flex-col gap-4 w-full max-w-sm">

        <div>
          <p className="text-xl font-semibold">Forgot your password?</p>
          <p className="text-[#6B6B6B] text-sm mt-1">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm">Email</label>
          <input
            id="email"
            type="email"
            placeholder="johndoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
          />
        </div>

        <button
          onClick={sendResetLink}
          className="bg-[#E5E5E5] text-black p-2 rounded-md font-medium hover:bg-white transition-colors"
        >
          Send Reset Link
        </button>

        <p className="text-sm text-center text-[#6B6B6B]">
          Remember your password?{" "}
          <Link href="/login" className="text-white hover:underline">Login</Link>
        </p>

      </div>
    </section>
  );
}
