import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from 'viem';
import { Address } from 'viem';

import Rental from "@/lib/Rental.json"

export function usePayRent(contractAddress: Address, amountEth: string) {
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const {isPending, isSuccess, isError}  = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
    confirmations: 1,
});

  const payRent = async () => {
    const tx = await writeContractAsync({ 
        address: contractAddress,
        abi: Rental.abi,
        functionName: "payRent",
        value: parseEther(amountEth),
     });
     
    setTxHash(tx);
  };


  return { payRent, txHash, isPending, isError, isSuccess };
}