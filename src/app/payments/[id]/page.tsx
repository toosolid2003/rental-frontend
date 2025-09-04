import { getPaymentDetails } from "@/lib/eas.server";
import { notFound } from "next/navigation";

export default async function PaymentDetails({ params }: { params: { id: string } }) {
  
  const payment = await getPaymentDetails(params.id)

  if (!payment) return notFound();

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Payment Details</h1>
      <p><strong>Amount:</strong> {payment.amount} ETH</p>
      <p><strong>Recipient:</strong> {payment.tenant}</p>
      {/* <p><strong>Attestation ID:</strong> {params.id}</p> */}
      <p><strong>Date</strong> {payment.month_year}</p>    
      <p><strong>On Time:</strong> {payment.on_time ? "Yes" : "No"}</p>
      <a href="/" className="text-indigo-600 underline mt-6 inline-block">← Back to Home</a>
    </div>
  );
}