"use client"
import 'bootstrap/dist/css/bootstrap.css';
import './globals.css'
import Link from 'next/link';
import Image from "next/image";
import logo from '@/app/logo.png'
import { SessionProvider } from "next-auth/react";

export const TopBar = () => {
    return (
        <div className="topbar">
            <div className="left">
                <Image src={logo} width={35} height={35} alt="logo" className="logo" />
                <span className="appname">PriceProbe</span>
            </div>
            <div className="right">
                <Link href="/home">Home</Link>
            </div>
        </div>
    )
};

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
