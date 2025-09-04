// import { getPaymentDetails } from "@/lib/eas.server";
// import { notFound } from "next/navigation";

// export default async function PaymentDetails({ params }: { params: { id: string } }) {
  
//   const payment = await getPaymentDetails(params.id)

//   if (!payment) return notFound();

//   return (
//     <div className="p-8 max-w-md mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Payment Details</h1>
//       <p><strong>Amount:</strong> {payment.amount} ETH</p>
//       <p><strong>Recipient:</strong> {payment.tenant}</p>
//       {/* <p><strong>Attestation ID:</strong> {params.id}</p> */}
//       <p><strong>Date</strong> {payment.month_year}</p>    
//       <p><strong>On Time:</strong> {payment.on_time ? "Yes" : "No"}</p>
//       <a href="/" className="text-indigo-600 underline mt-6 inline-block">← Back to Home</a>
//     </div>
//   );
// }

// src/app/payments/[id]/page.tsx
import { getPaymentDetails } from "@/lib/eas.server";
import { formatEther } from "viem";
import { formatAddress } from "@/lib/utils";

export default async function PaymentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch the attestation data using the ID from the URL
  const attestation = await getPaymentDetails(params.id);

  if (!attestation) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Payment not found</h1>
        <p>No attestation could be retrieved for ID: {params.id}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Payment Details</h1>
      <div className="border rounded-md p-4 space-y-2 bg-white shadow-sm">
        <p>
          <span className="font-medium">Tenant:</span> {attestation.tenant}
        </p>
        <p>
          <span className="font-medium">Amount:</span> {formatEther(BigInt(attestation.amount))} ETH
        </p>
        <p>
          <span className="font-medium">On Time:</span>{" "}
          {attestation.on_time ? "✅ Yes" : "❌ No"}
        </p>
        <p>
          <span className="font-medium">Month-Year:</span>{" "}
          {new Date(attestation.month_year * 1000).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <p>
            <span className="font-medium">Attestation ID:</span>{" "}
            <span style={{ wordBreak: "break-all" }}>{params.id}</span>
        </p>
      </div>
    </div>
  );
}