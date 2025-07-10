"use client"


// DepositFundsButton.jsx
import React, { useState } from "react";
import { H1 } from "@/components/ui/typography";
import { ConnectButton } from '@rainbow-me/rainbowkit';


function DisconnectedHome()    {  

    return (
      <>
        <div className="flex flex-col min-h-screen items-center justify-center ">
          <H1>Thanks for choosing Hestia!</H1>
          <p className="mt-4">Please connect your wallet to get started.</p>
          <div className="mt-8">
            <ConnectButton />
          </div>

        </div>

      </>
    )
    
}

export default DisconnectedHome;