"use client"

import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit';
import {
  WagmiProvider,
  http
} from 'wagmi';
import {
  mainnet,
  sepolia,
  hardhat,
  baseSepolia
} from 'wagmi/chains';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'Rental Score',
  projectId: '3f632d4c128aa13fc0fc6d752426de10',
  chains: [mainnet, sepolia, hardhat, baseSepolia],
  ssr: false,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
    [baseSepolia.id]: http()
  }
});

const queryClient = new QueryClient();

function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
         { children } 
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Web3Provider;