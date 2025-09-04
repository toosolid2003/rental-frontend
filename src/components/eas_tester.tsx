"use client";

import { useEasAttestation } from "@/app/hooks/useEas";
import { useAccount } from "wagmi";
import { useState } from "react";

export default function EasTester() {
  const { address } = useAccount();
  const { sendAttestation } = useEasAttestation();
  const [logs, setLogs] = useState<string[]>([]);

  const log = (msg: string) => setLogs(l => [...l, msg]);

  const handleSend = async () => {
    try {
      if (!address) return log("⚠️ No wallet connected");
      log("Sending attestation...");
      const uid = await sendAttestation("1000", true, "2025-09", address);
      log("✅ Attestation sent: " + uid);
    } catch (err: any) {
      log("❌ " + err.message);
    }
  };


  return (
    <div className="p-4 space-y-4">
      <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded">Send Test Attestation</button>
      <pre className="text-xs bg-gray-100 p-2 rounded max-h-64 overflow-auto">{logs.join("\n")}</pre>
    </div>
  );
}