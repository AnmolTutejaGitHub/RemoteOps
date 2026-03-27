"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleVerify() {
    setLoading(true);
    const toastId = toast.loading("Verifying your account...");
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/verify/${token}`
      );
      toast.success(response?.data?.message || "Account verified!");
      router.push("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Verification failed"
      );
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  }

  return (
    <section className="h-screen w-screen flex justify-center items-center">
      <div className="bg-[#171717] p-6 rounded-2xl border border-[#2E2E2E] flex flex-col gap-4 w-full max-w-sm">
        <div>
          <p className="text-xl font-semibold">Verify Your Account</p>
          <p className="text-[#6B6B6B] text-sm mt-1">
            Click the button below to verify your account.
          </p>
        </div>
        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-[#E5E5E5] text-black p-2 rounded-md font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify Account"}
        </button>
      </div>
    </section>
  );
}
