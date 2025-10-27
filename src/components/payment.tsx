import { useRouter } from "next/navigation";
import { Button } from './ui/button'
import { usePayRent } from "@/app/hooks/usePayRent"; 


const PaymentItem = () => {
  
  const router = useRouter();
  const {payRent, isError } = usePayRent();

  return (
            <Button className="bg-indigo-600 text-white rounded-xl px-6 py-2" 
            onClick={payRent} >
                Pay
            </Button>
            )
};