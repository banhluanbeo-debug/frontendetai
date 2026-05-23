import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.get('adminLoggedIn'); // Cookie riêng cho admin
    const pathname = request.nextUrl.pathname;

    // Không chặn trang login của admin (nhưng nếu đã login thì chuyển hướng)
    if (pathname === '/admin/login') {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        return NextResponse.next();
    }

    // Nếu vào /admin/* mà chưa có cookie → đá về /admin/login
    if (pathname.startsWith('/admin') && !isLoggedIn) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
