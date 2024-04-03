"use client"

import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"
import 'bootstrap/dist/css/bootstrap.css';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/');
        },
    })

    if (status === "loading") {
        return (
            <div className="text-center">
                <div className="spinner-border" role="status"></div>
            </div>
        );
    }

    return (
        <> {children} </>
    );
}