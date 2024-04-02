import { signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import logo from '@/app/logo.png';
import { useRouter } from 'next/navigation'; 

export const TopBar = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const redirectToLoginPage = () => {
        router.push('/');
    };

    const redirectToHomePage = () => {
        router.push('/authorised/home');
    };

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        redirectToLoginPage(); 
    };

    return (
        <div className="topbar">
            <div className="left">
                <Image src={logo} width={35} height={35} alt="logo" className="logo" />
                <span className="appname">PriceProbe</span>
            </div>
            <div className="right">
                {session && 
                <>
                    <button type="button" className="btn" onClick={redirectToHomePage}>Home</button>
                    <button type="button" className="btn btn-light" onClick={handleSignOut}>Sign out</button>
                </>
                }
            </div>
        </div>
    );
};
