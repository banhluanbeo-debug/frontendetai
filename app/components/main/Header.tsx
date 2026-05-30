"use client";
import React, { useState, useEffect, useRef } from 'react';
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
    const [user, setUser] = useState<any>(null);
    const [isUserOpen, setIsUserOpen] = useState(false);
    
    // State cho dropdown Lịch chiếu
    const [isLichChieuOpen, setIsLichChieuOpen] = useState(false);
    const [hoveredTimeGroup, setHoveredTimeGroup] = useState<string | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const timeGroups = {
        'Sáng': ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
        'Chiều': ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
        'Tối': ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00']
    };

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
    }, []);

    // Danh sách rạp đã được chuyển sang nơi khác

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

                                <div className={`absolute right-0 top-full mt-2 w-56 bg-[#1a237e]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl z-50 transition-all duration-300 ${isUserOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
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
                    {/* LỊCH CHIẾU DROPDOWN */}
                    <div 
                        className="relative"
                        onMouseEnter={() => {
                            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                            // Mở dropdown khi hover thay vì chỉ click
                            setIsLichChieuOpen(true);
                        }}
                        onMouseLeave={() => {
                            hoverTimeoutRef.current = setTimeout(() => {
                                setIsLichChieuOpen(false);
                                setHoveredTimeGroup(null);
                            }, 400); // Trì hoãn 400ms để người dùng kịp rê chuột
                        }}
                    >
                        <button 
                            onClick={() => setIsLichChieuOpen(!isLichChieuOpen)}
                            className="hover:text-yellow-300 flex items-center gap-1 transition h-full"
                        >
                            Lịch chiếu
                            <svg className={`w-4 h-4 transition-transform ${isLichChieuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div
                            className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 transition-all duration-300 ${isLichChieuOpen
                                ? 'opacity-100 visible translate-y-0'
                                : 'opacity-0 invisible -translate-y-2'
                                }`}
                        >
                            <div className="flex p-2 relative">
                                {/* Cột menu Sáng, Chiều, Tối */}
                                <div className="flex flex-col min-w-[120px] border-r border-white/10">
                                    {(Object.keys(timeGroups) as Array<keyof typeof timeGroups>).map((group) => (
                                        <div
                                            key={group}
                                            onMouseEnter={() => setHoveredTimeGroup(group)}
                                            className={`px-4 py-3 cursor-pointer rounded-lg transition-colors text-white font-semibold flex justify-between items-center ${hoveredTimeGroup === group ? 'bg-white/10 text-yellow-300' : 'hover:bg-white/5'}`}
                                        >
                                            {group}
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    ))}
                                </div>

                                {/* Bảng ma trận giờ chiếu (max 4 số 1 hàng) hiển thị khi hover */}
                                {hoveredTimeGroup && (
                                    <div className="absolute left-full top-0 ml-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl p-4 min-w-[320px]">
                                        <h3 className="text-yellow-300 font-bold mb-3 border-b border-white/10 pb-2">Buổi {hoveredTimeGroup}</h3>
                                        <div className="grid grid-cols-4 gap-2">
                                            {timeGroups[hoveredTimeGroup as keyof typeof timeGroups].map((time) => (
                                                <Link 
                                                    key={time} 
                                                    href={`/showtimes?time=${time}`}
                                                    className="bg-white/5 hover:bg-[#7c4dff] border border-white/10 rounded-md py-2 px-1 text-center text-sm font-semibold text-white transition-colors cursor-pointer"
                                                >
                                                    {time}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <Link href="/promotion" className="hover:text-yellow-300 transition">Khuyến mãi</Link>
                    <Link href="/dich-vu-giai-tri" className="hover:text-yellow-300 transition">Dịch vụ giải trí khác</Link>
                    <Link href="/about" className="hover:text-yellow-300 transition">Giới thiệu</Link>
                </div>
            </div>
        </nav>
    );
};

export default Header;