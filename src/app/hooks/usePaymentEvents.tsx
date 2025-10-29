import { useState } from "react";
import { useWatchContractEvent } from "wagmi";
import Rental from "@/lib/Rental.json";

export function useWatchRent(
  contractAddress: `0x${string}`,
  onRentPaid?: () => void
) {

  useWatchContractEvent({
    address: contractAddress,
    abi: Rental.abi,
    eventName: "RentPaid",
    onLogs(logs) {
      if(logs.length > 0) {
        // Triggers the callback function
        onRentPaid?.();
      }
    }
}
);
}
