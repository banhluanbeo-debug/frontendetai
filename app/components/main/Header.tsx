"use client";
import React, { useState } from 'react';
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
        <nav className="bg-red-700 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                {/* TOP */}
                <div className="flex justify-between items-center py-3 border-b border-red-600">
                    <Link href="/">
                        <h1 className="text-2xl font-bold cursor-pointer hover:text-yellow-300 transition">
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
                                className="w-full px-4 py-2 rounded-lg bg-white text-gray-800 border border-red-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                                🔍
                            </button>
                        </form>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/dat-ve"
                            className="bg-yellow-500 text-red-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition text-sm"
                        >
                            ĐẶT VÉ NGAY
                        </Link>
                        <button className="border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-red-700 text-sm">
                            ĐĂNG NHẬP
                        </button>
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
                            className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-2xl min-w-max z-50 transition-all duration-300 ${isTheaterOpen
                                ? 'opacity-100 visible translate-y-0'
                                : 'opacity-0 invisible -translate-y-2'
                                }`}
                        >
                            <div className="grid grid-cols-2 gap-2 p-4">
                                {theaters.map((theater) => (
                                    <Link
                                        key={theater.id}
                                        href={`/rap/${theater.id}`}
                                        className="block px-5 py-3 hover:bg-red-50 cursor-pointer rounded-lg transition-colors min-w-[220px]"
                                    >
                                        <div className="font-semibold text-gray-800 text-sm hover:text-red-600 transition">
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