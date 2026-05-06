"use client";
import React, { useState } from 'react';
import Link from 'next/link';

interface Promotion {
    id: number;
    title: string;
    subtitle: string;
    price: string;
    conditions: string[];
    notes: string[];
    type: 'student' | 'happy-hour' | 'happy-day' | 'member';
    image?: string;
}

const KhuyenMaiPage = () => {
    const [activeTab, setActiveTab] = useState<'promotions' | 'vip' | 'children'>('promotions');

    // Dữ liệu khuyến mãi
    const promotions: Promotion[] = [
        {
            id: 1,
            title: "ƯU ĐÃI GIÁ VÉ TỪ 45K",
            subtitle: "DÀNH RIÊNG CHO HSSV",
            price: "Từ 45.000đ",
            conditions: [
                "Giá vé ưu đãi 45.000đ/ vé 2D áp dụng vào: Thứ 2 và các suất chiếu trước 10h00",
                "Giá vé ưu đãi 49.000đ/ vé 2D áp dụng tất cả các suất chiếu còn lại",
                "Giá vé ưu đãi 55.000đ/ vé 3D áp dụng tất cả các suất chiếu trước 10h00 và sau 22h00",
                "Giá vé ưu đãi 95.000đ/ C'MÊ (giường nằm) áp dụng vào: thứ 2 và các suất chiếu trước 10h00",
                "Giá vé ưu đãi 99.000đ/ C'MÊ (giường nằm) áp dụng vào: thứ 3, 4, 5 tại Cinestar Quốc Thanh, Cinestar Satra Quận 6"
            ],
            notes: [
                "Khách hàng là Học sinh Sinh viên đang mặc đồng phục hoặc xuất trình thẻ HSSV",
                "Khách hàng từ 22 tuổi trở xuống xuất trình Căn cước/ VNeID",
                "Khách hàng là giáo viên xuất trình chứng chỉ sư phạm, thẻ giáo viên",
                "Mỗi thẻ HSSV chỉ mua được 01 vé trên 01 suất chiếu",
                "Không áp dụng vào các ngày Lễ, Tết"
            ],
            type: 'student'
        },
        {
            id: 2,
            title: "HAPPY HOUR",
            subtitle: "TRƯỚC 10H VÀ SAU 22H – GIÁ VÉ ƯU ĐÃI CHỈ TỪ 45K",
            price: "Từ 45.000đ",
            conditions: [
                "Giá vé ưu đãi 45.000đ/ vé 2D: tất cả các suất chiếu trước 10h00",
                "Giá vé ưu đãi 49.000đ/ vé 2D: tất cả các suất chiếu sau 22h00",
                "Giá vé ưu đãi 55.000đ/ vé 3D: tất cả các suất chiếu trước 10h00 và sau 22h00",
                "Giá vé ưu đãi 95.000đ/ C'MÊ: suất chiếu trước 10h00 áp dụng vào thứ 3,4,5",
                "Giá vé ưu đãi 99.000đ/ C'MÊ: suất chiếu sau 22h00 áp dụng vào thứ 3,4,5"
            ],
            notes: [
                "Khách hàng có thể mua trực tiếp tại rạp, app/web Cinestar",
                "Không áp dụng cho các ngày Lễ / Tết"
            ],
            type: 'happy-hour'
        },
        {
            id: 3,
            title: "HAPPY DAY | THỨ 2",
            subtitle: "ĐỒNG GIÁ 45K CHO MỌI SUẤT CHIẾU",
            price: "45.000đ",
            conditions: [
                "Đồng giá 45.000đ / vé 2D",
                "Đồng giá 55.000đ/ vé 3D",
                "Đồng giá 95.000đ/ vé C'MÊ (giường nằm)"
            ],
            notes: [
                "Khách hàng có thể mua trực tiếp tại rạp, app/web Cinestar",
                "Không áp dụng vào các ngày Lễ, Tết hoặc các suất chiếu đặc biệt"
            ],
            type: 'happy-day'
        },
        {
            id: 4,
            title: "HAPPY DAY | THỨ 4",
            subtitle: "ĐỒNG GIÁ 45K DÀNH CHO THÀNH VIÊN CINESTAR",
            price: "45.000đ",
            conditions: [
                "Đồng giá 45.000đ / vé 2D",
                "Đồng giá 55.000đ/ vé 3D",
                "Đồng giá 95.000đ/ vé C'MÊ (giường nằm)",
                "Giảm 15% cho thành viên C'VIP và 10% cho thành viên C'FRIEND"
            ],
            notes: [
                "Khách hàng thành viên cần xuất trình thẻ thành viên hoặc số điện thoại",
                "Mỗi thẻ thành viên có thể mua nhiều hơn 01 vé",
                "Không áp dụng vào các ngày Lễ, Tết"
            ],
            type: 'member'
        }
    ];

    // Dữ liệu thẻ VIP
    // Dữ liệu thẻ VIP - Đã cập nhật
    const vipTiers = [
        {
            level: "C'FRIEND",
            minSpend: "Dưới 10 triệu/năm",
            benefits: [
                "Tích lũy điểm đổi vé miễn phí",
                "Giảm 10% giá vé các ngày trong tuần",
                "Giảm 10% combo bắp nước",
                "Giảm 10% giá vé C'MÊ (giường nằm)",
                "Nhận ưu đãi sinh nhật",
                "Ưu tiên chọn ghế thường"
            ],
            bgColor: "from-blue-50 to-blue-100",
            textColor: "text-blue-800",
            buttonColor: "bg-blue-600",
            seats: ["Ghế thường", "Ghế VIP", "C'MÊ (giảm 10%)"]
        },
        {
            level: "C'VIP",
            minSpend: "Trên 10 triệu/năm",
            benefits: [
                "Tích lũy điểm đổi vé miễn phí (tỷ lệ cao hơn)",
                "Giảm 15% giá vé tất cả các suất",
                "Giảm 15% combo bắp nước",
                "Giảm 20% giá vé C'MÊ (giường nằm)",
                "Nhận 01 vé C'MÊ miễn phí vào tháng sinh nhật",
                "Ưu tiên chọn ghế đẹp nhất (bao gồm C'MÊ)",
                "Mời 01 bạn đồng hành giảm 10%",
                "Không giới hạn số lượng vé mua mỗi suất"
            ],
            bgColor: "from-yellow-50 to-yellow-100",
            textColor: "text-yellow-800",
            buttonColor: "bg-yellow-600",
            seats: ["Ghế thường (giảm 15%)", "Ghế VIP (giảm 15%)", "C'MÊ (giảm 20%)", "Ghế đôi (giảm 10%)"]
        }
    ];

    // Các loại ghế - Đã cập nhật giá ưu đãi cho VIP
    const seatTypes = [
        {
            name: "Ghế thường",
            normalPrice: "45.000 - 75.000đ",
            vipPrice: "40.000 - 67.000đ (C'FRIEND -10%)",
            superVipPrice: "38.000 - 63.000đ (C'VIP -15%)",
            description: "Ghế ngồi tiêu chuẩn, phù hợp cho mọi đối tượng",
            icon: "💺"
        },
        {
            name: "Ghế VIP",
            normalPrice: "85.000 - 120.000đ",
            vipPrice: "76.000 - 108.000đ (C'FRIEND -10%)",
            superVipPrice: "72.000 - 102.000đ (C'VIP -15%)",
            description: "Ghế rộng rãi, đệm êm, không gian thoải mái",
            icon: "⭐"
        },
        {
            name: "Ghế đôi (Couple Seat)",
            normalPrice: "150.000 - 200.000đ",
            vipPrice: "135.000 - 180.000đ (C'FRIEND -10%)",
            superVipPrice: "127.000 - 170.000đ (C'VIP -15%)",
            description: "Ghế đôi dành cho các cặp đôi, có tay vịn có thể gập",
            icon: "💑"
        },
        {
            name: "C'MÊ (Giường nằm)",
            normalPrice: "95.000 - 150.000đ",
            vipPrice: "85.500 - 135.000đ (C'FRIEND -10%)",
            superVipPrice: "76.000 - 120.000đ (C'VIP -20%)",
            description: "Trải nghiệm xem phim như ở nhà với giường nằm êm ái, có chăn gối cao cấp",
            icon: "🛋️",
            vipFree: "C'VIP được tặng 01 vé C'MÊ vào tháng sinh nhật"
        },
        {
            name: "Ghế trẻ em",
            normalPrice: "35.000 - 55.000đ",
            vipPrice: "31.500 - 49.500đ (C'FRIEND -10%)",
            superVipPrice: "29.000 - 46.000đ (C'VIP -15%)",
            description: "Ghế dành riêng cho trẻ em dưới 13 tuổi, kích thước phù hợp",
            icon: "🧸"
        }
    ];

    // Dữ liệu ghế ngồi

    // Điều kiện cho trẻ em
    const childrenPolicy = {
        title: "CHÍNH SÁCH GIÁ VÉ TRẺ EM",
        rules: [
            "Trẻ em dưới 4 tuổi: Miễn phí vé (không có ghế riêng)",
            "Trẻ em từ 4 - 13 tuổi: Giá vé ưu đãi 35.000 - 55.000đ tùy suất chiếu",
            "Trẻ em trên 13 tuổi: Áp dụng giá vé người lớn",
            "Trẻ em dưới 13 tuổi phải đi cùng người lớn (trên 18 tuổi)",
            "Phim có rating T18 hoặc R: Trẻ em dưới 18 tuổi không được phép vào rạp"
        ],
        note: "Giá vé có thể thay đổi tùy theo từng suất chiếu và phim"
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                {/* Header trang */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">KHUYẾN MÃI & ƯU ĐÃI</h1>
                    <p className="text-gray-600 mt-2">Cập nhật các chương trình ưu đãi hấp dẫn tại Cinestar</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="flex gap-2 bg-white rounded-lg p-1 shadow-md">
                        <button
                            onClick={() => setActiveTab('promotions')}
                            className={`px-6 py-2 rounded-lg transition ${activeTab === 'promotions'
                                ? 'bg-red-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            🎁 Khuyến mãi
                        </button>
                        <button
                            onClick={() => setActiveTab('vip')}
                            className={`px-6 py-2 rounded-lg transition ${activeTab === 'vip'
                                ? 'bg-red-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            👑 Thẻ VIP
                        </button>
                        <button
                            onClick={() => setActiveTab('children')}
                            className={`px-6 py-2 rounded-lg transition ${activeTab === 'children'
                                ? 'bg-red-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            🧸 Trẻ em & Ghế ngồi
                        </button>
                    </div>
                </div>

                {/* Nội dung Khuyến mãi */}
                {activeTab === 'promotions' && (
                    <div className="space-y-6">
                        {promotions.map((promo) => (
                            <div key={promo.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                                <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white">
                                    <h2 className="text-2xl font-bold">{promo.title}</h2>
                                    <p className="text-red-100 mt-1">{promo.subtitle}</p>
                                    <div className="mt-2 inline-block bg-yellow-500 text-red-900 px-3 py-1 rounded-lg font-bold">
                                        {promo.price}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="mb-4">
                                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                            <span>📋</span> Điều kiện áp dụng:
                                        </h3>
                                        <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                                            {promo.conditions.map((condition, idx) => (
                                                <li key={idx}>{condition}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                            <span>⚠️</span> Lưu ý:
                                        </h3>
                                        <ul className="list-disc list-inside space-y-1 text-gray-500 text-sm">
                                            {promo.notes.map((note, idx) => (
                                                <li key={idx}>{note}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-6">
                                        <Link
                                            href="/dat-ve"
                                            className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                                        >
                                            ĐẶT VÉ NGAY
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Nội dung Thẻ VIP */}
                {activeTab === 'vip' && (
                    <div>
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {vipTiers.map((tier, index) => (
                                <div key={index} className={`bg-gradient-to-br ${tier.bgColor} rounded-xl shadow-lg p-6 hover:shadow-xl transition`}>
                                    <h3 className={`text-2xl font-bold ${tier.textColor} mb-2`}>{tier.level}</h3>
                                    <p className="text-gray-600 mb-4">
                                        <span className="font-semibold">Điều kiện:</span> {tier.minSpend}
                                    </p>
                                    <div className="mb-4">
                                        <p className="font-semibold text-gray-700 mb-2">Quyền lợi:</p>
                                        <ul className="space-y-1">
                                            {tier.benefits.map((benefit, idx) => (
                                                <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                                                    <span className="text-green-500">✓</span>
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <Link
                                        href="/dang-ky-thanh-vien"
                                        className={`inline-block ${tier.buttonColor} text-white px-6 py-2 rounded-lg font-semibold hover:opacity-80 transition`}
                                    >
                                        ĐĂNG KÝ NGAY
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">📊 CÁCH TÍCH LŨY ĐIỂM</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-gray-600">Mua vé 2D</span>
                                    <span className="font-semibold text-red-600">10 điểm/vé</span>
                                </div>
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-gray-600">Mua vé 3D/IMAX</span>
                                    <span className="font-semibold text-red-600">15 điểm/vé</span>
                                </div>
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-gray-600">Mua combo bắp nước</span>
                                    <span className="font-semibold text-red-600">5 điểm/combo</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-gray-600">Đổi 100 điểm</span>
                                    <span className="font-semibold text-red-600">01 vé 2D miễn phí</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nội dung Trẻ em & Ghế ngồi */}
                {activeTab === 'children' && (
                    <div className="space-y-6">
                        {/* Chính sách trẻ em */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span>🧸</span> {childrenPolicy.title}
                            </h2>
                            <div className="space-y-3">
                                {childrenPolicy.rules.map((rule, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <span className="text-red-500 font-bold">•</span>
                                        <span className="text-gray-600">{rule}</span>
                                    </div>
                                ))}
                                <p className="text-sm text-gray-400 mt-2 italic">{childrenPolicy.note}</p>
                            </div>
                        </div>

                        {/* Các loại ghế */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <span>🪑</span> CÁC LOẠI GHẾ NGỒI
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {seatTypes.map((seat, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-3xl">{seat.icon}</span>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{seat.name}</h3>
                                                <p className="text-red-600 font-semibold text-sm">{seat.price}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-sm">{seat.description}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">
                                    <span className="font-semibold">💡 Lưu ý:</span> Giá vé có thể thay đổi tùy theo suất chiếu,
                                    phim, và chương trình khuyến mãi áp dụng. Vui lòng liên hệ hotline 1900 1234 để biết thêm chi tiết.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KhuyenMaiPage;