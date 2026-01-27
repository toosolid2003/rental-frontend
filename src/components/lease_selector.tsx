"use client"

import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "./ui/select";
import { Button } from "./ui/button";
import NewLeaseForm from "@/components/newLease"

export function LeaseSelector() {
    
    // TODO: replace itemList with a call to the blockchain: getLeasesByTenant => hook to enrich
    const itemList = [
        {label: 'Lease #1', value: 'lease1'},
        {label: 'Lease #2', value: 'lease2'},
    ]
    return (
        <div className="flex flex-row justify-between">
            <Select>
                <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Select a value"/>
                </SelectTrigger>
                <SelectContent>
                    {itemList.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))
                    }
                </SelectContent>
            </Select>
            <NewLeaseForm />
            {/* <Button className="bg-indigo-600 text-white rounded-xl">Create lease</Button> */}
        </div>
    )
}
