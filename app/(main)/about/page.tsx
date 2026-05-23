"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const GioiThieuPage = () => {
    const stats = [
        { number: "15+", label: "Năm kinh nghiệm", icon: "🎬" },
        { number: "20+", label: "Rạp chiếu phim", icon: "🏢" },
        { number: "200+", label: "Phòng chiếu", icon: "🎥" },
        { number: "5M+", label: "Khách hàng", icon: "👥" },
        { number: "50+", label: "Đối tác", icon: "🤝" },
        { number: "1000+", label: "Nhân viên", icon: "⭐" }
    ];

    const values = [
        {
            title: "Chất lượng hàng đầu",
            desc: "Trang bị hệ thống âm thanh Dolby Atmos và màn hình IMAX hiện đại nhất",
            icon: "🏆"
        },
        {
            title: "Trải nghiệm đẳng cấp",
            desc: "Ghế ngồi êm ái, không gian sang trọng, phục vụ chuyên nghiệp",
            icon: "✨"
        },
        {
            title: "Giá cả hợp lý",
            desc: "Nhiều ưu đãi hấp dẫn cho học sinh, sinh viên và thành viên VIP",
            icon: "💰"
        },
        {
            title: "An toàn tuyệt đối",
            desc: "Đảm bảo an toàn phòng cháy chữa cháy và vệ sinh môi trường",
            icon: "🛡️"
        }
    ];

    const milestones = [
        { year: "2009", event: "Thành lập rạp đầu tiên tại Quận 1, TP.HCM" },
        { year: "2012", event: "Mở rộng hệ thống lên 5 rạp tại TP.HCM" },
        { year: "2015", event: "Ra mắt hệ thống IMAX đầu tiên tại Việt Nam" },
        { year: "2018", event: "Giới thiệu ghế C'MÊ - Giường nằm xem phim" },
        { year: "2020", event: "Ra mắt ứng dụng đặt vé trực tuyến" },
        { year: "2024", event: "Đạt 20+ rạp trên toàn quốc" }
    ];

    const theaters = [
        { name: "Luncinemas Hai Bà Trưng", address: "52 Nguyễn Trãi, Q.1, TP.HCM", screens: 8, seats: 1200 },
        { name: "Luncinemas Quốc Thanh", address: "12 Quốc Thanh, Q.1, TP.HCM", screens: 6, seats: 900 },
        { name: "Luncinemas Sinh Viên", address: "234 Lê Duẩn, Q.1, TP.HCM", screens: 5, seats: 750 },
        { name: "Luncinemas Cộng Hòa", address: "123 Cộng Hòa, Q.Tân Bình, TP.HCM", screens: 7, seats: 1050 },
        { name: "Luncinemas Phạm Hùng", address: "456 Phạm Hùng, Q.8, TP.HCM", screens: 5, seats: 800 }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[500px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 to-red-700/90 z-10"></div>
                <img
                    src="https://picsum.photos/id/20/1920/600"
                    alt="Cinema"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
                    <div className="max-w-4xl px-4">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
                            LUNCINEMAS
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8">
                            Nơi điện ảnh thăng hoa - Trải nghiệm đẳng cấp
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/lich-chieu"
                                className="bg-yellow-500 text-red-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition transform hover:scale-105"
                            >
                                XEM LỊCH CHIẾU
                            </Link>
                            <Link
                                href="/khuyen-mai"
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-red-700 transition"
                            >
                                ƯU ĐÃI HÔM NAY
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="text-5xl mb-3 transform group-hover:scale-110 transition">{stat.icon}</div>
                                <div className="text-3xl font-bold text-red-600 mb-1">{stat.number}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-800 mb-6 border-l-8 border-red-600 pl-4">
                                VỀ CHÚNG TÔI
                            </h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Luncinemas là hệ thống rạp chiếu phim hàng đầu Việt Nam, thành lập từ năm 2009
                                với sứ mệnh mang đến những trải nghiệm điện ảnh tuyệt vời nhất cho khán giả.
                            </p>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Với hơn 15 năm kinh nghiệm, chúng tôi tự hào là đơn vị tiên phong trong việc
                                ứng dụng công nghệ chiếu phim hiện đại bậc nhất thế giới như IMAX, Dolby Atmos,
                                và ScreenX, mang đến chất lượng hình ảnh và âm thanh sống động như thật.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Không chỉ là nơi xem phim, Luncinemas còn là điểm đến giải trí đa năng với các
                                dịch vụ Kidzone, Bowling, Billiards, Gym, mang đến những giây phút thư giãn trọn vẹn.
                            </p>
                        </div>
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://picsum.photos/id/26/600/400"
                                alt="Cinema interior"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
                        GIÁ TRỊ CỐT LÕI
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-2xl transition group">
                                <div className="text-5xl mb-4 group-hover:scale-110 transition">{value.icon}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                                <p className="text-gray-600 text-sm">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Milestones Section */}
            <section className="py-20 bg-gradient-to-r from-red-700 to-red-900 text-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">
                        HÀNH TRÌNH PHÁT TRIỂN
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {milestones.map((item, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition">
                                <div className="text-3xl font-bold text-yellow-400 mb-2">{item.year}</div>
                                <p className="text-white/90">{item.event}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Theaters Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
                        HỆ THỐNG RẠP
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {theaters.map((theater, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition group">
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="text-3xl">🏢</span>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-red-600 transition">
                                            {theater.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">{theater.address}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-500">🎬</span>
                                        <span className="text-sm text-gray-600">{theater.screens} phòng chiếu</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-500">💺</span>
                                        <span className="text-sm text-gray-600">{theater.seats} ghế</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-red-600 to-red-800">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        SẴN SÀNG TRẢI NGHIỆM?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Đặt vé ngay hôm nay để nhận nhiều ưu đãi hấp dẫn
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link
                            href="/lich-chieu"
                            className="bg-yellow-500 text-red-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition transform hover:scale-105"
                        >
                            ĐẶT VÉ NGAY
                        </Link>
                        <Link
                            href="/khuyen-mai"
                            className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-red-700 transition"
                        >
                            XEM ƯU ĐÃI
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer Note */}
            <div className="bg-gray-900 text-white py-8 text-center">
                <div className="container mx-auto px-4">
                    <p className="text-gray-400 text-sm">
                        © 2024 Luncinemas. Điện ảnh thăng hoa - Trải nghiệm đẳng cấp.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GioiThieuPage;