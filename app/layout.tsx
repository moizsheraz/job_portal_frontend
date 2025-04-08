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
      <head>
        <script src="https://widget.northeurope.cloudapp.azure.com:9443/v0.1.0/mobile-money-widget-mtn.js"></script>
        {/* Inline Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log("Hello from inline script!");
            `,
          }}
        ></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
