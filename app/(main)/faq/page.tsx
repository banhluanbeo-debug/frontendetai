"use client";
import { Link } from 'lucide-react';
import React, { useState } from 'react';

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
}

const HoiDapPage = () => {
    const [activeId, setActiveId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const faqs: FAQ[] = [
        {
            id: 1,
            category: "Đặt vé",
            question: "Làm thế nào để đặt vé xem phim?",
            answer: "Bạn có thể đặt vé qua 3 cách:\n• Trực tiếp tại quầy bán vé của rạp\n• Qua website: luncinemas.vn\n• Tải app Luncinemas trên điện thoại\n\nSau khi đặt vé thành công, bạn sẽ nhận mã QR qua email/SMS để check-in tại rạp."
        },
        {
            id: 2,
            category: "Đặt vé",
            question: "Có thể đặt vé trước bao nhiêu ngày?",
            answer: "Bạn có thể đặt vé trước tối đa 7 ngày. Lịch chiếu thường được cập nhật vào thứ 4 hàng tuần cho tuần tiếp theo."
        },
        {
            id: 3,
            category: "Đặt vé",
            question: "Làm sao để hủy hoặc đổi vé?",
            answer: "Vé có thể được đổi/hủy trước giờ chiếu tối thiểu 30 phút. Vui lòng liên hệ hotline 1900 1234 để được hỗ trợ. Phí đổi vé là 10,000đ/vé."
        },
        {
            id: 4,
            category: "Thành viên",
            question: "Làm thế nào để đăng ký thành viên?",
            answer: "Bạn có thể đăng ký thành viên miễn phí tại:\n• Quầy vé các rạp Luncinemas\n• Website: luncinemas.vn/dang-ky\n• App Luncinemas\n\nSau khi đăng ký, bạn sẽ nhận được thẻ thành viên và tích điểm cho mỗi lần mua vé."
        },
        {
            id: 5,
            category: "Thành viên",
            question: "Cách tính điểm thành viên như thế nào?",
            answer: "• Vé 2D: 10 điểm/vé\n• Vé 3D/IMAX: 15 điểm/vé\n• Combo bắp nước: 5 điểm/combo\n• 100 điểm = 01 vé 2D miễn phí\n\nĐiểm sẽ được cộng sau khi kết thúc suất chiếu."
        },
        {
            id: 6,
            category: "Thành viên",
            question: "Điều kiện để trở thành C'VIP?",
            answer: "Để trở thành C'VIP, bạn cần đạt tổng chi tiêu từ 10 triệu đồng/năm. Quyền lợi C'VIP bao gồm:\n• Giảm 15% giá vé\n• Giảm 20% giá vé C'MÊ\n• Tặng 01 vé sinh nhật\n• Ưu tiên chọn ghế đẹp"
        },
        {
            id: 7,
            category: "Ưu đãi",
            question: "Có ưu đãi gì cho học sinh sinh viên?",
            answer: "HSSV được hưởng giá vé ưu đãi:\n• 45,000đ/vé 2D (thứ 2 và suất trước 10h)\n• 49,000đ/vé 2D (các suất còn lại)\n• 55,000đ/vé 3D\n\nVui lòng xuất trình thẻ HSSV khi mua vé."
        },
        {
            id: 8,
            category: "Ưu đãi",
            question: "Happy Day thứ 2 là gì?",
            answer: "Happy Day thứ 2 là chương trình ưu đãi đặc biệt:\n• Đồng giá 45,000đ/vé 2D\n• Đồng giá 55,000đ/vé 3D\n• Đồng giá 95,000đ/vé C'MÊ\nÁp dụng cho tất cả khách hàng vào thứ 2 hàng tuần."
        },
        {
            id: 9,
            category: "Dịch vụ",
            question: "Có dịch vụ gửi xe không?",
            answer: "Có, tất cả các rạp Luncinemas đều có bãi giữ xe ô tô và xe máy. Phí gửi xe được miễn phí khi mua vé xem phim."
        },
        {
            id: 10,
            category: "Dịch vụ",
            question: "Có thể tổ chức sinh nhật tại rạp không?",
            answer: "Có, Luncinemas có dịch vụ tổ chức tiệc sinh nhật với gói combo đặc biệt bao gồm: vé phim, bắp nước, bánh kem và trang trí. Vui lòng liên hệ trước 3-5 ngày để được hỗ trợ."
        }
    ];

    const categories = [
        { id: 'all', name: 'Tất cả' },
        { id: 'Đặt vé', name: 'Đặt vé' },
        { id: 'Thành viên', name: 'Thành viên' },
        { id: 'Ưu đãi', name: 'Ưu đãi' },
        { id: 'Dịch vụ', name: 'Dịch vụ' }
    ];

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[250px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-red-700/80 z-10"></div>
                <img
                    src="https://picsum.photos/id/26/1920/300"
                    alt="Hỏi đáp"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">HỎI ĐÁP</h1>
                        <p className="text-xl text-white/90">Giải đáp mọi thắc mắc về Luncinemas</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm câu hỏi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-5 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-5 py-2 rounded-full font-semibold transition ${activeCategory === cat.id
                                    ? 'bg-red-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* FAQ List */}
                <div className="max-w-4xl mx-auto space-y-4">
                    {filteredFaqs.map((faq) => (
                        <div key={faq.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                            <button
                                onClick={() => setActiveId(activeId === faq.id ? null : faq.id)}
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                            >
                                <span className="font-semibold text-gray-800">{faq.question}</span>
                                <span className="text-red-600 text-xl">
                                    {activeId === faq.id ? '−' : '+'}
                                </span>
                            </button>
                            {activeId === faq.id && (
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                    <p className="text-gray-600 whitespace-pre-line">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-5xl mb-4">🔍</div>
                            <p className="text-gray-500">Không tìm thấy câu hỏi phù hợp</p>
                            <Link href="/lien-he" className="text-red-600 hover:underline mt-2 inline-block">
                                Liên hệ để được hỗ trợ
                            </Link>
                        </div>
                    )}
                </div>

                {/* Support CTA */}
                <div className="mt-12 text-center bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Bạn chưa tìm thấy câu trả lời?</h3>
                    <p className="text-gray-600 mb-4">Hãy liên hệ với chúng tôi để được hỗ trợ nhanh nhất</p>
                    <Link
                        href="/lien-he"
                        className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                        LIÊN HỆ NGAY
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HoiDapPage;