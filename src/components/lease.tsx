import React, { useState } from "react";
import { Button } from "./ui/button";


function Lease()    {

     const user = {
  username: "theDesignMojo",
  avatarUrl: null,
  balance: 2450,
  leaseScore: 95,
  }

  const payments = [
    { date: "Jan, 5th", amount: 1400, status: "due" },
    { date: "Dec, 5th", amount: 1400, status: "paid", color: "green" },
    { date: "Nov, 10th", amount: 1400, status: "paid", color: "orange" },
    { date: "Oct, 5th", amount: 1400, status: "paid", color: "green" },
  ]

  return(
    <div className="space-y-2 max-w-md mx-auto p-8">
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
  )

}

export default Lease;

