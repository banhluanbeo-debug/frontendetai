"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getVouchersByUser, Voucher } from "@/app/components/services/voucher.service";
import { getActiveFoods, FoodItem } from "@/app/components/services/food.service";
import { SelectedSeat } from "@/app/components/types/booking.type";

export default function FoodAndVoucherPage() {
    const router = useRouter();
    const params = useParams();
    const showtimeId = Number(params.showtimeId);

    const [seats, setSeats] = useState<SelectedSeat[]>([]);
    const [foodMenu, setFoodMenu] = useState<FoodItem[]>([]);
    const [foodQuantities, setFoodQuantities] = useState<{ [key: string]: number }>({});
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [selectedVoucherCode, setSelectedVoucherCode] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedSeats = sessionStorage.getItem("booking_seats");
        if (!storedSeats) {
            router.push(`/booking/${showtimeId}`);
            return;
        }
        setSeats(JSON.parse(storedSeats));

        // Lấy danh sách đồ ăn đang bán
        getActiveFoods().then(data => {
            setFoodMenu(data);
            setLoading(false);
        }).catch(() => setLoading(false));

        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            getVouchersByUser(user.id).then(setVouchers);
        } else {
            router.push("/auth/login");
        }
    }, [showtimeId, router]);

    const handleQuantityChange = (id: string, delta: number) => {
        setFoodQuantities(prev => {
            const current = prev[id] || 0;
            const next = Math.max(0, current + delta);
            return { ...prev, [id]: next };
        });
    };

    const ticketTotal = seats.reduce((acc, s) => acc + s.price, 0);

    const foodTotal = foodMenu.reduce((acc, item) => {
        return acc + (item.price * (foodQuantities[item.id] || 0));
    }, 0);

    const selectedVoucher = vouchers.find(v => v.code === selectedVoucherCode);
    const maxDiscount = selectedVoucher ? selectedVoucher.discountAmount : 0;

    // Voucher chỉ giảm phần đồ ăn, tối đa bằng tổng tiền đồ ăn
    const appliedDiscount = Math.min(foodTotal, maxDiscount);

    const grandTotal = ticketTotal + foodTotal - appliedDiscount;

    const handlePay = async (method: "vnpay" | "cash") => {
        if (isProcessing) return;
        setIsProcessing(true);

        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const user = JSON.parse(userStr);

        const foodItems = foodMenu
            .filter(item => foodQuantities[item.id] > 0)
            .map(item => ({
                name: item.name,
                price: item.price,
                quantity: foodQuantities[item.id]
            }));

        try {
            const res = await fetch("https://backendemo-cbwy.onrender.com/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    showtimeId,
                    seatIds: seats.map(s => s.id),
                    paymentMethod: method === "vnpay" ? "VNPAY" : "CASH",
                    foodItems: foodItems.length > 0 ? foodItems : null,
                    voucherCode: appliedDiscount > 0 ? selectedVoucherCode : null,
                    foodTotal,
                    discountAmount: appliedDiscount
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                throw new Error(errData?.message || "Đặt vé thất bại");
            }
            const order = await res.json();

            if (method === "vnpay") {
                const payRes = await fetch(
                    `https://backendemo-cbwy.onrender.com/api/payment/payment-web?amount=${grandTotal}&orderId=${order.id}`
                );
                const { url } = await payRes.json();
                window.location.href = url;
            } else {
                await fetch(`https://backendemo-cbwy.onrender.com/api/orders/${order.id}/confirm`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id }),
                });
                // Dọn dẹp session
                sessionStorage.removeItem("booking_seats");
                router.push("/payment-success");
            }
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Bắp Nước & Thanh Toán</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Cột trái: Đồ ăn & Voucher */}
                <div className="space-y-8">
                    {/* Đồ ăn */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4">🍿 Chọn đồ ăn / nước uống</h2>
                        {loading ? (
                            <p className="text-gray-500 italic">Đang tải danh sách đồ ăn...</p>
                        ) : foodMenu.length === 0 ? (
                            <p className="text-gray-500 italic">Hiện không có đồ ăn/thức uống nào đang bán.</p>
                        ) : (
                            <div className="space-y-4">
                                {foodMenu.map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                                        <div className="flex gap-4 items-center">
                                            {item.imageUrl && (
                                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-800">{item.name}</p>
                                                {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                                                <p className="text-sm font-semibold text-blue-600 mt-1">{item.price.toLocaleString()} đ</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1 shrink-0">
                                            <button
                                                onClick={() => handleQuantityChange(item.id.toString(), -1)}
                                                className="w-8 h-8 rounded-md bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center font-bold text-gray-600"
                                            >
                                                -
                                            </button>
                                            <span className="w-4 text-center font-medium">{foodQuantities[item.id] || 0}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id.toString(), 1)}
                                                className="w-8 h-8 rounded-md bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center font-bold text-gray-600"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Voucher */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4">🎟️ Voucher của bạn</h2>
                        {vouchers.length === 0 ? (
                            <p className="text-gray-500 italic text-sm">Bạn chưa có voucher nào khả dụng.</p>
                        ) : (
                            <div className="space-y-3">
                                {vouchers.map(v => {
                                    const isSelected = selectedVoucherCode === v.code;
                                    return (
                                        <label
                                            key={v.id}
                                            className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="voucher"
                                                className="mt-1 w-4 h-4 text-blue-600"
                                                checked={isSelected}
                                                onChange={() => setSelectedVoucherCode(v.code)}
                                            />
                                            <div>
                                                <p className="font-bold text-gray-800">{v.code}</p>
                                                <p className="text-sm text-gray-600">Giảm {v.discountAmount.toLocaleString()} đ cho đồ ăn/thức uống</p>
                                            </div>
                                        </label>
                                    );
                                })}
                                {selectedVoucherCode && (
                                    <button
                                        onClick={() => setSelectedVoucherCode(null)}
                                        className="text-sm text-red-500 hover:underline mt-2 block"
                                    >
                                        Bỏ chọn voucher
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Cột phải: Hóa đơn & Thanh toán */}
                <div>
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 sticky top-8">
                        <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>

                        <div className="space-y-3 text-gray-700 mb-6">
                            <div className="flex justify-between">
                                <span>Tiền vé ({seats.length} ghế)</span>
                                <span className="font-medium">{ticketTotal.toLocaleString()} ₫</span>
                            </div>

                            {foodMenu.filter(item => foodQuantities[item.id] > 0).map(item => (
                                <div key={item.id} className="flex justify-between">
                                    <span className="text-gray-600">{item.name} <span className="text-xs">x{foodQuantities[item.id]}</span></span>
                                    <span className="font-medium">{(item.price * foodQuantities[item.id]).toLocaleString()} ₫</span>
                                </div>
                            ))}

                            {appliedDiscount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Voucher giảm giá</span>
                                    <span className="font-medium">-{appliedDiscount.toLocaleString()} ₫</span>
                                </div>
                            )}

                            {selectedVoucherCode && foodTotal < maxDiscount && (
                                <p className="text-xs text-orange-500 italic mt-1">
                                    * Voucher chỉ áp dụng cho đồ ăn và không hoàn tiền thừa
                                </p>
                            )}
                        </div>

                        <div className="border-t pt-4 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold">Tổng cộng</span>
                                <span className="text-3xl font-bold text-blue-600">{grandTotal.toLocaleString()} ₫</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => handlePay("vnpay")}
                                disabled={isProcessing}
                                className="w-full bg-[#005BAA] text-white rounded-xl py-3.5 font-bold text-lg hover:bg-[#004a8a] transition shadow-md disabled:opacity-50"
                            >
                                💳 Thanh toán VNPay
                            </button>
                            <button
                                onClick={() => handlePay("cash")}
                                disabled={isProcessing}
                                className="w-full bg-emerald-500 text-white rounded-xl py-3.5 font-bold text-lg hover:bg-emerald-600 transition shadow-md disabled:opacity-50"
                            >
                                💵 Thanh toán tiền mặt
                            </button>
                            <button
                                onClick={() => router.back()}
                                disabled={isProcessing}
                                className="w-full text-gray-500 font-medium py-2 hover:text-gray-800 transition disabled:opacity-50"
                            >
                                Quay lại chọn ghế
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
