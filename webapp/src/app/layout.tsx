"use client"
import 'bootstrap/dist/css/bootstrap.css';
import './globals.css'
import { SessionProvider } from "next-auth/react";
import { TopBar } from "@/app/topbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <html lang="en">
        <body><TopBar />{children}</body>
      </html>
    </SessionProvider>
  )
}
