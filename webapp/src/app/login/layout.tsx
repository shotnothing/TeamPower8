"use client"
import { SessionProvider } from "next-auth/react";

interface PostLayoutProps {
    children: React.ReactNode;
}

export default function PostLayout({ children }: PostLayoutProps) {
    return <SessionProvider>{children}</SessionProvider>;
}