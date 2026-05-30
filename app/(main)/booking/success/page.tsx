"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function BookingSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) return;
        fetch(`https://backendemo-cbwy.onrender.com/api/orders/${orderId}`)
            .then(res => res.json())
            .then(data => setOrder(data))
            .finally(() => setLoading(false));
    }, [orderId]);

    if (loading) return <p className="text-center text-white py-20">Đang tải...</p>;
    if (!order) return <p className="text-center text-red-400 py-20">Không tìm thấy đơn hàng!</p>;

    const showtime = order.orderDetails?.[0]?.showtime;

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-[#1a237e]/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl text-white relative overflow-hidden">
                {/* Decorative glowing orb */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c4dff] rounded-full blur-[80px] opacity-30 pointer-events-none"></div>
                
                <div className="relative z-10">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-3 animate-bounce">🎉</div>
                        <h2 className="text-2xl font-bold text-emerald-400">Đặt vé thành công!</h2>
                        <p className="text-gray-300 text-sm mt-2">Mã đơn: <span className="text-white font-bold text-base">#{order.id}</span></p>
                    </div>

                    {/* Thông tin phim */}
                    {showtime && (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 space-y-3">
                            <h3 className="font-bold text-[#7c4dff] text-lg leading-tight">{showtime.movieTitle}</h3>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Phòng chiếu</span>
                                <span className="font-medium text-gray-200">{showtime.roomName}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Ngày chiếu</span>
                                <span className="font-medium text-gray-200">{showtime.showDate}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Giờ chiếu</span>
                                <span className="font-medium text-gray-200">{showtime.showTime}</span>
                            </div>
                        </div>
                    )}

                    {/* Ghế đã đặt */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                        <p className="text-gray-400 text-sm mb-2">Ghế đã chọn</p>
                        <div className="flex flex-wrap gap-2">
                            {order.orderDetails?.map((d: any) => (
                                <span key={d.id} className="bg-[#7c4dff] text-white text-xs px-3 py-1.5 rounded-md font-bold shadow-md border border-white/10">
                                    {d.seatCode}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Tổng tiền */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Ngày đặt</span>
                            <span className="text-gray-300">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                            <span className="text-gray-300">Tổng tiền</span>
                            <span className="text-emerald-400 text-xl">
                                {order.totalAmount?.toLocaleString("vi-VN")}đ
                            </span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <Link href="/" className="flex-1 text-center py-3 rounded-xl border border-white/20 text-sm hover:bg-white/10 text-white font-medium transition">
                            Về trang chủ
                        </Link>
                        <Link href="/lich-su-dat-ve" className="flex-1 text-center py-3 rounded-xl shadow-[0_4px_15px_rgba(124,77,255,0.4)] bg-[#7c4dff] text-sm font-bold text-white hover:bg-[#651fff] transition">
                            Lịch sử vé
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
