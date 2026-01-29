"use client"

import React, { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "./ui/select";
import NewLeaseForm from "@/components/newLease"
import { useContractManagement } from "@/app/hooks/useContractManagement";
import { useAccount, useReadContract } from 'wagmi'
import { Address } from "viem";
import Rental from "@/lib/Rental.json";
import PaymentHistory from "./paymentHistory";

function LeaseOption({ leaseAddress }: { leaseAddress: Address }) {
    const { data: loc } = useReadContract({
        abi: Rental.abi,
        address: leaseAddress,
        functionName: "loc",
    });
    return <>{(loc as string) ?? leaseAddress}</>;
}

export function LeaseSelector() {

    const { leasesbyTenant, leasesbyLandlord } = useContractManagement();
    const [selectedLease, setSelectedLease] = useState<Address | undefined>();
    let leases = (leasesbyTenant.data as Address[]) ?? [];
    let landlordLeases = (leasesbyLandlord.data as Address[]) ?? [];

    useEffect(() => {
        if (leases.length > 0 && !selectedLease) {
            setSelectedLease(leases[0]);
        }
    }, [leases])
    
    return (
        <>
            <div className="flex flex-row justify-between">
                <Select value={selectedLease} onValueChange={(value) => setSelectedLease(value as Address)}>
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Select a value"/>
                    </SelectTrigger>
                    <SelectContent>
                        {leases.map((addr) => (
                            <SelectItem key={addr} value={addr}>
                                <LeaseOption leaseAddress={addr} />
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <NewLeaseForm />
            </div>
            {selectedLease && <PaymentHistory leaseAddress={selectedLease} />}
        </>
    )
}
