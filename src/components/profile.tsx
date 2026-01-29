import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";


function Profile()  {

  // Generic hooks
  const { address }  = useAccount();

  // Custom or Wagmi hooks
  const fallbackUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;
  const { data: balance, refetch, isLoading } = useBalance({ address: address ?? undefined  });



  return(
    <div className="p-4 max-w-md mx-auto space-y-6 relative pb-12">
         {/* Balance Card */}
         <Card className="bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl shadow-md">
           <CardContent className="flex flex-col justify-between p-4 space-y-3">

             <div className="flex justify-between items-center ">
              <ConnectButton showBalance={false} chainStatus="icon"/>
              <img src="/verified.svg" alt="verified" className="w-6 h-6 invert"/>
             </div>
             
             <div className="text-s text-white/70 ml-1 mb-0.5 mt-8">Available Funds </div>
             <div className="flex flex-row items-end">
               {/* <div className="text-4xl font-bold">${user.balance}</div> */}
               <div className="text-4xl font-bold">{
                   isLoading ? "Loading balance" : Number(balance?.formatted).toFixed(1)
                 }</div>
               <div className="text-xs text-white/70 ml-1 mb-0.5">{
                 isLoading ? "" : "USDC"
               }</div>
             </div>

           </CardContent>
         </Card>
    </div>
  )

}

export default Profile;
