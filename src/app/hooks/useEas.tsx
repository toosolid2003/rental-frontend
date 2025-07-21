import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { useEffect, useState } from "react";
import { useWalletClient, useAccount } from "wagmi";
import { ethers } from "ethers";

export const useEAS = () => {
  const [eas, setEAS] = useState<EAS | null>(null);
  const { address, chain } = useAccount();

  useEffect(() => {
    const init = async () => {
      const eas = new EAS("https://sepolia.easscan.org/graphql");

      const walletClient = await useWalletClient({ chainId: chain?.id });
      if (!walletClient) return;

      // Wrap viem wallet client in an ethers provider
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await ethersProvider.getSigner();

      await eas.connect(signer);
      setEAS(eas);
    };

    init();
  }, [address]);

  return eas;
};