"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem("adminUser"); // Key riêng cho admin

        if (!userStr) {
            // Chưa đăng nhập → đá về trang login
            router.replace("/auth/login");
            return;
        }

        // Đã đăng nhập → cho vào
        setIsAuthorized(true);
    }, [router]);

    // Chưa check xong thì hiện loading, tránh nhấp nháy
    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700 text-xl font-semibold">
                Đang kiểm tra đăng nhập...
            </div>
        );
    }

    return <>{children}</>;
}

