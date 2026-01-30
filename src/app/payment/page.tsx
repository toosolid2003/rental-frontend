"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import PaymentScreen from "@/components/payment"
import Profile from "@/components/profile"
import { Address } from "viem"

function PaymentContent() {
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

export default function Payment() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentContent />
        </Suspense>
    )
}