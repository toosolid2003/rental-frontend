"use client"

import { useAccount } from "wagmi"
import DisconnectedHome from "@/components/disconnected";
import Profile from "@/components/profile"
import Lease from "@/components/lease";

export default function Home() {
  const { isConnected }  = useAccount();

  return (
    <>
      {isConnected ? (<>
        <Profile />
        <Lease />
      </>) : <DisconnectedHome />}
    </>

    )}