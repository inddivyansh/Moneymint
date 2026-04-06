import Link from "next/link";
import Image from "next/image";
import {getAuth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

const Layout = async ({ children }: { children : React.ReactNode }) => {
    const hasMongoDb = Boolean(process.env.MONGODB_URI?.trim());

    if (hasMongoDb) {
        const auth = await getAuth();
        const session = await auth?.api.getSession({ headers: await headers() })

        if(session?.user) redirect('/')
    }

    return (
        <main className="auth-root">
            <section className="auth-container">
                <Link href="/welcome" className="auth-logo-link">
                    <Image src="/assets/icons/moneymintlogo.png" alt="Moneymint logo" width={44} height={44} className='w-11 h-11' />
                    <span className="auth-logo-text">Moneymint</span>
                </Link>

                <div className="auth-form-wrapper">
                    <div className="auth-card">
                        {children}
                    </div>
                </div>

                <p className="auth-footer-text">© 2026 Moneymint, Inc. Built by Divyansh Nagar.</p>
            </section>
        </main>
    )
}
export default Layout
