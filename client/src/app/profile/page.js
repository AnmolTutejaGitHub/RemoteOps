"use client";

import Navbar from "@/components/Navbar/Navbar";
import Profile from "@/components/Profile/Profile";

export default function ProfilePage() {
  return (
    <section className="h-screen w-screen flex flex-col overflow-auto">
      <Navbar />
      <div className="flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[#E5E5E5]">Profile</h1>
            <p className="text-[#6B6B6B] text-sm mt-1">
              Manage your account information
            </p>
          </div>
          <Profile />
        </div>
      </div>
    </section>
  );
}
