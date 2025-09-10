// Example: TestSendAttestation.tsx
import React from "react";
import { useEasAttestation } from "@/app/hooks/useEas";
import { Address } from "viem";

const TestSendAttestation = () => {
  const { sendAttestation, isEasPending, isEasSuccess } = useEasAttestation();

  const handleTest = async () => {
    try {
      const uid = await sendAttestation(
        "0.01",         // amount (string)
        true,           // on_time (boolean)
        "09-2025",      // month_year (string)
        "0xd9e8294515669AD69068d97Bc61Ff58ed87218E3" as Address // tenant address
      );
      console.log("Attestation UID:", uid);
    } catch (err) {
      console.error("Attestation error:", err);
    }
  };

  return (
    <div>
      <button onClick={handleTest} disabled={isEasPending}>
        Test Attestation
      </button>
      {isEasPending && <p>Pending...</p>}
      {isEasSuccess && <p>Success!</p>}
    </div>
  );
};

export default TestSendAttestation;