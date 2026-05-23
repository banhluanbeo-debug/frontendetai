import './globals.css'
import Script from "next/script";

export const metadata = {
    title: 'My Project',
    description: 'Next App',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="vi">
            <body>

                {/* 🔥 Google Identity Services */}
                <Script
                    src="https://accounts.google.com/gsi/client"
                    strategy="afterInteractive"
                />

                {children}
            </body>
        </html>
    )
}