import { useState } from "react";
import { useWatchContractEvent } from "wagmi";
import Rental from "@/lib/Rental.json";

export function useWatchRent(contractAddress: `0x${string}`) {
  const [onTime, setOnTime] = useState<boolean | null>(null);

  useWatchContractEvent<typeof Rental.abi, "RentPaid">({
    address: contractAddress,
    abi: Rental.abi,
    eventName: "RentPaid",
    onLogs(logs) {
      logs.forEach((log) => {
        const { onTime } = log.args;
        setOnTime(onTime);
      });
    }
});
  return onTime;
}