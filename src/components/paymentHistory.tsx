import React, { useMemo } from "react";
import { Button } from "./ui/button";
import { useRentalInfo } from "@/app/hooks/useRentalInfo";
import { useRouter } from "next/navigation";
import { useWatchRent } from "@/app/hooks/usePaymentEvents";
import { useAccount } from "wagmi";
import { Address } from "viem";

// Coming directly from the contract
interface Payment {
    date: number;
    paid: boolean;
    onTime: boolean;
}

interface EnhancedPayment extends Payment {
    color: "green" | "orange";
}


const PaymentHistory = ({leaseAddress, displayPayButton = true}: {leaseAddress: Address, displayPayButton?: boolean}) => {
    const { rentAmount, rentAmountLoading, payments, isPaymentsLoading, refetchPayments, tenant } = useRentalInfo(leaseAddress);
    const { address } = useAccount();
    const router = useRouter();
    const isTenant = address && tenant && address.toLowerCase() === tenant.toLowerCase();

    // Date format options: request a weekday along with a long date
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    // Listening to RentPaid events and fetch the updated payment schedule when it happens.
    useWatchRent(leaseAddress, refetchPayments)
    // Process payments to add color and filter unpaid
    const processedPayments = useMemo(() => {
        const rawPayments = (payments as Payment[]) || [];
        
        // Filter and enhance paid payments
        const paidPayments = rawPayments
            .filter(p => p.paid)
            .map(p => ({
                ...p,
                color: p.onTime ? "green" : "orange"
            })) as EnhancedPayment[];
        
        // Find earliest unpaid payment and convert it to EnhancedPayment (color won't be used for unpaid)
        let earliestUnpaidEnhanced: EnhancedPayment | undefined = undefined;
        
        if(displayPayButton)    {
            const earliestUnpaid = rawPayments
                .filter(p => !p.paid)
                .sort((a, b) => Number(a.date) - Number(b.date))[0];

            earliestUnpaidEnhanced = earliestUnpaid
                ? ({ ...earliestUnpaid, color: "orange" } as EnhancedPayment)
                : undefined;
        }

        return ([...paidPayments, earliestUnpaidEnhanced].filter(Boolean) as EnhancedPayment[]);
    }, [payments, isPaymentsLoading]);

    const handlePay = async () => {
        router.push(`/payment?lease=${leaseAddress}`)
    };

    if (isPaymentsLoading) {
        return <div>Loading payments from the lease...</div>;
    }

    return (
        <div className="space-y-2 max-w-md mx-auto">
                {[...processedPayments]
                .sort((a, b) => Number(b.date) - Number(a.date))
                .map((p, i) => (
                    <div
                        key={i}
                        className="flex justify-between items-center border-b pb-3 pt-3"
                    >
                        <div>
                            <div className="text-sm text-gray-600">
                                {new Date(Number(p.date) * 1000).toLocaleString("en-GB", options)}
                            </div>
                            <div className="flex flex-row items-end">
                                <div className="text-3xl font-semibold">
                                    ${rentAmountLoading ? (
                                        <span className="text-gray-500">Loading...</span>
                                    ) : (
                                        <span className="text-black-500">{rentAmount?.toString()}</span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 mb-0.5 ml-1">USD</div>
                            </div>
                        </div>
                        {p.paid ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm">Paid</span>
                                <span
                                    className={`w-3 h-3 rounded-full ${
                                        p.color === "green" ? "bg-green-500" : "bg-orange-400"
                                    }`}
                                />
                            </div>
                        ) : isTenant ? (
                            <Button
                                className="bg-indigo-600 text-white rounded-xl px-6 py-2"
                                onClick={handlePay} >
                                Pay
                            </Button>
                        ) : <span className="text-sm">Expected</span>}
                    </div>
                ))}
            </div>
    );
};

export default PaymentHistory;