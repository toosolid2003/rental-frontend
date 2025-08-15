import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: sepolia, // or mainnet, hardhat, etc.
  transport: http(),
})