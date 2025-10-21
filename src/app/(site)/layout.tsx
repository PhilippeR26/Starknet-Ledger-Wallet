import type { Metadata } from 'next';
// import './globals.css';
import {Provider} from "@/components/ui/provider";

import { ChakraProvider } from '@chakra-ui/react'

export const metadata: Metadata = {
  title: 'Starknet-Ledger-Wallet',
  description: 'Demo of Ledger Wallet for Starknet',
  icons: {
    icon: "./favicon.ico",
  },
}

export default function RootLayout(
 props: { children: React.ReactNode }
) {
  const { children } = props
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
