"use client"

import { useAccount } from "wagmi"
import DisconnectedHome from "@/components/disconnected";
import ConnectedHome from "@/components/connected";

export default function Home() {
  const { isConnected }  = useAccount();

  return (
    <>
      {isConnected ? <ConnectedHome /> : <DisconnectedHome />}
    </>

    )}