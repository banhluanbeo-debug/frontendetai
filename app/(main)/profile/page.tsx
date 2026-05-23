"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [phone, setPhone] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const parsedUser = JSON.parse(stored);
            setUser(parsedUser);
            if (parsedUser.phone) {
                setPhone(parsedUser.phone);
            }
        } else {
            router.push("/auth/login");
        }
    }, [router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Ở đây giả lập việc call API update profile
        // Khi có API thật thì thay thế đoạn này
        setTimeout(() => {
            const updatedUser = { ...user, phone };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsSaving(false);
            alert("Cập nhật thông tin thành công!");
        }, 1000);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-transparent text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8 border-l-4 border-[#7c4dff] pl-4">
                    Thông Tin Cá Nhân
                </h1>

                <div className="bg-[#1a237e]/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                    {/* Decorative glowing orb */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#7c4dff] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

                    <form onSubmit={handleSave} className="relative z-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tên */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Họ và tên</label>
                                <input
                                    type="text"
                                    value={user.name || ""}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-gray-400 border border-white/10 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">Tên không thể thay đổi</p>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={user.email || ""}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-gray-400 border border-white/10 cursor-not-allowed"
                                />
                            </div>

                            {/* Số điện thoại */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Số điện thoại</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Nhập số điện thoại của bạn..."
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-[#7c4dff] focus:ring-1 focus:ring-[#7c4dff] placeholder-white/30 transition backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving || phone === (user.phone || "")}
                                className="px-8 py-3 border border-transparent rounded-xl shadow-[0_4px_15px_rgba(124,77,255,0.4)] text-base font-bold text-white bg-[#7c4dff] hover:bg-[#651fff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7c4dff] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {isSaving ? "Đang lưu..." : "LƯU THAY ĐỔI"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
