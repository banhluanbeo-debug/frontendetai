"use client";
import React, { useState } from "react";
import { login } from "@/app/components/services/auth.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GOOGLE_CLIENT_ID } from "@/app/config/google";
import { useEffect } from "react";
export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [googleReady, setGoogleReady] = useState(false);
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        console.log("🔄 Bắt đầu gọi API đăng nhập cho email:", email);

        try {
            const user = await login({ email, password });
            console.log("✅ Đăng nhập thành công! Thông tin user:", user);
            localStorage.setItem("user", JSON.stringify(user));
            alert("Đăng nhập thành công!");
            router.push("/");
        } catch (err) {
            console.error("❌ Lỗi khi đăng nhập:", err);
            setError("Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.");
        } finally {
            console.log("⏹️ Hoàn tất quá trình xử lý form đăng nhập.");
            setLoading(false);
        }
    };
    const handleGoogleCallback = async (response: any) => {
        console.log("Google credential:", response.credential);

        try {
            // gửi token về backend
            const res = await fetch("https://backendemo-cbwy.onrender.com/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: response.credential,
                }),
            });

            if (!res.ok) throw new Error("Google login failed");

            const data = await res.json();
            console.log("Login Google success:", data);
            localStorage.setItem("user", JSON.stringify(data));
            router.push("/");
        } catch (err) {
            console.error(err);
            setError("Đăng nhập Google thất bại");
        }
    };
    const handleGoogleLogin = () => {
        if (!googleReady || !window.google) return;

        window.google.accounts.id.prompt();
    };
    useEffect(() => {
        const initGoogle = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleCallback,
                    use_fedcm_for_prompt: false,
                });

                // ✅ render button Google vào div
                window.google.accounts.id.renderButton(
                    document.getElementById("googleBtn"),
                    { theme: "outline", size: "large", width: "400" }
                );

                setGoogleReady(true);
            } else {
                setTimeout(initGoogle, 100);
            }
        };

        initGoogle();
    }, []);
    return (
        <div className="min-h-screen bg-transparent text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-[#1a237e]/40 backdrop-blur-md border border-white/10 p-10 rounded-2xl shadow-2xl relative overflow-hidden">
                {/* Decorative glowing orb */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#7c4dff] rounded-full blur-[80px] opacity-30 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">ĐĂNG NHẬP</h2>
                        <p className="text-gray-300">Chào mừng bạn trở lại LUNCINEMAS</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm text-center backdrop-blur-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="Nhập địa chỉ email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:border-[#7c4dff] focus:ring-1 focus:ring-[#7c4dff] placeholder-white/30 transition backdrop-blur-sm"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-300">Mật khẩu</label>
                                    <Link href="/forgot-password" className="text-xs text-[#7c4dff] hover:text-[#651fff] transition">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    required
                                    placeholder="Nhập mật khẩu..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:border-[#7c4dff] focus:ring-1 focus:ring-[#7c4dff] placeholder-white/30 transition backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_4px_15px_rgba(124,77,255,0.4)] text-base font-bold text-white bg-[#7c4dff] hover:bg-[#651fff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7c4dff] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
                            >
                                {loading ? "Đang xử lý..." : "ĐĂNG NHẬP"}
                            </button>
                        </div>
                    </form>
                    <div id="googleBtn" className="mt-4 flex justify-center"></div>
                    <div className="mt-8 text-center text-sm text-gray-400">
                        Chưa có tài khoản?{" "}
                        <Link href="/register" className="font-semibold text-[#7c4dff] hover:text-[#651fff] transition">
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
