"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { HiOutlineIdentification, HiOutlineUser, HiOutlineMail, HiOutlineCalendar } from "react-icons/hi";


export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`,
        { withCredentials: true }
      );
      setUser(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <section>
      {loading ? (
        <div className="flex flex-col gap-6 animate-pulse">
          <div className="bg-[#171717] border border-[#2E2E2E] rounded-2xl p-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-[#2E2E2E]" />
              <div className="flex flex-col gap-3">
                <div className="h-5 w-40 rounded-md bg-[#2E2E2E]" />
                <div className="h-4 w-56 rounded-md bg-[#2E2E2E]" />
                <div className="h-4 w-24 rounded-md bg-[#2E2E2E]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 rounded-xl bg-[#171717] border border-[#2E2E2E]" />
            <div className="h-20 rounded-xl bg-[#171717] border border-[#2E2E2E]" />
          </div>

        </div>) : (
        <div className="">
          <div className="bg-[#171717] border border-[#2E2E2E] rounded-2xl p-6">
            <div className="flex flex-row gap-6">
              <div>
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.username}&background=262626&color=ffffff&size=128&bold=true`}
                  className="w-16 h-16 rounded-full"
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-[#E5E5E5]">
                  {user?.username}
                </p>
                <p className="text-sm text-[#6B6B6B]">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#171717] border border-[#2E2E2E] rounded-2xl p-6 mt-6">
            <div>
              <p className="text-xs text-[#6B6B6B] uppercase mb-1">
                Account Details
              </p>

              <div className="flex items-center gap-4 py-3.5 border-b border-[#1e1e1e] last:border-b-0">
                <div className="w-8 h-8 rounded-lg bg-[#1e1e1e] border border-[#2E2E2E] flex items-center justify-center text-[#6B6B6B]">
                  <HiOutlineIdentification size={18} />
                </div>
                <div className="flex flex-col gap-0.5 flex-1">
                  <p className="text-xs text-[#6B6B6B]">User ID</p>
                  <p className="text-sm text-[#E5E5E5]">{user?.userid}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-3.5 border-b border-[#1e1e1e] last:border-b-0">
                <div className="w-8 h-8 rounded-lg bg-[#1e1e1e] border border-[#2E2E2E] flex items-center justify-center text-[#6B6B6B]">
                  <HiOutlineUser size={18} />
                </div>
                <div className="flex flex-col gap-0.5 flex-1">
                  <p className="text-xs text-[#6B6B6B]">Display Name</p>
                  <p className="text-sm text-[#E5E5E5]">{user?.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-3.5 border-b border-[#1e1e1e] last:border-b-0">
                <div className="w-8 h-8 rounded-lg bg-[#1e1e1e] border border-[#2E2E2E] flex items-center justify-center text-[#6B6B6B]">
                  <HiOutlineMail size={18} />
                </div>
                <div className="flex flex-col gap-0.5 flex-1">
                  <p className="text-xs text-[#6B6B6B]">Email</p>
                  <p className="text-sm text-[#E5E5E5]">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-3.5 border-b border-[#1e1e1e] last:border-b-0">
                <div className="w-8 h-8 rounded-lg bg-[#1e1e1e] border border-[#2E2E2E] flex items-center justify-center text-[#6B6B6B]">
                  <HiOutlineCalendar size={18} />
                </div>
                <div className="flex flex-col gap-0.5 flex-1">
                  <p className="text-xs text-[#6B6B6B]">Member Since</p>
                  <p className="text-sm text-[#E5E5E5]">{user?.createdAt}</p>
                </div>
              </div>

            </div>
          </div>
        </div>


      )
      }
    </section>
  )
}