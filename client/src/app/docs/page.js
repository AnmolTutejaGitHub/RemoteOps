"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { BsTerminal, BsFileText, BsPeopleFill, BsCode } from "react-icons/bs";
import { MdLockOutline } from "react-icons/md";
import docs from "./docs.json";

const icons = {
  BsFileText,
  BsTerminal,
  BsPeopleFill,
  MdLockOutline,
  BsCode,
};

export default function DocsPage() {
  const [current,setCurrent] = useState(docs[0]);

  return (
    <section className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">

        <div className="w-56 border-r border-[#1E1E1E] bg-[#0d0d0d] flex flex-col py-4">
          <p className="px-4 mb-3 text-[10px] font-semibold uppercase text-[#6B6B6B]">
            Documentation
          </p>
          <div className="flex flex-col gap-0.5 px-2">
            {docs.map((doc) => {
              const Icon = icons[doc.icon];
              return (
                <button
                  key={doc.id}
                  onClick={() => setCurrent(docs[doc.id])}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-left transition-colors w-full ${current.id == doc.id
                    ? "bg-[#1A1A1A] text-white border border-[#2E2E2E]"
                    : "text-[#6B6B6B] hover:text-white hover:bg-[#161616]"
                  }`}
                >
                  <Icon size={14} />
                  {doc.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 px-10 py-8 max-w-3xl">
          <h1 className="text-2xl font-semibold text-white mb-8">{current.content.title}</h1>

          <div className="flex flex-col gap-8">
            {current.content.sections.map((section,idx) => (
              <div key={idx} className="flex flex-col gap-2">
                {section.heading && (
                  <h2 className="text-sm font-semibold text-[#E5E5E5]">{section.heading}</h2>
                )}
                {section.body && (
                  <p className="text-sm text-[#9CA3AF] leading-relaxed">{section.body}</p>
                )}
                {section.code && (
                  <div className="bg-[#111111] border border-[#2E2E2E] rounded-lg px-4 py-3 text-xs font-mono text-[#9CA3AF] overflow-x-auto whitespace-pre">
                    {section.code}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
