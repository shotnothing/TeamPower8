import Link from 'next/link';
import Image from "next/image";
import './styles.modules.css';
import logo from '@/app/topbar/logo.png'

const TopBar = () => {
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

export default TopBar;