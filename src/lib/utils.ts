import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(addr?: `0x${string}`) {
  if (!addr) return "Not connected"
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function toEpoch(raw_date: string)  {
  // Input should be as "07-2025"
  const [year, month] = raw_date.split("-").map(Number);
  const date = new Date(Date.UTC(month, year, - 1, 1, 0, 0, 0));
  const epoch = Math.floor(date.getTime() / 1000);

  return epoch;
}

export function toMonthYear(raw: Date)  {
  const month = String(raw.getMonth() + 1).padStart(2, '0');
  const year = raw.getFullYear();
  return `${month}-${year}`;
}

interface Payment{
  date: BigInt,
  paid: boolean,
  on_time: boolean
}

export function paymentFilter(payments: Array<Payment>) {
  return payments.filter(payment => payment.paid === true);
}

export function nextPayment(payments: Array<Payment>) {
  const unpaid = payments.filter(payment => payment.paid === false);

  if (unpaid.length === 0) return undefined;

  return unpaid.reduce((min, curr) => (curr.date < min.date ? curr : min));
}
