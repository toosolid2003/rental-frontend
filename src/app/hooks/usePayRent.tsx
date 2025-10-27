import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from 'viem';
import { Address } from 'viem';
import { useRentalInfo } from './useRentalInfo';

import Rental from "@/lib/Rental.json"

export function usePayRent()  {
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const {isPending, isSuccess, isError}  = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
    confirmations: 1,
});

  const {rentAmount, rentAmountLoading} = useRentalInfo();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

  const payRent = async () => {
    
    if(rentAmountLoading || !rentAmount)  {
      throw new Error('rent amount not ready');
    }

    try{
      const tx = await writeContractAsync({ 
          address: contractAddress,
          abi: Rental.abi,
          functionName: "payRent",
          value: parseEther(String(rentAmount) ?? "0"),
      });
      
      setTxHash(tx);
    }
    catch (error) {
      console.error('Error paying rent: ', error);
      throw error;
    }
  };


  return { payRent, txHash, isPending, isError, isSuccess, isLoading: rentAmountLoading };
}