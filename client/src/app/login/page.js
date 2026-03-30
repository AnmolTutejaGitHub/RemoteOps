"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function login() {
    const id = toast.loading("Trying to login...");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err) {
      if (err.response?.status === 401 && err.response?.data?.redirect) {
        toast.error("Please verify your email first.");
        router.push("/verify");
        return;
      }
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
          <p className="text-xl font-semibold">Login to your account</p>
          <p className="text-[#6B6B6B] text-sm mt-1">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm">Email</label>
            <input
              type="email"
              id="email"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
              <label htmlFor="password" className="text-sm">Password</label>
              <Link href="/forgot-password" className="text-xs text-[#6B6B6B] hover:text-white transition-colors">
                Forgot your password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#212121] p-2 rounded-sm border border-[#434343] focus:border-white focus:outline-none text-sm"
            />
          </div>
        </div>
        <button
          onClick={login}
          className="bg-[#E5E5E5] text-black p-2 rounded-md font-medium hover:bg-white transition-colors"
        >
          Login
        </button>
        <p className="text-sm text-center text-[#6B6B6B]">
          Don't have an account?{" "}
          <Link href="/signup" className="text-white hover:underline">Sign up</Link>
        </p>
      </div>
    </section>
  );
}
