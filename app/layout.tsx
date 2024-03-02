import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MetaMask Etherjs Connect',
  description: 'MetaMask Etherjs Connect',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className="relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  )
}
