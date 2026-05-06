"use client";
import React, { useState } from 'react';
import Link from 'next/link';

interface Service {
    id: number;
    name: string;
    description: string;
    price: string;
    icon: string;
    images: string[];
    features: string[];
    category: 'cafe' | 'gym' | 'bowling' | 'billiards' | 'kidzone' | 'shopping' | 'spa' | 'karaoke';
    location: string;
    openHours: string;
    hotline: string;
}

const DichVuGiaiTriPage = () => {
    const [selectedService, setSelectedService] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // Dữ liệu dịch vụ
    const services: Service[] = [
        {
            id: 1,
            name: "CAFE CINEMATIC",
            description: "Không gian cafe sang trọng với view nhìn ra phố, thưởng thức đồ uống đặc sắc cùng âm nhạc nhẹ nhàng",
            price: "30.000 - 120.000đ",
            icon: "☕",
            images: ["https://picsum.photos/id/20/400/300", "https://picsum.photos/id/21/400/300"],
            features: ["Free Wifi", "Live nhạc acoustic", "Không gian thoáng mát", "View đẹp"],
            category: 'cafe',
            location: "Tầng 3 - Luncinemas Hai Bà Trưng",
            openHours: "08:00 - 22:00",
            hotline: "1900 1234"
        },
        {
            id: 2,
            name: "BOWLING ALLEY",
            description: "Hệ thống bowling hiện đại với 10 làn chơi chuẩn quốc tế, phù hợp cho nhóm bạn và gia đình",
            price: "80.000 - 150.000đ/game",
            icon: "🎳",
            images: ["https://picsum.photos/id/26/400/300", "https://picsum.photos/id/27/400/300"],
            features: ["Làn bowling cao cấp", "Giày bowling miễn phí", "Tổ chức giải đấu", "Quầy bar"],
            category: 'bowling',
            location: "Tầng 2 - Luncinemas Quốc Thanh",
            openHours: "09:00 - 23:00",
            hotline: "1900 5678"
        },
        {
            id: 3,
            name: "BILLIARDS CLUB",
            description: "Câu lạc bộ Billiards chuyên nghiệp với bàn bida lỗ và bida carom cao cấp",
            price: "50.000 - 100.000đ/giờ",
            icon: "🎱",
            images: ["https://picsum.photos/id/29/400/300", "https://picsum.photos/id/30/400/300"],
            features: ["Bàn thi đấu chuẩn quốc tế", "Cơ bida cao cấp", "Huấn luyện viên", "Giải đấu hàng tuần"],
            category: 'billiards',
            location: "Tầng 1 - Luncinemas Sinh Viên",
            openHours: "10:00 - 23:00",
            hotline: "1900 9101"
        },
        {
            id: 4,
            name: "FITNESS & GYM",
            description: "Phòng gym hiện đại với trang thiết bị nhập khẩu, không gian rộng rãi, huấn luyện viên chuyên nghiệp",
            price: "500.000 - 1.200.000đ/tháng",
            icon: "💪",
            images: ["https://picsum.photos/id/31/400/300", "https://picsum.photos/id/32/400/300"],
            features: ["Máy tập hiện đại", "Yoga & Zumba", "PT cá nhân", "Sauna & Massage"],
            category: 'gym',
            location: "Tầng 4 - Luncinemas Cộng Hòa",
            openHours: "06:00 - 22:00",
            hotline: "1900 1122"
        },
        {
            id: 5,
            name: "KIDZONE PLAYGROUND",
            description: "Khu vui chơi trẻ em với nhiều trò chơi hấp dẫn, an toàn và bổ ích cho bé",
            price: "100.000 - 200.000đ/trẻ",
            icon: "🎮",
            images: ["https://picsum.photos/id/33/400/300", "https://picsum.photos/id/34/400/300"],
            features: ["Khu vực an toàn", "Nhân viên trông trẻ", "Trò chơi giáo dục", "Sinh nhật cho bé"],
            category: 'kidzone',
            location: "Tầng 1 - Luncinemas Hai Bà Trưng",
            openHours: "09:00 - 20:00",
            hotline: "1900 3344"
        },
        {
            id: 6,
            name: "CINEMATIC MALL",
            description: "Khu mua sắm với các thương hiệu thời trang, phụ kiện, đồ lưu niệm điện ảnh độc đáo",
            price: "Đa dạng giá",
            icon: "🛍️",
            images: ["https://picsum.photos/id/35/400/300", "https://picsum.photos/id/36/400/300"],
            features: ["Thương hiệu nổi tiếng", "Đồ lưu niệm phim", "Quà tặng độc quyền", "Giảm giá thành viên"],
            category: 'shopping',
            location: "Tầng 1-2 - Luncinemas Quốc Thanh",
            openHours: "09:00 - 22:00",
            hotline: "1900 5566"
        },
        {
            id: 7,
            name: "LUXURY SPA",
            description: "Thư giãn sau giờ xem phim với dịch vụ massage chuyên nghiệp, xông hơi và chăm sóc da",
            price: "200.000 - 800.000đ",
            icon: "💆",
            images: ["https://picsum.photos/id/37/400/300", "https://picsum.photos/id/38/400/300"],
            features: ["Massage Thái", "Xông hơi", "Chăm sóc da", "Thư giãn cơ thể"],
            category: 'spa',
            location: "Tầng 5 - Luncinemas Cộng Hòa",
            openHours: "10:00 - 22:00",
            hotline: "1900 7788"
        },
        {
            id: 8,
            name: "K-STAR KARAOKE",
            description: "Phòng karaoke sang trọng với hệ thống âm thanh đỉnh cao, ánh sáng lung linh",
            price: "150.000 - 500.000đ/giờ",
            icon: "🎤",
            images: ["https://picsum.photos/id/39/400/300", "https://picsum.photos/id/40/400/300"],
            features: ["Âm thanh cao cấp", "Phòng VIP", "Buffet miễn phí", "Chụp ảnh check-in"],
            category: 'karaoke',
            location: "Tầng 4 - Luncinemas Sinh Viên",
            openHours: "13:00 - 23:00",
            hotline: "1900 9900"
        }
    ];

    const categories = [
        { id: 'all', name: 'TẤT CẢ', icon: '🎯' },
        { id: 'cafe', name: 'CAFE', icon: '☕' },
        { id: 'bowling', name: 'BOWLING', icon: '🎳' },
        { id: 'billiards', name: 'BILLIARDS', icon: '🎱' },
        { id: 'gym', name: 'GYM', icon: '💪' },
        { id: 'kidzone', name: 'KIDZONE', icon: '🎮' },
        { id: 'shopping', name: 'MUA SẮM', icon: '🛍️' },
        { id: 'spa', name: 'SPA', icon: '💆' },
        { id: 'karaoke', name: 'KARAOKE', icon: '🎤' }
    ];

    const filteredServices = activeCategory === 'all'
        ? services
        : services.filter(service => service.category === activeCategory);

    const selectedServiceData = services.find(s => s.id === selectedService);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-red-900/80 z-10"></div>
                <img
                    src="https://picsum.photos/id/25/1920/500"
                    alt="Entertainment"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
                    <div className="max-w-4xl px-4">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                            DỊCH VỤ GIẢI TRÍ KHÁC
                        </h1>
                        <p className="text-xl text-white/90 mb-8">
                            Không chỉ xem phim - Trải nghiệm đa dạng giải trí đỉnh cao
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link
                                href="/lich-chieu"
                                className="bg-yellow-500 text-red-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition"
                            >
                                ĐẶT VÉ PHIM
                            </Link>
                            <Link
                                href="/khuyen-mai"
                                className="border-2 border-white text-white px-6 py-2 rounded-lg font-bold hover:bg-white hover:text-red-900 transition"
                            >
                                XEM ƯU ĐÃI
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Filter */}
            <div className="sticky top-20 z-40 bg-white shadow-md py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-full font-semibold transition flex items-center gap-2 ${activeCategory === cat.id
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredServices.map((service) => (
                        <div
                            key={service.id}
                            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                            onClick={() => setSelectedService(service.id)}
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={service.images[0]}
                                    alt={service.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg">
                                    {service.icon}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition">
                                    {service.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-red-600 font-bold">{service.price}</span>
                                    <span className="text-gray-400 text-xs flex items-center gap-1">
                                        <span>📍</span> {service.location.split(' - ')[0]}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {service.features.slice(0, 2).map((feature, idx) => (
                                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                            {feature}
                                        </span>
                                    ))}
                                    {service.features.length > 2 && (
                                        <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full">
                                            +{service.features.length - 2}
                                        </span>
                                    )}
                                </div>
                                <button className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 text-white py-2 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition">
                                    XEM CHI TIẾT
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredServices.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎯</div>
                        <p className="text-gray-500 text-lg">Chưa có dịch vụ nào trong danh mục này</p>
                    </div>
                )}
            </div>

            {/* Service Detail Modal */}
            {selectedServiceData && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="relative">
                            <img
                                src={selectedServiceData.images[0]}
                                alt={selectedServiceData.name}
                                className="w-full h-64 object-cover rounded-t-2xl"
                            />
                            <button
                                onClick={() => setSelectedService(null)}
                                className="absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition"
                            >
                                ✕
                            </button>
                            <div className="absolute bottom-4 left-4 bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg">
                                {selectedServiceData.icon}
                            </div>
                        </div>

                        <div className="p-6">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedServiceData.name}</h2>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-red-600 font-bold text-xl">{selectedServiceData.price}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-500 flex items-center gap-1">
                                    <span>⏰</span> {selectedServiceData.openHours}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-2 text-lg">📍 Địa điểm</h3>
                                    <p className="text-gray-600">{selectedServiceData.location}</p>
                                    <div className="mt-3">
                                        <h3 className="font-bold text-gray-800 mb-2 text-lg">📞 Liên hệ</h3>
                                        <p className="text-gray-600">{selectedServiceData.hotline}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-2 text-lg">✨ Tiện ích nổi bật</h3>
                                    <ul className="space-y-1">
                                        {selectedServiceData.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-gray-600">
                                                <span className="text-green-500">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-bold text-gray-800 mb-2 text-lg">📝 Mô tả</h3>
                                <p className="text-gray-600 leading-relaxed">{selectedServiceData.description}</p>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition">
                                    ĐẶT LỊCH NGAY
                                </button>
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg font-bold hover:bg-gray-50 transition"
                                >
                                    ĐÓNG
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-red-700 to-red-900 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        KHÔNG CHỈ XEM PHIM - CÒN HƠN THẾ NỮA!
                    </h2>
                    <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                        Trải nghiệm các dịch vụ giải trí đẳng cấp ngay hôm nay
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link
                            href="/dat-ve"
                            className="bg-yellow-500 text-red-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
                        >
                            ĐẶT VÉ PHIM
                        </Link>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-red-700 transition"
                        >
                            XEM DỊCH VỤ
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DichVuGiaiTriPage;