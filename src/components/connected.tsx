// DepositFundsButton.jsx
"use client"


import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import Profile from "@/components/profile"
import DisconnectedHome from "./disconnected";
import Lease from "./lease";
import { useAccount } from "wagmi";

function ConnectedHome()    {

  const { isConnected } = useAccount();

  return (
      <>
        {isConnected ? 
        (<>
          <Profile paymentSuccess={false} />
          <Lease onPaymentSuccess={() => { /* handle payment success */ }} />
          <Button
            className="w-14 h-14 p-0 rounded-full bg-indigo-600 text-white text-3xl fixed bottom-8 right-6 shadow-lg"
            aria-label="Add lease">+</Button>
        </>
) : (<DisconnectedHome />)    
      }
    
      </>
  )

}

export default ConnectedHome;