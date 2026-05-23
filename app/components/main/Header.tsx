"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";

interface HeaderProps {
    onSearch?: (searchTerm: string) => void;
}

interface Theater {
    id: number;
    name: string;
    address: string;
    district: string;
    city: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isTheaterOpen, setIsTheaterOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isUserOpen, setIsUserOpen] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
    }, []);

    // Danh sách rạp
    const theaters: Theater[] = [
        { id: 1, name: "Luncinemas Hai Bà Trưng", address: "52 Nguyễn Trãi", district: "Quận 1", city: "TP.HCM" },
        { id: 2, name: "Luncinemas Quốc Thanh", address: "12 Quốc Thanh", district: "Quận 1", city: "TP.HCM" },
        { id: 3, name: "Luncinemas Sinh Viên", address: "234 Lê Duẩn", district: "Quận 1", city: "TP.HCM" },
        { id: 4, name: "Luncinemas Cộng Hòa", address: "123 Cộng Hòa", district: "Quận Tân Bình", city: "TP.HCM" },
        { id: 5, name: "Luncinemas Phạm Hùng", address: "456 Phạm Hùng", district: "Quận 8", city: "TP.HCM" },
        { id: 6, name: "Luncinemas Lê Văn Việt", address: "789 Lê Văn Việt", district: "Quận 9", city: "TP.HCM" },
    ];

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSearch) onSearch(searchTerm);
    };

    return (
        <nav className="bg-[#0b1a3a]/95 backdrop-blur-md text-white shadow-lg sticky top-0 z-50 border-b border-[#3b3f8c]">
            <div className="container mx-auto px-4">
                {/* TOP */}
                <div className="flex justify-between items-center py-3 border-b border-[#3b3f8c]/50">
                    <Link href="/">
                        <h1 className="text-2xl font-black cursor-pointer text-white hover:text-yellow-300 transition tracking-wider drop-shadow-md">
                            LUNCINEMAS
                        </h1>
                    </Link>
                    {/* SEARCH */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                placeholder="Tìm phim, rạp..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 placeholder-white/60 transition backdrop-blur-sm"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-yellow-300 transition">
                                🔍
                            </button>
                        </form>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center space-x-3">
                        {user ? (
                            <div
                                className="relative"
                                onMouseEnter={() => setIsUserOpen(true)}
                                onMouseLeave={() => setIsUserOpen(false)}
                            >
                                <button className="flex items-center gap-2 text-sm text-[#7c4dff] font-bold">
                                    👤 {user.name}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <div className={`absolute right-0 top-full mt-2 w-56 bg-[#1a237e]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl z-50 transition-all duration-300 ${
                                    isUserOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                                }`}>
                                    {/* Thông tin cơ bản */}
                                    <div className="px-4 py-3 border-b border-white/10">
                                        <p className="text-white font-semibold text-sm">{user.name}</p>
                                        <p className="text-gray-300 text-xs mt-1">{user.email}</p>
                                    </div>

                                    {/* Menu items */}
                                    <div className="py-2">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 text-sm text-gray-200 hover:text-white transition"
                                        >
                                            👤 Thông tin cá nhân
                                        </Link>
                                        <Link
                                            href="/lich-su-dat-ve"
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 text-sm text-gray-200 hover:text-white transition"
                                        >
                                            🎬 Lịch sử đặt vé
                                        </Link>
                                    </div>

                                    {/* Đăng xuất */}
                                    <div className="border-t border-white/10 py-2">
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem("user");
                                                setUser(null);
                                            }}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-red-500/20 text-sm text-red-400 hover:text-red-300 transition w-full text-left font-bold"
                                        >
                                            🚪 Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/auth/register"
                                    className="border border-white/30 px-5 py-2 rounded-lg hover:bg-white/20 text-white transition text-sm font-medium inline-block"
                                >
                                    ĐĂNG KÝ
                                </Link>
                                <Link href="/auth/login">
                                    <button className="border border-white/30 px-5 py-2 rounded-lg hover:bg-white/20 text-white transition text-sm font-medium">
                                        ĐĂNG NHẬP
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* MENU */}
                <div className="hidden md:flex justify-center space-x-8 py-3 text-sm font-medium">
                    {/* DROPDOWN CHỌN RẠP - KHÔNG CÓ TOOLTIP */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsTheaterOpen(true)}
                        onMouseLeave={() => setIsTheaterOpen(false)}
                    >
                        <button className="hover:text-yellow-300 flex items-center gap-1 transition">
                            Chọn rạp
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown - Click vào là chuyển trang, không có tooltip */}
                        <div
                            className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl min-w-max z-50 transition-all duration-300 ${isTheaterOpen
                                ? 'opacity-100 visible translate-y-0'
                                : 'opacity-0 invisible -translate-y-2'
                                }`}
                        >
                            <div className="grid grid-cols-2 gap-2 p-4">
                                {theaters.map((theater) => (
                                    <Link
                                        key={theater.id}
                                        href={`/rap/${theater.id}`}
                                        className="block px-5 py-3 hover:bg-white/5 cursor-pointer rounded-lg transition-colors min-w-[220px]"
                                    >
                                        <div className="font-semibold text-white text-sm group-hover:text-[#7c4dff] transition">
                                            {theater.name}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {theater.district}, {theater.city}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Link href="/lich-chieu" className="hover:text-yellow-300 transition">Lịch chiếu</Link>
                    <Link href="/khuyen-mai" className="hover:text-yellow-300 transition">Khuyến mãi</Link>
                    <Link href="/dich-vu-giai-tri" className="hover:text-yellow-300 transition">Dịch vụ giải trí khác</Link>
                    <Link href="/gioi-thieu" className="hover:text-yellow-300 transition">Giới thiệu</Link>
                </div>
            </div>
        </nav>
    );
};

export default Header;