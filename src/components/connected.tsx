// DepositFundsButton.jsx
"use client"


import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import Profile from "@/components/profile"
import DisconnectedHome from "./disconnected";
import Lease from "./lease";
import { useAccount } from "wagmi";
import { LeaseSelector } from "./lease_selector";

function ConnectedHome()    {

  const { isConnected } = useAccount();

  return (
      <>
        {isConnected ? 
        (<>
          <Profile />
          <div className="max-w-md mx-auto px-4">
            <LeaseSelector />
          </div>
          <Lease />
          <Button
            className="w-14 h-14 p-0 rounded-full bg-indigo-600 text-white text-3xl fixed bottom-8 right-6 shadow-lg"
            aria-label="Add lease">HELLO</Button>
        </>
) : (<DisconnectedHome />)    
      }
    
      </>
  )

}

export default ConnectedHome;