import React from 'react';
import { WalletProviderWrapper } from './components/WalletProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProviderWrapper>{children}</WalletProviderWrapper>
      </body>
    </html>
  );
}