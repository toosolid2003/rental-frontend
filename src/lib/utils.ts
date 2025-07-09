import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(addr?: `0x${string}`) {
  if (!addr) return "Not connected"
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}