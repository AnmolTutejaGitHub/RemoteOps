"use client";

// ref : https://xtermjs.org/

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export default function TerminalPage() {
  const { connectionID } = useParams();
  const elRef = useRef(null);

  useEffect(() => {
    const term = new Terminal({ cursorBlink: true });
    const fit = new FitAddon();

    term.loadAddon(fit);
    term.open(elRef.current);
    fit.fit();

    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      socket.emit("start-terminal", { connectionId: connectionID });
      term.writeln("Connecting...\r");
    });

    socket.on("output", (data) => term.write(data));

    socket.on("disconnect", () => {
      term.writeln("\r\n[Disconnected]\r\n");
    });

    term.onData((data) => socket.emit("input", data));

    const resize = () => {
      fit.fit();
      socket.emit("resize", { rows: term.rows, cols: term.cols });
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      socket.disconnect();
      term.dispose();
    };
  }, [connectionID]);

  return <div ref={elRef} className="h-screen w-screen bg-black" />;
}