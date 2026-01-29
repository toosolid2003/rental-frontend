"use client"

import React, { useState } from "react";
import { useRentalInfo } from "@/app/hooks/useRentalInfo";
import PaymentHistory from "./paymentHistory";


function Lease()    {

  const { rentalScore, rentalScoreLoading, refetchScore} = useRentalInfo();
  const [localScore, setLocalScore] = useState<number | undefined>();
  const [animateScore, setAnimateScore] = useState(false);


  return( 
    <div className="space-y-2 max-w-md mx-auto p-8">
        <div className="flex justify-between items-center">
          {/* <span className="text-gray-600 text-sm">Score: {rentalScoreLoading ?   
            (<span className="text-gray-500">Loading...</span>) : 
            (<span className={`transition-transform duration-300 ease-out inline-block ${animateScore ? "scale-120 text-indigo-600" : "scale-100"} `}>
              {localScore ?? rentalScore as number}</span>)}
              </span> */}
        </div>

        <PaymentHistory displayPayButton={true} />
      </div>
  );
}

export default Lease;

