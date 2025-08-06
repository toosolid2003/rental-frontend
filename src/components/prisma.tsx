import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Add a wallet-contract relationship
export async function addWalletContract(walletAddress: string, contractAddress: string) {
  return prisma.walletContract.create({
    data: { walletAddress, contractAddress }
  });
}

// Add a payment
export async function addPayment(contractAddress: string, walletAddress: string, amount: number, paidAt: Date, status: string, attestation: string) {
  return prisma.payment.create({
    data: { contractAddress, walletAddress, amount, paidAt, status }
  });
}

// Get payment history for a contract
export async function getPayments(contractAddress: string) {
  return prisma.payment.findMany({
    where: { contractAddress }
  });
}