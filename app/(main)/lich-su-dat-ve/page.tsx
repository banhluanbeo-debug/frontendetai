"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/auth/login");
            return;
        }

        const user = JSON.parse(userStr);
        fetch(`https://backendemo-cbwy.onrender.com/api/orders/user/${user.id}`)
            .then(res => res.json())
            .then(data => setOrders(data))
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) return <p className="text-center text-white py-20">Đang tải...</p>;

    return (
        <div className="min-h-screen bg-transparent px-4 py-12 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-[#7c4dff] pl-4">
                Lịch sử đặt vé
            </h2>

            {orders.length === 0 ? (
                <div className="text-center text-gray-400 py-20 bg-[#1a237e]/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
                    <p className="text-5xl mb-4">🎟️</p>
                    <p className="text-lg">Bạn chưa đặt vé nào</p>
                    <Link href="/" className="mt-6 inline-block bg-[#7c4dff] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#651fff] transition shadow-[0_4px_15px_rgba(124,77,255,0.4)]">
                        Xem phim ngay
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order: any) => {
                        const showtime = order.orderDetails?.[0]?.showtime;
                        return (
                            <div key={order.id} className="bg-[#1a237e]/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[#7c4dff]/20">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c4dff] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

                                {/* Header */}
                                <div className="flex justify-between items-center mb-4 relative z-10 border-b border-white/10 pb-4">
                                    <span className="text-gray-400 text-sm">
                                        Mã đơn: <span className="text-white font-bold text-base">#{order.id}</span>
                                    </span>
                                    <span className={`text-xs px-3 py-1.5 rounded-full font-bold shadow-md ${
                                        order.status === "PENDING" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                                        order.status === "PAID" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                                        "bg-red-500/20 text-red-400 border border-red-500/30"
                                    }`}>
                                        {order.status === "PENDING" ? "Chờ thanh toán" :
                                         order.status === "PAID" ? "Đã thanh toán" : "Đã hủy"}
                                    </span>
                                </div>

                                {/* Thông tin phim */}
                                {showtime && (
                                    <div className="space-y-3 mb-5 relative z-10">
                                        <h3 className="font-bold text-[#7c4dff] text-xl leading-tight">{showtime.movieTitle}</h3>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300">
                                            <span className="flex items-center gap-1.5"><span className="text-gray-400">📅</span> {showtime.showDate}</span>
                                            <span className="flex items-center gap-1.5"><span className="text-gray-400">🕐</span> {showtime.showTime}</span>
                                            <span className="flex items-center gap-1.5"><span className="text-gray-400">🏠</span> <span className="font-medium text-white">{showtime.roomName}</span></span>
                                        </div>
                                    </div>
                                )}

                                {/* Ghế */}
                                <div className="mb-5 relative z-10 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <p className="text-xs text-gray-400 mb-2">Ghế đã chọn:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {order.orderDetails?.map((d: any) => (
                                            <span key={d.id} className="bg-[#7c4dff] text-white text-xs px-3 py-1.5 rounded-md font-bold shadow-sm border border-white/10">
                                                {d.seatCode}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-between items-center border-t border-white/10 pt-4 relative z-10">
                                    <span className="text-gray-400 text-sm">
                                        Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 mb-0.5">Tổng tiền</p>
                                        <span className="font-bold text-emerald-400 text-lg">
                                            {order.totalAmount?.toLocaleString("vi-VN")}đ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
