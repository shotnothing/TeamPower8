"use client"

import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { TopBar } from "@/app/topbar";

const SessionLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session) {
    router.push('/');
  }

  return (
    <html lang="en">
      <body>
        <TopBar />
        {children}
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <SessionLayout>{children}</SessionLayout>
    </SessionProvider>
  );
}
