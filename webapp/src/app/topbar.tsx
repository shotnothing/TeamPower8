import { signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import logo from '@/app/logo.png';
import { useRouter } from 'next/navigation'; 

// TopBar component for displaying the top navigation bar
export const TopBar = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const redirectToLoginPage = () => {
        router.push('/');
    };

    const redirectToHomePage = () => {
        router.push('/home');
    };

    const redirectToCataloguePage = () => {
        router.push('/mflg');
    };

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        redirectToLoginPage(); 
    };

    return (
        <>
        {session && 
            <div className="topbar">
                {/* Left: logo and app name */}
                <div className="left">
                    <Image src={logo} width={35} height={35} alt="logo" className="logo" />
                    <a className="navbar-brand" href="/home">PriceProbe</a>
                </div>
                {/* Right: home, catalogue, and sign out buttons when user is logged in */}
                <div className="right">
                        <button type="button" className="btn" onClick={redirectToHomePage}>Home</button>
                        <button type="button" className="btn" onClick={redirectToCataloguePage}>Catalogue</button>
                        <button type="button" className="btn btn-light" onClick={handleSignOut}>Sign out</button>
                </div>
            </div>
        }
        {!session && 
            <div className="topbar">
                <div className="left">
                    <Image src={logo} width={35} height={35} alt="logo" className="logo" />
                    <a className="navbar-brand" href="#">PriceProbe</a>
                </div>
            </div>
        }
        </>
    );
};
