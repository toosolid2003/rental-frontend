import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from './ui/button'
import { usePayRent } from "@/app/hooks/usePayRent"; 
import { H1, H3 } from "./ui/typography"
import { useRentalInfo } from "@/app/hooks/useRentalInfo";
import { formatAddress } from "@/lib/utils";
import { Address } from "viem";
import ProgressSection  from "@/components/progress";
import { toast } from "sonner";

interface Payment {
    date: Number;
    paid: boolean;
    onTime: boolean;
}


const PaymentScreen = () => {
  
  const router = useRouter();
  const {payRent, isPending, isError, isSuccess } = usePayRent();
  const [isPaying, setIsPaying] = useState(false);
  const {landlord, rentAmount, rentAmountLoading, payments} = useRentalInfo();

  const handleConfirm = async() => {
    setIsPaying(true);
    payRent();
  }

  const handleCancel = async() => {
    router.push('/')
  }

  useEffect(() => {
    // On success, display a success toast and route the user back to the dashboard
    if(isSuccess) {
      toast.success("Rent payment confirmed", {
        description: "Your payment has been recorded onchain",
        duration: 4000
      })

      setTimeout(() =>  {
        router.push('/');
      }, 2000);
      // Wait 2 seconds 
    }
  }, [isSuccess, router]
  )

  const rawPayments = (payments as Payment[]) || [];
  const currentPayment = rawPayments
    .filter(p => !p.paid)
    .sort((a, b) => Number(a.date) - Number(b.date))[0]
    


  return (
<>
        <div className="flex-col justify-between mx-auto max-w-sm border-t border-b pb-8 pt-8">
          <div className="flex flex-row justify-between pb-4">
            <H3>Lease #1</H3>
            <p className="text-right">1600 Pensylvania Ave NW <br/> Washington DC</p>
          </div>
          <div className="flex flex-row justify-between pb-4">
            <H3>Rental Period</H3>
            <p>{currentPayment?        
                (new Date(Number(currentPayment.date) * 1000).toLocaleDateString())
                :
                ("Loading")
                }</p>
          </div>
          <div className="flex flex-row justify-between pb-4">
            <H3>Landlord Wallet</H3>
            <p>{landlord ? formatAddress(landlord as Address):("Loading...")}</p>
          </div>
        </div>

        <div className="flex flex-col items-center pt-8">
          <p>Pay</p>
          <H1>${rentAmount?.toString()}</H1>
          <div className="flex pt-4">
            {isPaying ? (
              <ProgressSection isPending={isPending}
              isSuccess={isSuccess}
              />
            ) : (
              <>
              <Button className="mr-4" variant="outline" onClick={handleCancel} >Cancel</Button>
              <Button onClick={() => handleConfirm()}>Confirm</Button>
              </>
            )        
          }

          </div>

        </div>

      </>
            )
};

export default PaymentScreen;