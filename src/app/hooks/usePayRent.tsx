import { useEffect, useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount, usePublicClient } from "wagmi";
import { Address, erc20Abi } from 'viem';
import { useRentalInfo } from './useRentalInfo';
import Rental from "@/lib/Rental.json"

const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT as Address;

export function usePayRent(contractAddress: Address)  {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const {isPending, isSuccess, isError}  = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
    confirmations: 1,
});

  const {rentAmount, rentAmountLoading} = useRentalInfo(contractAddress);

  // Read the raw expectedRent from the contract (in USDC smallest unit)
  const { data: expectedRent } = useReadContract({
    address: contractAddress,
    abi: Rental.abi,
    functionName: "checkRent",
    account: address,
  });

  const storeHash = useCallback(async() => {

    // Store the tx hash into the last "paid" Payment object of the payment schedule

    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: Rental.abi,
        functionName: "storeHash",
        args: [txHash],
      });
      console.log("Stored transaction: ", tx);
      return tx;
    }

    catch (error) {
      console.error("error storing the transaction hash: ", error);
      throw error;
    }
  }, [txHash, contractAddress, writeContractAsync]);

  // Storing the tx hash once the transaction has gone through

  useEffect(() =>  {
    if(isSuccess && txHash) {
      storeHash();
    }
  }, [isSuccess, txHash, storeHash]);

  const payRent = async () => {

    if(rentAmountLoading || !expectedRent)  {
      throw new Error('rent amount not ready');
    }

    try{
      // Step 1: Approve the Rental contract to spend USDC on behalf of the tenant
      const approveHash = await writeContractAsync({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [contractAddress, expectedRent as bigint],
      });

      // Wait for the approve transaction to be confirmed before calling payRent
      await publicClient!.waitForTransactionReceipt({ hash: approveHash });

      // Step 2: Call payRent, which triggers transferFrom internally
      const tx = await writeContractAsync({
          address: contractAddress,
          abi: Rental.abi,
          functionName: "payRent",
      });

      setTxHash(tx);
    }
    catch (error) {
      console.error('Error paying rent: ', error);
      throw error;
    }
  };


  return { payRent,
    txHash,
    isPending,
    isError,
    isSuccess,
    isLoading: rentAmountLoading };
}