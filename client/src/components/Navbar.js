"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";

export default function Navbar() {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
      const token = Cookies.get("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/verifytokenAndGetUserDetails`,
          { token }
        );
        setUsername(res.data.username);
      } catch {
        Cookies.remove("token");
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    fetchUser();
  }, []);

  function handleLogout() {
    Cookies.remove("token");
    setUsername(null);
  }

  return (
    <nav className="flex flex-row justify-between items-center p-4">
      <div className="flex flex-row gap-6 items-center">
        <Link href="/" className="font-semibold">
          RemoteOps
        </Link>
        <Link href="/" className="text-[#6B6B6B] hover:text-white text-sm transition-colors">
          Get Started
        </Link>
        <Link href="/#features" className="text-[#6B6B6B] hover:text-white text-sm transition-colors">
          Features
        </Link>
      </div>
      <div className="flex flex-row gap-2 items-center">
        {loading ? (
          <div className="flex gap-2 items-center">
            <div className="h-8 w-20 rounded-md bg-[#2E2E2E] animate-pulse" />
            <div className="h-8 w-16 rounded-md bg-[#2E2E2E] animate-pulse" />
          </div>
        ) : username ? (
          <>
            <span className="text-sm text-[#E5E5E5]">{username}</span>
            <button
              onClick={handleLogout}
              className="bg-[#212121] text-white border border-[#434343] text-sm p-2 px-3 rounded-md hover:border-white transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex flex-row gap-2">
            <Link href="/login">
              <button className="bg-[#E5E5E5] text-black text-sm p-2 px-3 rounded-md hover:bg-white transition-colors">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="border border-white text-sm p-2 px-3 rounded-md hover:bg-white hover:text-black transition-colors">
                Signup
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
