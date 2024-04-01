"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import './globals.css';

export default function LoginPage() {
    const router = useRouter();
    const { data: session } = useSession()

    useEffect(() => {
        if (session) {
            router.push('/home');
        }
    }, [session, router]);

    return (
        <>
        {!session && (
            <>
            <section className="text-center">
                {/* Background image */}
                <div className="p-5 bg-image" style={{
                    backgroundImage: "url('https://cdn-imgix.headout.com/microbrands-content-image/image/ce7515850d57f0afd752be5d0451c621-MountFaberLine_CableCar_towards-sentosa%20-%20.jpg')",
                    height: '300px', 
                    backgroundSize: 'cover', 
                    backgroundPosition: '30% 70%'
                }}></div>
                <div className="card mx-4 mx-md-5 shadow-5-strong" style={{
                    marginTop: '-100px',
                    background: 'hsla(0, 0%, 100%, 0.8)',
                    backdropFilter: 'blur(30px)'
                }}>
                    <div className="card-body py-5 px-md-5">
                        <div className="row d-flex justify-content-center">
                            <div className="col-lg-8">
                                <h2 className="fw-bold mb-5">Hello!</h2>
                                {/* Submit button */}
                                <button className="gsi-material-button" onClick={() => signIn('google')}>
                                    <div className="gsi-material-button-state"></div>
                                    <div className="gsi-material-button-content-wrapper">
                                        <div className="gsi-material-button-icon">
                                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: 'block' }}>
                                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                                <path fill="none" d="M0 0h48v48H0z"></path>
                                            </svg>
                                        </div>
                                        <span className="gsi-material-button-contents">Sign in with Google</span>
                                        <span style={{ display: 'none' }}>Sign in with Google</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            </>
        )}
        </>
    )
}



