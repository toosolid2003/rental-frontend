"use client"

import { useAccount } from "wagmi"
import { useState } from "react";
import DisconnectedHome from "@/components/disconnected";
import Profile from "@/components/profile"
import Lease from "@/components/lease";

export default function Home() {
  const { isConnected }  = useAccount();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  return (
    <>
      {isConnected ? (<>
        <Profile paymentSuccess={paymentSuccess}
                onRefetch={() => setPaymentSuccess(false)}/>
        <Lease onPaymentSuccess={() => setPaymentSuccess(true)} />
      </>) : <DisconnectedHome />}
    </>

    )}