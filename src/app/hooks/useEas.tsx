// src/hooks/useEas.tsx

import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { BrowserProvider } from "ethers";
import { Address } from "viem";
import { toEpoch } from "@/lib/utils";

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

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: tenant,
        revocable: false,
        data: encodedData,
      },
    });

    const uid = await tx.wait();
    console.log("✅ Attested:", uid);
    return uid;
  };

  return {
    eas,
    sendAttestation,
  };
};