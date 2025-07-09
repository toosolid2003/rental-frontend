"use client"

import { useAccount } from "wagmi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatAddress } from "@/lib/utils"

export default function Home() {
  const address  = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  // const { address }  = useAccount();

  const user = {
    username: "designmojo",
    avatarUrl: null,
    balance: 1850,
    rentalScore: 95,
    leaseScore: 95,
  }

  const payments = [
    { date: "Jan, 5th", amount: 1400, status: "due" },
    { date: "Dec, 5th", amount: 1400, status: "paid", color: "green" },
    { date: "Nov, 10th", amount: 1400, status: "paid", color: "orange" },
    { date: "Oct, 5th", amount: 1400, status: "paid", color: "green" },
  ]

  return (
    <div className="p-4 max-w-md mx-auto space-y-6 relative pb-24">
      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl shadow-md">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={user.avatarUrl || ""} />
              <AvatarFallback className="text-black">DM</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-md">{user.username}</div>
              <div className="text-xs opacity-60">{formatAddress(address)}</div>
            </div>
          </div>
          <div className="flex flex-row items-end">
            <div className="text-4xl font-bold">${user.balance}</div>
            <div className="text-xs text-white/70 ml-1 mb-0.5">USD</div>
          </div>

        </CardContent>
      </Card>

      {/* Lease */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lease #1</h2>
          <span className="text-gray-600 text-sm">Score: {user.leaseScore}%</span>
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
                <div className="text-3xl font-semibold">${p.amount}</div>
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
              <Button className="bg-indigo-600 text-white rounded-xl px-6 py-2">
                Pay
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <Button
        className="w-14 h-14 p-0 rounded-full bg-indigo-600 text-white text-3xl fixed bottom-8 right-6 shadow-lg"
        aria-label="Add lease"
      >
        +
      </Button>
    </div>
  )
}