import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

export function LeaseSelector() {
    const itemList = [
        {label: 'Lease #1', value: 'lease1'},
        {label: 'Lease #2', value: 'lease2'},
    ]
    return (
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
    )
}
