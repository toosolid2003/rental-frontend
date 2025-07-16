import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { H1, H3 } from "./ui/typography"
import { formatAddress } from "@/lib/utils";
import { usePayRent } from "@/app/hooks/usePayRent";
import { Address } from 'viem';
import { toast } from "sonner";
import { useRentalInfo } from "@/app/hooks/useRentalInfo";


function Lease({onPaymentSuccess}: {onPaymentSuccess: () => void})    {

  const [activeForm, setActiveForm] = useState(false);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

  const { payRent, isSuccess } = usePayRent(contractAddress, "1400")
  const { rentalScore, rentalScoreLoading, rentAmount, rentAmountLoading, landlord, refetchScore } = useRentalInfo();
  const [localScore, setLocalScore] = useState<number | undefined>();
  const [animateScore, setAnimateScore] = useState(false);
  
  
  const [payments, setPayments] = useState([
    { date: "Jan, 5th", amount: 1400, status: "due" },
    { date: "Dec, 5th", amount: 1400, status: "paid", color: "green" },
    { date: "Nov, 10th", amount: 1400, status: "paid", color: "orange" },
    { date: "Oct, 5th", amount: 1400, status: "paid", color: "green" },
  ]);


  useEffect(() => {
    if(isSuccess) {
        console.log("Success, BRO!!!!");
        onPaymentSuccess();   // Notify parent component

        // Update the payments array
        const updated = [...payments];
        updated.shift(); // Remove the first element of the array
        updated.unshift({date: "Jan, 5th", amount: 1400, status: "paid", color: "green"});
        updated.unshift({date: "Feb, 5th", amount: 1400, status: "due"});
        setPayments(updated);

        // Update the rental score
        // setAnimate(true);
        if (isSuccess) {
          refetchScore().then((res)  =>  {
            console.log("upodate score", res.data);
            if(res.data)  {
               setLocalScore(Number(res.data));
               setAnimateScore(true);
               setTimeout(() => setAnimateScore(false), 500);
            }
          });
        }
       


        // Display the lease dashboard
        setActiveForm(false);
        toast.success("Rent payment confirmed", {
          description: "Your rent has been paid and recorded onchain",
          duration: 4000,
        });
      }


    }, [isSuccess]);

  const handleClick = async(flag: boolean) => {
    setActiveForm(flag);
  }

  const handleConfirm = async() => {
      payRent();
  };



  if(activeForm)  {
    return(
      <>
        <div className="flex-col justify-between mx-auto max-w-sm border-t border-b pb-8 pt-8">
          <div className="flex flex-row justify-between pb-4">
            <H3>Lease #1</H3>
            <p className="text-right">1600 Pensylvania Ave NW <br/> Washington DC</p>
          </div>
          <div className="flex flex-row justify-between pb-4">
            <H3>Rental Period</H3>
            <p>January 2025</p>
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
            <Button className="mr-4" variant="outline" onClick={() => handleClick(false)} >Cancel</Button>
            <Button onClick={() => handleConfirm()}>Confirm</Button>

          </div>

        </div>

      </>
    );
  }

  return( 
    <div className="space-y-2 max-w-md mx-auto p-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lease #1</h2>
          <span className="text-gray-600 text-sm">Score: {rentalScoreLoading ?   
            (<span className="text-gray-500">Loading...</span>) : 
            (<span className={`transition-transform duration-300 ease-out inline-block ${animateScore ? "scale-120 text-indigo-600" : "scale-100"} `}>
              {localScore ?? rentalScore as number}/100</span>)}
              </span>
        </div>
        <hr />

        {payments.map((p, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b pb-3 pt-3"
          >
            <div>
              <div className="text-sm text-gray-600">{p.date}</div>
              <div className="flex flex-row items-end">
                <div className="text-3xl font-semibold">${rentAmountLoading ? (
                  <span className="text-gray-500">Loading...</span>
                ) : (<span className="text-black-500">{rentAmount?.toString()}</span>)}</div>
                <div className="text-xs text-gray-500 mb-0.5 ml-1">USD</div>
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
              <Button className="bg-indigo-600 text-white rounded-xl px-6 py-2" onClick={() => handleClick(true)}>
                Pay
              </Button>
            )}
          </div>
        ))}
      </div>
  );
}


export default Lease;

