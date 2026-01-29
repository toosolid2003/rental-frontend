"use client"

import { useSearchParams } from "next/navigation"
import PaymentScreen from "@/components/payment"
import Profile from "@/components/profile"
import { Address } from "viem"

export default function Payment()   {
    const searchParams = useSearchParams();
    const leaseAddress = searchParams.get("lease") as Address | null;

    if (!leaseAddress) {
        return <p>No lease address provided.</p>;
    }

    return(
        <>
        <Profile />
        <PaymentScreen leaseAddress={leaseAddress} />
        </>
    )
}