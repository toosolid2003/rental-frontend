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
          <ConnectButton />
        </div>

      </>
    )
    
}

export default DisconnectedHome;