"use client"

import React, { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup} from "./ui/select";
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
    const tenantLeases = (leasesbyTenant.data as Address[]) ?? [];
    const landlordLeases = (leasesbyLandlord.data as Address[]) ?? [];
    const allLeases = [...new Set([...tenantLeases, ...landlordLeases])];

    useEffect(() => {
        if (allLeases.length > 0 && !selectedLease) {
            setSelectedLease(allLeases[0]);
        }
    }, [allLeases.length])
    
    return (
        <>
            <div className="flex flex-row justify-between">
                {allLeases.length > 0 ? (<div>
                    <Select value={selectedLease} onValueChange={(value) => setSelectedLease(value as Address)}>
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Select a value"/>
                    </SelectTrigger>
                    <SelectContent>
                        {allLeases.map((addr) => (
                            <SelectItem key={addr} value={addr}>
                                <LeaseOption leaseAddress={addr} />
                            </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>) : <p> No lease attached to this address</p>}
                <NewLeaseForm />
            </div>
            {selectedLease && <PaymentHistory leaseAddress={selectedLease} />}
        </>
    )
}
