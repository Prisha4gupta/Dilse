import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import { PracticeProvider } from "@/contexts/PracticeContext"
import "./globals.css"

export const metadata: Metadata = {
  title: "DilSe AI - From the heart, for your mind",
  description: "A safe, anonymous, and stigma-free mental wellness companion for Indian youth",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthProvider>
          <PracticeProvider>
            <Suspense fallback={null}>{children}</Suspense>
            <Analytics />
          </PracticeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
