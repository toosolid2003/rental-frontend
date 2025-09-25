"use client"

import PaymentHistory from "@/components/paymentHistory";

const testHistory = () => {
    const history = [
    { date: "08-2025", amount: 0.01, status: "paid" as const, color: "green", attestationId: "0xf34eee5b9ce93e3af6ef1074f87da2c34b79223a4d4c69173034823e93afb245" },
    { date: "07-2025", amount: 0.01, status: "paid" as const, color: "orange", attestationId: "0xf34eee5b9ce93e3af6ef1074f87da2c34b79223a4d4c69173034823e93afb245" },
    { date: "06-2025", amount: 0.01, status: "paid" as const, color: "green", attestationId: "0xf34eee5b9ce93e3af6ef1074f87da2c34b79223a4d4c69173034823e93afb245" },
  ]

    const rentAmount = 100

    
    return (
        <>
            <PaymentHistory payments={history}
            rentAmount={rentAmount}
            rentAmountLoading={false}
            onPayClick={() => {}} />
        </>
    )
}

export default testHistory