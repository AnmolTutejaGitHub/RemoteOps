"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

export default function UpdatePassword() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleResetPassword() {
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    const id = toast.loading("Updating your password...");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/resetPassword/${token}`,
        { password, confirm_password: confirmPassword }
      );
      toast.success("Password updated successfully!");
      router.push("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to update password"
      );
    } finally {
      toast.dismiss(id);
    }
  }

  return (
    <section className="h-screen w-screen flex justify-center items-center">
      <div className="bg-[#171717] p-6 rounded-2xl border border-[#2E2E2E] flex flex-col gap-4 w-full max-w-sm">

        <div>
          <p className="text-xl font-semibold">Reset your password</p>
          <p className="text-[#6B6B6B] text-sm mt-1">
            Enter a new password for your account.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm">New Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleResetPassword}
          className="bg-[#E5E5E5] text-black p-2 rounded-md font-medium hover:bg-white transition-colors"
        >
          Update Password
        </button>

        <p className="text-sm text-center text-[#6B6B6B]">
          Remember your password?{" "}
          <Link href="/login" className="text-white hover:underline">Login</Link>
        </p>

      </div>
    </section>
  );
}
