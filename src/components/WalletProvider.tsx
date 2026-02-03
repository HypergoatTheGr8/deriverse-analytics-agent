import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles for the wallet modal
require('@solana/wallet-adapter-react-ui/styles.css');

export const WalletProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the mainnet-beta RPC endpoint or fallback to the default
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl('mainnet-beta');

  // Supported wallets
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
