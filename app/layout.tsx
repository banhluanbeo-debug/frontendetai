// src/app/layout.tsx
import './globals.css'

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
                {children}
            </body>
        </html>
    )
}
