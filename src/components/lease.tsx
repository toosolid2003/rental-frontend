"use client"

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { H1, H3 } from "./ui/typography"
import { formatAddress } from "@/lib/utils";
import { usePayRent } from "@/app/hooks/usePayRent";
import { Address } from 'viem';
import { toast } from "sonner";
import { useRentalInfo } from "@/app/hooks/useRentalInfo";
import { useEasAttestation }  from "@/app/hooks/useEas";
import { useAccount } from "wagmi";
import { toMonthYear } from "@/lib/utils";
import { useWatchRent } from "@/app/hooks/usePaymentEvents";
import { useRouter } from "next/navigation";
import { parseEther } from "viem";
import ProgressSection  from "@/components/progress";
import TestSendAttestation from "@/lib/eas.attestation";
import PaymentHistory from "./paymentHistory";

function Lease({onPaymentSuccess}: {onPaymentSuccess: () => void})    {

  const [activeForm, setActiveForm] = useState(false);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

  const { payRent, isPending, isError, isSuccess } = usePayRent();
  const { eas, sendAttestation, isEasSuccess, isEasPending } = useEasAttestation();
  const { rentalScore, rentalScoreLoading, rentAmount, rentAmountLoading, landlord, refetchScore} = useRentalInfo();
  const [localScore, setLocalScore] = useState<number | undefined>();
  const [animateScore, setAnimateScore] = useState(false);
  const { address } = useAccount();
  const onTime = useWatchRent(contractAddress);
  const router = useRouter();

  const [isPaying, setIsPaying] = useState(false);

  // const [payments, setPayments] = useState([
  //   { date: "09-2025", amount: 0.01, status: "due" as const },
  //   { date: "08-2025", amount: 0.01, status: "paid" as const, color: "green", attestationId: "0xf34eee5b9ce93e3af6ef1074f87da2c34b79223a4d4c69173034823e93afb245" },
  //   { date: "07-2025", amount: 0.01, status: "paid" as const, color: "orange", attestationId: "0xf34eee5b9ce93e3af6ef1074f87da2c34b79223a4d4c69173034823e93afb245" },
  //   { date: "06-2025", amount: 0.01, status: "paid" as const, color: "green", attestationId: "0xf34eee5b9ce93e3af6ef1074f87da2c34b79223a4d4c69173034823e93afb245" },
  // ]);


// ---- Handle payment
const handlePaymentSuccess = async () => {
  console.log("Payment is successful.");
  onPaymentSuccess();


  // ---- Now trigger attestation after payment success
  await handleEas();


  // Close the form 
  setIsPaying(false);
  setActiveForm(false);
  toast.success("Rent payment confirmed", {
    description: "Your rent has been paid and recorded onchain",
    duration: 4000,
  });

  try {
    const res = await refetchScore();
    if (res.data) {
      setLocalScore(Number(res.data));
      setAnimateScore(true);
      setTimeout(() => setAnimateScore(false), 500);
    }
  } catch (err) {
    console.error("Score update failed:", err);
  }
};

const handleEas = async () => {
  let attestId: string | null = null;

  try {
    if (!address || !rentAmount) {
      console.warn("[x] Missing address or rent amount.");
      return;
    }
    if (!eas) {
      console.warn("[x] EAS not initialized yet.");
      return;
    }

    const today = new Date();
    const amountWei = parseEther(String(rentAmount));

    if (onTime !== null) {
      console.log("[*] Sending attestation request")
      attestId = await sendAttestation(
        String(amountWei),
        onTime,
        toMonthYear(today),
        address
      );
      console.log(`[*] Payment recorded, attestation id: ${attestId}`);
      toast.success("Attestation confirmed onchain");
    }
  } catch (err) {
    console.error("[x] Attestation failed:", err);
    attestId = "error";
    toast.error("Attestation failed. Please try again.");
  }
    // ---- Update payments array immutably
//   setPayments(prev => [
//     {
//       date: "10-2025", amount: 0.01, status: "due",
//     },
    
//     { date: "09-2025",
//       amount: 0.01,
//       status: "paid",
//       color: "orange",
//       attestationId: attestId || "pending",
//       },
//     ...prev.slice(1),
//   ]);

// }
// ---- React effect: trigger on successful tx
useEffect(() => {
  if (isSuccess && eas) {
    console.log("[*] Successful payment detected. useEffect triggered.")
    handlePaymentSuccess();
  }
}, [isSuccess, eas]);

// ---- User action handlers
const handleClick = (flag: boolean) => {
  setActiveForm(flag);
  if (flag) setIsPaying(false);
};

const handleConfirm = () => {
  setIsPaying(true);
  payRent();
  
}; 



  if(activeForm)  {
    return(
      <>
        <div className="flex-col justify-between mx-auto max-w-sm border-t border-b pb-8 pt-8">
          <div className="flex flex-row justify-between pb-4">
            <H3>Lease #1</H3>
            <p className="text-right">1600 Pensylvania Ave NW <br/> Washington DC</p>
          </div>
          <div className="flex flex-row justify-between pb-4">
            <H3>Rental Period</H3>
            <p>September 2025</p>
          </div>
          <div className="flex flex-row justify-between pb-4">
            <H3>Landlord Wallet</H3>
            <p>{landlord ? formatAddress(landlord as Address):("Loading...")}</p>
          </div>
        </div>

        <div className="flex flex-col items-center pt-8">
          <p>Pay</p>
          <H1>${rentAmount?.toString()}</H1>
          <div className="flex pt-4">
            {isPaying ? (
              <ProgressSection isPending={isPending}
              isSuccess={isSuccess}
              isEasPending={isEasPending}
              isEasSuccess={isEasSuccess}
              />
            ) : (
              <>
              <Button className="mr-4" variant="outline" onClick={() => handleClick(false)} >Cancel</Button>
              <Button onClick={() => handleConfirm()}>Confirm</Button>
              </>
            )        
          }

          </div>

        </div>

      </>
    );
  }

  return( 
    <div className="space-y-2 max-w-md mx-auto p-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lease #1</h2>
          <span className="text-gray-600 text-sm">Score: {rentalScoreLoading ?   
            (<span className="text-gray-500">Loading...</span>) : 
            (<span className={`transition-transform duration-300 ease-out inline-block ${animateScore ? "scale-120 text-indigo-600" : "scale-100"} `}>
              {localScore ?? rentalScore as number}</span>)}
              </span>
        </div>
        <hr />

        <PaymentHistory 
          handlePayment={handleConfirm}/>

      </div>
  );
}
}

export default Lease;

