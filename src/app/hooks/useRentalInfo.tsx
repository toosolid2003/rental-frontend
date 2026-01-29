import {useReadContract, useAccount} from 'wagmi';
import { Address, formatEther } from 'viem';
import { useMemo } from 'react';
import Rental from "@/lib/Rental.json";


export interface Payment {
  date: number;      // unix timestamp (number)
  paid: boolean;
  onTime: boolean;
}

export const useRentalInfo = (contractAddress: Address) => {
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

    // Retrieve landlord address
    const landRead  = useReadContract({
        abi: Rental.abi,
        address: contractAddress,
        functionName: "getLandlord",
        account: address,
    })

    // Retrive payDate
    const payDateRead = useReadContract({
        abi: Rental.abi,
        address: contractAddress,
        functionName: "payDate",
        account: address,
    })

    const locationRead = useReadContract({
        abi: Rental.abi,
        address: contractAddress,
        functionName: "loc"
    })

    // Retrieve tenant (owner) address
    const tenantRead = useReadContract({
        abi: Rental.abi,
        address: contractAddress,
        functionName: "owner",
    })

    // Retrieve payment schedule
    const paymentsRead = useReadContract({
        abi: Rental.abi,
        address: contractAddress,
        functionName: "getPayments",
        account: address,
    })


    const rent = typeof rentRead.data === "bigint"
        ? Number(formatEther(rentRead.data))
        : undefined;

    // normalize raw contract output into a stable Payment[] array
    const payments = useMemo<Payment[]>(() => {
      const raw = paymentsRead.data;
    
      if (!Array.isArray(raw)) {
          console.log('Payments data is not an array:', raw);
          return [];
      }

      const normalized = raw.map((p: any) => {
        const dateRaw = p?.date ?? p?.[0];
        const paidRaw = p?.paid ?? p?.[1];
        const onTimeRaw = p?.onTime ?? p?.onTime ?? p?.[2];

        return {
            date: typeof dateRaw === "bigint" ? Number(dateRaw) : Number(dateRaw ?? 0),
            paid: Boolean(paidRaw),
            onTime: Boolean(onTimeRaw)
        } as Payment;
      });

      return normalized;
    }, [paymentsRead.data]);

    
    return  {
        rentalScore: scoreRead.data,
        rentalScoreLoading: scoreRead.isLoading,
        rentAmount: rent,
        rentAmountLoading: rentRead.isLoading,
        landlord: landRead.data,
        payDate: payDateRead.data,
        payments, 
        isPaymentsLoading: paymentsRead.isLoading,
        isPaymentsError: paymentsRead.isError,
        refetchPayments: paymentsRead.refetch,
        refetchScore: scoreRead.refetch,
        locationRead: locationRead.data,
        isLocationRead: locationRead.isLoading,
        tenant: tenantRead.data as Address | undefined,
    }

}