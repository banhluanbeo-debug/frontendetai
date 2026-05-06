"use client";
import React, { useState } from 'react';
import Link from 'next/link';

interface News {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    date: string;
    category: string;
    views: number;
}

const TinDienAnhPage = () => {
    const [selectedNews, setSelectedNews] = useState<News | null>(null);

    const newsList: News[] = [
        {
            id: 1,
            title: "AVENGERS: ENDGAME - KỶ NGUYÊN MỚI CỦA ĐIỆN ẢNH SIÊU ANH HÙNG",
            excerpt: "Bộ phim đạt doanh thu kỷ lục 2.8 tỷ USD toàn cầu, đánh dấu cột mốc quan trọng của Marvel Cinematic Universe.",
            content: "Avengers: Endgame không chỉ là một bộ phim, mà là một hiện tượng văn hóa. Với sự xuất hiện của hàng loạt siêu anh hùng, bộ phim đã tạo nên cơn sốt trên toàn thế giới. Tại Việt Nam, phim cũng phá vỡ nhiều kỷ lục phòng vé...",
            image: "https://picsum.photos/id/20/800/400",
            date: "25/03/2024",
            category: "Tin tức phim",
            views: 12500
        },
        {
            id: 2,
            title: "RA MẮT CÔNG NGHỆ IMAX VỚI LASER TẠI LUNCINEMAS",
            excerpt: "Hệ thống chiếu phim IMAX với Laser đầu tiên tại Việt Nam mang đến trải nghiệm hình ảnh và âm thanh đỉnh cao.",
            content: "Luncinemas tự hào là đơn vị tiên phong ứng dụng công nghệ IMAX with Laser tại Việt Nam. Công nghệ này mang đến độ tương phản cao hơn, màu sắc trung thực và âm thanh vòm sống động...",
            image: "https://picsum.photos/id/26/800/400",
            date: "20/03/2024",
            category: "Công nghệ",
            views: 8900
        },
        {
            id: 3,
            title: "LUNCINEMAS RA MẮT CHƯƠNG TRÌNH THÀNH VIÊN C'VIP MỚI",
            excerpt: "Chương trình thành viên C'VIP với nhiều quyền lợi hấp dẫn như giảm giá vé, tặng vé sinh nhật và ưu tiên chọn ghế.",
            content: "Từ tháng 4/2024, Luncinemas chính thức ra mắt chương trình thành viên C'VIP với nhiều ưu đãi đặc biệt. Thành viên C'VIP sẽ được giảm đến 20% giá vé, tặng 01 vé C'MÊ vào tháng sinh nhật...",
            image: "https://picsum.photos/id/30/800/400",
            date: "15/03/2024",
            category: "Ưu đãi",
            views: 6700
        },
        {
            id: 4,
            title: "TOP 10 PHIM VIỆT NAM ĐẠT DOANH THU CAO NHẤT 2024",
            excerpt: "Điểm danh những bộ phim Việt Nam gây sốt phòng vé trong nửa đầu năm 2024.",
            content: "Nửa đầu năm 2024 chứng kiến sự bùng nổ của điện ảnh Việt Nam với nhiều tác phẩm chất lượng. Dẫn đầu là bộ phim 'Quỷ Nhập Tràng 2' với doanh thu hơn 200 tỷ đồng...",
            image: "https://picsum.photos/id/33/800/400",
            date: "10/03/2024",
            category: "Top phim",
            views: 15200
        },
        {
            id: 5,
            title: "KHU VUI CHƠI KIDZONE MỚI KHAI TRƯƠNG TẠI LUNCINEMAS QUỐC THANH",
            excerpt: "Không gian vui chơi hiện đại dành cho trẻ em với nhiều trò chơi bổ ích và an toàn.",
            content: "Khu vui chơi Kidzone tại Luncinemas Quốc Thanh chính thức đi vào hoạt động, mang đến cho các bé những giờ phút giải trí tuyệt vời với các trò chơi giáo dục và sáng tạo...",
            image: "https://picsum.photos/id/35/800/400",
            date: "05/03/2024",
            category: "Dịch vụ",
            views: 4300
        }
    ];

    const categories = ["Tất cả", "Tin tức phim", "Công nghệ", "Ưu đãi", "Top phim", "Dịch vụ"];
    const [activeCategory, setActiveCategory] = useState("Tất cả");

    const filteredNews = activeCategory === "Tất cả"
        ? newsList
        : newsList.filter(news => news.category === activeCategory);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[300px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-red-700/80 z-10"></div>
                <img
                    src="https://picsum.photos/id/42/1920/400"
                    alt="Tin điện ảnh"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">TIN ĐIỆN ẢNH</h1>
                        <p className="text-xl text-white/90">Cập nhật tin tức mới nhất về thế giới điện ảnh</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-full font-semibold transition ${activeCategory === cat
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredNews.map((news) => (
                        <div
                            key={news.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer group"
                            onClick={() => setSelectedNews(news)}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={news.image}
                                    alt={news.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                />
                                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                                    {news.category}
                                </span>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                                    <span>📅 {news.date}</span>
                                    <span>👁️ {news.views.toLocaleString()} lượt xem</span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition">
                                    {news.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{news.excerpt}</p>
                                <button className="text-red-600 font-semibold text-sm hover:text-red-700">
                                    Đọc tiếp →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal Detail */}
                {selectedNews && (
                    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="relative">
                                <img
                                    src={selectedNews.image}
                                    alt={selectedNews.title}
                                    className="w-full h-64 object-cover rounded-t-2xl"
                                />
                                <button
                                    onClick={() => setSelectedNews(null)}
                                    className="absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded">{selectedNews.category}</span>
                                    <span>📅 {selectedNews.date}</span>
                                    <span>👁️ {selectedNews.views.toLocaleString()} lượt xem</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{selectedNews.title}</h2>
                                <div className="prose max-w-none">
                                    <p className="text-gray-600 leading-relaxed mb-4">{selectedNews.content}</p>
                                    <p className="text-gray-600 leading-relaxed">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t">
                                    <button
                                        onClick={() => setSelectedNews(null)}
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TinDienAnhPage;