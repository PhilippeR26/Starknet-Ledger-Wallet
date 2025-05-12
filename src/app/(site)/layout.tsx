import './globals.css';
import { ChakraProvider } from '@chakra-ui/react'

export const metadata = {
  title: 'Starknet-Ledger-Wallet',
  description: 'Demo of Ledger Wallet for Starknet',
  icons: {
    icon: "./favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          {children}
        </ChakraProvider>
      </body>
    </html>
  )
}
