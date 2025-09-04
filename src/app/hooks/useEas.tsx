// src/hooks/useEas.tsx
"use client"


import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { BrowserProvider } from "ethers";
import { Address } from "viem";
import { toEpoch } from "@/lib/utils";

const EAS_GRAPHQL_URL = "https://sepolia.easscan.org/graphql";


const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const schemaUID = "0x998f3887d5a782407412b13d54afa8bc6d44b345e947988f8798531cdea269c2";

export const useEasAttestation = () => {
  const { data: walletClient } = useWalletClient();
  const [eas, setEas] = useState<EAS | null>(null);

  useEffect(() => {
    const setup = async () => {
      if (!walletClient) return;
      const provider = new BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();
      const instance = new EAS(EASContractAddress);
      instance.connect(signer);
      setEas(instance);
    };
    setup();
  }, [walletClient]);

  const sendAttestation = async (
    amount: string,
    on_time: boolean,
    month_year: string,
    tenant: Address
  ) => {
    if (!eas) throw new Error("EAS not initialized");
    if (!tenant) throw new Error("Tenant address is required");

    const encoder = new SchemaEncoder("address tenant, uint64 amount, bool on_time, uint256 month_year");

    const encodedData = encoder.encodeData([
      { name: "tenant", value: tenant, type: "address" },
      { name: "amount", value: amount, type: "uint64" },
      { name: "on_time", value: on_time, type: "bool" },
      { name: "month_year", value: toEpoch(month_year).toString(), type: "uint256" },
    ]);
    console.log("EAS data encoded")

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: tenant,
        revocable: false,
        data: encodedData,
      },
    });

    console.log("Sending EAS transaction")
    const uid = await tx.wait();
    console.log("✅ Attested:", uid);
    return uid;
  };


 const getRecentAttestationsByTenant = async (tenant: Address) => {
  if (!eas) throw new Error("EAS not initialized");
  if (!tenant) throw new Error("Tenant address is required");

  try {
    // GraphQL query to fetch the latest 20 attestations (filtering by recipient)
    const query = `
      {
        attestations(
          where: { recipient: "${tenant.toLowerCase()}", schemaId: "${schemaUID}" }
          orderBy: time
          orderDirection: desc
          first: 20
        ) {
          id
          data
          time
        }
      }
    `;

    const response = await fetch("https://sepolia.easscan.org/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();
    if (!data?.attestations || !Array.isArray(data.attestations)) return [];

    const encoder = new SchemaEncoder("address tenant, uint64 amount, bool on_time, uint256 month_year");

    // Decode each attestation safely
    const decoded = data.attestations
      .map((att: any) => {
        try {
          const decodedData = encoder.decodeData(att.data);
          const payment: any = Object.fromEntries(decodedData.map((f: any) => [f.name, f.value]));
          return {
            id: att.id,
            tenant: payment.tenant,
            amount: payment.amount,
            on_time: payment.on_time,
            month_year: Number(payment.month_year),
            time: Number(att.time),
          };
        } catch (err) {
          console.warn("Failed to decode attestation:", att.id, err);
          return null;
        }
      })
      .filter((att: any) => att !== null);

    // Sort by month_year descending and take the 5 most recent
    const recentPayments = decoded
      .sort((a: any, b: any) => b.month_year - a.month_year)
      .slice(0, 5);

    return recentPayments;
  } catch (err) {
    console.error("Error fetching attestations:", err);
    return [];
  }
}; 

  return {
    eas,
    sendAttestation,
    getRecentAttestationsByTenant,
  };
};