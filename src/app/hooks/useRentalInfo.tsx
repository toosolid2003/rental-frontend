import {useReadContract, useAccount} from 'wagmi';
import { Address, formatEther } from 'viem';
import Rental from "@/lib/Rental.json";


export const useRentalInfo = () => {

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;
    const { address } = useAccount();

    // Retrieve score
    const scoreRead = useReadContract({
        abi: Rental.abi,
        address: contractAddress,
        functionName: "getScore",
        account: address,
    });

    // Retrieve rental amount
    const rentRead = useReadContract({
        abi: Rental.abi,
        address: contractAddress,
        functionName: "checkRent",
        account: address,
    })


    console.log("Score error:", scoreRead.error);
    console.log("Rent error:", rentRead.error);

    const rent = typeof rentRead.data === "bigint"
        ? Number(formatEther(rentRead.data))
        : undefined;
    
    return  {
        rentalScore: scoreRead.data,
        rentalScoreLoading: scoreRead.isLoading,
        rentAmount: rent,
        rentAmountLoading: rentRead.isLoading,
        refetchScore: scoreRead.refetch,
    }

}