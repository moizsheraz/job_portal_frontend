import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Head from "next/head"
export const metadata: Metadata = {
  title: "ALL JOBS - Find Your Dream Job Today",
  description: "Connecting job seekers, employers, and freelancers in one place.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <Head>
      <link rel="icon" href="/favicon.ico" sizes="any" />
    </Head>
    <body>{children}</body>
  </html>
  )
}



import './globals.css'