"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("https://backendemo-cbwy.onrender.com/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error("Đăng nhập thất bại");

            const user = await res.json();

            // Kiểm tra phải là ADMIN mới vào được
            if (user.role !== "ADMIN") {
                setError("Tài khoản này không có quyền truy cập Admin!");
                setLoading(false);
                return;
            }

            // Lưu vào localStorage riêng cho admin (không đụng tới 'user' của người dùng thường)
            localStorage.setItem("adminUser", JSON.stringify(user));

            // Lưu cookie riêng cho admin để middleware đọc được (tồn tại 1 ngày)
            document.cookie = "adminLoggedIn=true; path=/; max-age=86400";

            // Redirect vào Admin Dashboard
            router.replace("/admin");
        } catch (err) {
            setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-10">
                {/* Logo / Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-xl mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
                    <p className="text-gray-400 mt-1 text-sm">Đăng nhập để quản lý hệ thống</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm px-4 py-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-gray-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-gray-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 mt-2"
                    >
                        {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
                    </button>
                </form>
            </div>
        </div>
    );
}
