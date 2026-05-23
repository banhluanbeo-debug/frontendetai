"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("vnp_TxnRef") || searchParams.get("orderId");

    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push("/");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-10 py-12 max-w-md w-full text-center">

                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                    Thanh toán thành công!
                </h1>

                {orderId && (
                    <p className="text-sm text-gray-400 mb-1">
                        Mã đơn hàng: <span className="font-medium text-gray-600">#{orderId}</span>
                    </p>
                )}

                <p className="text-sm text-gray-400 mb-8">
                    Vé của bạn đã được xác nhận. Kiểm tra email để nhận vé.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push("/booking/history")}
                        className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                        Xem lịch sử đặt vé
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        Về trang chủ ({countdown}s)
                    </button>
                </div>
            </div>
        </div>
    );
}