import {useReadContract, useAccount} from 'wagmi';
import { Address, formatEther } from 'viem';
import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import LeaseFactory from "@/lib/LeaseFactory.json";

interface LeaseParams   {
    payDate: number,
    expectedRent: bigint,
    tenant: Address;                                                                                 
    landlord: Address;                                                                               
    startDate: number;                                                                               
    endDate: number;                                                                                 
    location: string; 
}

export const useContractManagement = () => {

    const contractAddress = process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS as Address;
    const { address } = useAccount();
    const [txHash, setTxHash] = useState<`0x${string}` | null>(null);


    const { writeContractAsync} = useWriteContract()
    const {isPending, isSuccess, isError}  = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
    confirmations: 1,
});


    // Create Lease
    const createLease = async(params: LeaseParams) => {
        try{
            const tx = writeContractAsync({
                address: contractAddress,
                abi: LeaseFactory.abi,
                functionName: "createLease",
                args: [
                  params.payDate,                                                                      
                  params.expectedRent,                                                                 
                  params.tenant,                                                                       
                  params.landlord,                                                                     
                  params.startDate,                                                                    
                  params.endDate,                                                                      
                  params.location
                ]
            })
            console.log("Creating contract");
            return tx;
        }
        catch (error)   {
            console.error("Error trying to create a new lease", error);
            throw error;
        }
    }

    // Retrieve contracts by tenant address
    const leasesbyTenant = useReadContract({
        abi: LeaseFactory.abi,
        address: contractAddress,
        functionName: "getLeasesByTenant",
        account: address,
    });

    // Retrieve contracts by landlord address

    return{
        createLease,
        leasesbyTenant
    }
}