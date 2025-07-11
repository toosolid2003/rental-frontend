import { useState } from 'react';
import { useWriteContract, useTransaction } from "wagmi";
import { parseEther } from 'viem';
import { Address } from 'viem';

import Rental from "@/lib/Rental.json"

export function usePayRent(contractAddress: Address, amountEth: string) {
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState(null);

  const payRent = async () => {
    const tx = await writeContractAsync({ 
        address: contractAddress,
        abi: Rental.abi,
        functionName: "payRent",
        value: parseEther(amountEth),
     });
     
    setTxHash(tx.hash);
  };

  const txStatus = useTransaction({ hash: txHash });

  return { payRent, txStatus };
}