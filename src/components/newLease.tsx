"use client"

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Address } from 'viem'
import { useContractManagement } from '@/app/hooks/useContractManagement'
import { useAccount } from "wagmi";

interface LeaseInput {
    rent_amount: number,
    pay_date: number,
    start_date: Date,
    end_date: Date,
    tenant: string,
    location: string,
}

export default function newLeaseForm()  {
    const { register, handleSubmit, formState: {errors} } = useForm<LeaseInput>();
    const { createLease } = useContractManagement();
    const { address } = useAccount();
    const [isOpen, setIsOpen] = useState(false);

    const onSubmit: SubmitHandler<LeaseInput> = async(data) => {
        console.log(data);
        if(address) {
            const leaseAddress = await createLease({                                                                   
                payDate: Math.floor(new Date(data.start_date).getTime() / 1000),                             
                expectedRent: BigInt(data.rent_amount * 10**6), // USDC has 6 decimals                       
                tenant: data.tenant as Address,                                                              
                landlord: address, // connected wallet                                                       
                startDate: Math.floor(new Date(data.start_date).getTime() / 1000),                           
                endDate: Math.floor(new Date(data.end_date).getTime() / 1000),                               
                location: data.location
            });
            console.log("New lease address: ", leaseAddress);
            setIsOpen(false);        
            }
    }


    return(
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 text-white rounded-xl">Create lease</Button>
            </DialogTrigger>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Create Lease</DialogTitle>
                        <DialogDescription>
                            Enter the lease data to create and register the lease.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rent_amount">Rent amount (USDC)</Label>
                            <Input type="number" id="rent_amount" {...register("rent_amount", {required: true})} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="pay_date">Pay date (day of month)</Label>
                            <Input type="number" id="pay_date" min={1} max={31} {...register("pay_date", {required: true, min: 1, max: 31})} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="start_date">Start date</Label>
                            <Input type="date" id="start_date" {...register("start_date", {required: true})} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="end_date">End date</Label>
                            <Input type="date" id="end_date" {...register("end_date", {required: true})} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tenant">Tenant wallet</Label>
                            <Input type="text" id="tenant" {...register("tenant", {required: true})} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location">Location</Label>
                            <Input type="text" id="location" {...register("location")} />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}