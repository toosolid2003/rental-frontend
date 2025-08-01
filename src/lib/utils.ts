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