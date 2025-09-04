import { useRouter } from "next/navigation";
import { Button } from './ui/button'
import { usePayRent } from "@/app/hooks/usePayRent"; 

interface Payment{
    date: string;
    amount: number;
    status: "paid" | "due";
    color?: string;
    attestationId?: string;
}


const PaymentItem: React.FC<Payment> = ({date, amount, status, color, attestationId }) => {
  
  // TODO: modify usePayRent for more flexibility
  const router = useRouter();
  const {payRent, isError } = usePayRent('0x123','0.01');

  return (
    <div
        className={`flex justify-between items-center border-b pb-3 pt-3 ${status === "paid" ? "cursor-pointer hover:bg-gray-50" : ""}`}
        onClick={() => {
        if (status === "paid" && attestationId) {
            router.push(`/payments/${attestationId}`);
        }
        }}>

      <div className="text-sm text-gray-600">
        {date}
      </div>

      {/* TODO: Display amount or loading */}
       <div className="flex flex-row items-end">
        <div className="text-3xl font-semibold">
          {amount ? 
            <span className="text-gray-500">Loading...</span> : 
            <span className="text-black-500">{amount.toString()}</span>}
          </div>
        <div className="text-xs text-gray-500 mb-0.5 ml-1">ETH</div>
      </div>
      
      {/* TODO: Show Paid or Pay button */}
      {status === "paid" ? (
          <div className="flex items-center gap-2">
              <span className="text-sm">Paid</span>
              <span className={`w-3 h-3 rounded-full ${
                  color === "green" ? "bg-green-500" : "bg-orange-400"}`}>
              </span>
            </div>) :
          (
            <Button className="bg-indigo-600 text-white rounded-xl px-6 py-2" onClick={payRent}>
                Pay
            </Button>
            )}
    </div>
  
)};