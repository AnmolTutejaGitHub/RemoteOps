"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const router = useRouter();

  async function signup() {
    const id = toast.loading("Creating your account...");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/signup`,
        {
          email,
          password,
          confirm_password,
          name: username,
        },
        { withCredentials: true }
      );
      toast.success("Signup successful!");
      router.push("/verify");
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
    <section className="h-screen w-screen flex justify-center items-center">
      <div className="bg-[#171717] p-6 rounded-2xl border border-[#2E2E2E] flex flex-col gap-4 w-full max-w-sm">
        <div>
          <p className="text-xl font-semibold">Create an account</p>
          <p className="text-[#6B6B6B] text-sm mt-1">
            Enter your information below to create your account
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm">Username</label>
            <input
              type="text"
              id="name"
              placeholder="John Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
            />
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
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirm_password}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
            />
          </div>
        </div>
        <button
          onClick={signup}
          className="bg-[#E5E5E5] text-black p-2 rounded-md font-medium hover:bg-white transition-colors"
        >
          Create Account
        </button>
        <p className="text-sm text-center text-[#6B6B6B]">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
