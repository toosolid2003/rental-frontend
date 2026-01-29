import {useReadContract, useAccount, usePublicClient} from 'wagmi';
import { Address, decodeEventLog } from 'viem';
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
    const publicClient = usePublicClient();

    const { writeContractAsync} = useWriteContract()
    const {isPending, isSuccess, isError}  = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
    confirmations: 1,
});


    // Create Lease
    const createLease = async(params: LeaseParams) => {
        try{
            console.log("Calling create Lease")
            const hash = await writeContractAsync({
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
            console.log("Transaction submitted:", hash);

            // Wait for transaction receipt
            const receipt = await publicClient!.waitForTransactionReceipt({ hash });
            console.log("Transaction confirmed:", receipt);

            // Parse the LeaseCreated event from logs
            const leaseCreatedLog = receipt.logs.find(log => {
                try {
                    const decoded = decodeEventLog({
                        abi: LeaseFactory.abi,
                        data: log.data,
                        topics: log.topics,
                    });
                    return decoded.eventName === 'LeaseCreated';
                } catch {
                    return false;
                }
            });

            if (leaseCreatedLog) {
                const decoded = decodeEventLog({
                    abi: LeaseFactory.abi,
                    data: leaseCreatedLog.data,
                    topics: leaseCreatedLog.topics,
                });
                const leaseContract = (decoded.args as unknown as { leaseContract: Address }).leaseContract;
                console.log("New lease contract address:", leaseContract);
                return leaseContract;
            }

            throw new Error("LeaseCreated event not found in transaction logs");
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
        args: address ? [address] : undefined,
    });


    const leasesbyLandlord = useReadContract({
        abi: LeaseFactory.abi,
        address: contractAddress,
        functionName: "getLeasesByLandlord",
        args: address ? [address] : undefined,
    });

    return{
        createLease,
        leasesbyTenant,
        leasesbyLandlord,
    }
}