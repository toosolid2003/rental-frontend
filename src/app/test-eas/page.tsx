"use client"

import React, { useState } from "react";
import { useEasAttestation } from "@/app/hooks/useEas";
import { Address } from "viem";

const TestEasPage = () => {
  const { sendAttestation, isEasPending, isEasSuccess } = useEasAttestation();
  const [amount, setAmount] = useState("1000");
  const [onTime, setOnTime] = useState(true);
  const [monthYear, setMonthYear] = useState("09-2025");
  const [tenant, setTenant] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleTest = async () => {
    setResult(null);
    try {
      const uid = await sendAttestation(
        amount,
        onTime,
        monthYear,
        tenant as Address
      );
      setResult(`✅ Success! Attestation UID: ${uid}`);
      console.log("Attestation UID:", uid);
    } catch (err: any) {
      setResult(`❌ Error: ${err.message}`);
      console.error("Attestation error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 space-y-4">
      <h2 className="text-xl font-bold mb-4">Test EAS Attestation</h2>
      <div className="space-y-2">
        <input
          className="border px-2 py-1 w-full"
          placeholder="Tenant Address"
          value={tenant}
          onChange={e => setTenant(e.target.value)}
        />
        <input
          className="border px-2 py-1 w-full"
          placeholder="Amount (uint64)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <input
          className="border px-2 py-1 w-full"
          placeholder="Month-Year (e.g. 09-2025)"
          value={monthYear}
          onChange={e => setMonthYear(e.target.value)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onTime}
            onChange={e => setOnTime(e.target.checked)}
          />
          On Time
        </label>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          onClick={handleTest}
          disabled={isEasPending}
        >
          {isEasPending ? "Sending..." : "Send Attestation"}
        </button>
        {result && (
          <div className="mt-4 text-sm">
            {result}
          </div>
        )}
        {isEasSuccess && (
          <div className="mt-2 text-green-600">Attestation was successful!</div>
        )}
      </div>
    </div>
  );
};

export default TestEasPage;