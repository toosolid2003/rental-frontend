"use client"

import { useAccount } from "wagmi"
import { useState, useEffect } from "react";
import DisconnectedHome from "@/components/disconnected";
import Profile from "@/components/profile"
import Lease from "@/components/lease";
import { LeaseSelector } from "@/components/lease_selector";

export default function Home() {
  const { isConnected }  = useAccount();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render nothing or a loader until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      {isConnected ? (<>
        <Profile paymentSuccess={paymentSuccess}/>
        <div className="max-w-md mx-auto px-4">
          <LeaseSelector />
          {/* <Lease /> */}
        </div>
      </>) : <DisconnectedHome />}
    </>
  );
}