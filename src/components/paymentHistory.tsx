import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";


interface Payment{
    date: string;
    amount: number;
    status: "paid" | "due";
    color?: string;
    attestationId?: string;
}

interface PaymentHistoryProps   {
    payments: Payment[];
    rentAmount: number | undefined;
    rentAmountLoading: boolean;
    onPayClick: () => void;
}
const PaymentHistory: React.FC<PaymentHistoryProps> = ({
    payments,
    rentAmount,
    rentAmountLoading,
    onPayClick,
}) => {

    const router = useRouter();
    return(
        <div className="space-y-2 max-w-md mx-auto">
            <div>
                {payments.map((p, i) => (
                        <div
                            key={i}
                            className={`flex justify-between items-center border-b pb-3 pt-3 ${p.status === "paid" ? "cursor-pointer hover:bg-gray-50" : ""}`}
                            onClick={() => {
                            if (p.status === "paid" && p.attestationId) {
                                router.push(`/payments/${p.attestationId}`);
                            }
                            }}>
                            <div>
                                <div className="text-sm text-gray-600">{p.date}</div>
                                    <div className="flex flex-row items-end">
                                        <div className="text-3xl font-semibold">${rentAmountLoading ? (
                                        <span className="text-gray-500">Loading...</span>
                                        ) : (<span className="text-black-500">{rentAmount?.toString()}</span>)}</div>
                                        <div className="text-xs text-gray-500 mb-0.5 ml-1">ETH</div>
                                    </div>
                                </div>
                            {p.status === "paid" ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm">Paid</span>
                                <span
                                className={`w-3 h-3 rounded-full ${
                                    p.color === "green"
                                    ? "bg-green-500"
                                    : "bg-orange-400"
                                }`}
                                />
                            </div>
                            ) : (
                            <Button className="bg-indigo-600 text-white rounded-xl px-6 py-2" onClick={onPayClick}>
                                Pay
                            </Button>
                            )}
                        </div>
                        ))}
            </div>
        </div>
        
    );
};

export default PaymentHistory;