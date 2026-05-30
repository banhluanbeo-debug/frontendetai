"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ContactForm {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

const LienHePage = () => {
    const [formData, setFormData] = useState<ContactForm>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setFormData(prev => ({
                    ...prev,
                    name: parsedUser.name || prev.name,
                    email: parsedUser.email || prev.email,
                    phone: parsedUser.phone || prev.phone
                }));
            } catch (error) {
                console.error("Lỗi khi đọc thông tin user từ localStorage:", error);
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const res = await fetch("https://backendemo-cbwy.onrender.com/api/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Gửi liên hệ thất bại");

            setSubmitStatus('success');
            setFormData(prev => ({ ...prev, subject: '', message: '' }));
        } catch (error) {
            console.error(error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitStatus(null), 5000);
        }
    };

    const contactInfo = [
        {
            icon: "📍",
            title: "Địa chỉ",
            content: "52 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP.HCM",
            link: "https://maps.google.com"
        },
        {
            icon: "📞",
            title: "Hotline",
            content: "1900 1234",
            link: "tel:19001234"
        },
        {
            icon: "📧",
            title: "Email",
            content: "support@luncinemas.vn",
            link: "mailto:support@luncinemas.vn"
        },
        {
            icon: "⏰",
            title: "Giờ làm việc",
            content: "Thứ 2 - Chủ Nhật: 08:00 - 22:00",
            link: null
        }
    ];

    const branches = [
        {
            name: "Luncinemas Hai Bà Trưng",
            address: "52 Nguyễn Trãi, Q.1, TP.HCM",
            phone: "028 1234 5678",
            map: "https://picsum.photos/id/20/400/300"
        },
        {
            name: "Luncinemas Quốc Thanh",
            address: "12 Quốc Thanh, Q.1, TP.HCM",
            phone: "028 2345 6789",
            map: "https://picsum.photos/id/26/400/300"
        },
        {
            name: "Luncinemas Sinh Viên",
            address: "234 Lê Duẩn, Q.1, TP.HCM",
            phone: "028 3456 7890",
            map: "https://picsum.photos/id/30/400/300"
        },
        {
            name: "Luncinemas Cộng Hòa",
            address: "123 Cộng Hòa, Q.Tân Bình, TP.HCM",
            phone: "028 4567 8901",
            map: "https://picsum.photos/id/33/400/300"
        }
    ];

    const faqs = [
        {
            question: "Làm thế nào để đặt vé xem phim?",
            answer: "Bạn có thể đặt vé trực tiếp tại rạp, qua website hoặc tải app Luncinemas để đặt vé nhanh chóng và nhận nhiều ưu đãi."
        },
        {
            question: "Có thể đổi vé sau khi đã đặt không?",
            answer: "Vé đã đặt có thể đổi trước giờ chiếu 30 phút. Vui lòng liên hệ hotline để được hỗ trợ."
        },
        {
            question: "Làm sao để trở thành thành viên VIP?",
            answer: "Bạn có thể đăng ký thành viên tại quầy hoặc trên app. Đạt chi tiêu từ 10 triệu/năm sẽ được nâng cấp lên C'VIP."
        },
        {
            question: "Có ưu đãi gì cho học sinh sinh viên?",
            answer: "HSSV được giảm giá vé từ 45.000đ. Vui lòng xuất trình thẻ học sinh/sinh viên khi mua vé."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[300px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-red-700/80 z-10"></div>
                <img
                    src="https://picsum.photos/id/42/1920/400"
                    alt="Contact"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
                    <div className="max-w-4xl px-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            LIÊN HỆ
                        </h1>
                        <p className="text-xl text-white/90">
                            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {contactInfo.map((info, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition group">
                            <div className="text-4xl mb-3 group-hover:scale-110 transition">{info.icon}</div>
                            <h3 className="font-bold text-gray-800 mb-2">{info.title}</h3>
                            {info.link ? (
                                <a href={info.link} className="text-gray-600 text-sm hover:text-red-600 transition">
                                    {info.content}
                                </a>
                            ) : (
                                <p className="text-gray-600 text-sm">{info.content}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact Form & Map */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-8 border-red-600 pl-4">
                            GỬI TIN NHẮN CHO CHÚNG TÔI
                        </h2>

                        {submitStatus === 'success' && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-700">✓ Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.</p>
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700">✗ Có lỗi xảy ra. Vui lòng thử lại sau.</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Họ tên *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Nhập họ tên"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="example@email.com"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="090 1234 567"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Chủ đề *</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        <option value="">Chọn chủ đề</option>
                                        <option value="Đặt vé">Đặt vé</option>
                                        <option value="Góp ý">Góp ý</option>
                                        <option value="Khiếu nại">Khiếu nại</option>
                                        <option value="Hợp tác">Hợp tác</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Nội dung *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Nhập nội dung tin nhắn..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'ĐANG GỬI...' : 'GỬI TIN NHẮN'}
                            </button>
                        </form>
                    </div>

                    {/* Map & Social */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-6 border-b">
                                <h3 className="text-xl font-bold text-gray-800">BẢN ĐỒ</h3>
                                <p className="text-gray-500 text-sm mt-1">Trụ sở chính - Luncinemas Hai Bà Trưng</p>
                            </div>
                            <div className="h-80">
                                <img
                                    src="https://picsum.photos/id/15/600/400"
                                    alt="Map"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 bg-gray-50">
                                <a
                                    href="https://maps.google.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
                                >
                                    <span>📍</span> Xem chỉ đường trên Google Maps
                                </a>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">KẾT NỐI VỚI CHÚNG TÔI</h3>
                            <div className="flex gap-4 flex-wrap">
                                <a href="#" className="flex-1 bg-blue-600 text-white p-3 rounded-lg text-center hover:bg-blue-700 transition">
                                    <i className="fab fa-facebook mr-2"></i> Facebook
                                </a>
                                <a href="#" className="flex-1 bg-pink-600 text-white p-3 rounded-lg text-center hover:bg-pink-700 transition">
                                    <i className="fab fa-instagram mr-2"></i> Instagram
                                </a>
                                <a href="#" className="flex-1 bg-red-600 text-white p-3 rounded-lg text-center hover:bg-red-700 transition">
                                    <i className="fab fa-youtube mr-2"></i> YouTube
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Branches */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-8 border-red-600 pl-4">
                        HỆ THỐNG RẠP
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {branches.map((branch, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                                <img src={branch.map} alt={branch.name} className="w-full h-40 object-cover" />
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-800 mb-1">{branch.name}</h3>
                                    <p className="text-gray-500 text-xs mb-2">{branch.address}</p>
                                    <a href={`tel:${branch.phone}`} className="text-red-600 text-sm font-semibold">
                                        📞 {branch.phone}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-8 border-red-600 pl-4">
                        CÂU HỎI THƯỜNG GẶP
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                                <h3 className="font-bold text-gray-800 mb-2 flex items-start gap-2">
                                    <span className="text-red-600">❓</span>
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed pl-6">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-gradient-to-r from-red-700 to-red-900 py-12 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        CẦN HỖ TRỢ NGAY?
                    </h2>
                    <p className="text-white/90 text-lg mb-6">
                        Gọi ngay hotline để được tư vấn và hỗ trợ nhanh nhất
                    </p>
                    <a
                        href="tel:19001234"
                        className="inline-block bg-yellow-500 text-red-900 px-8 py-3 rounded-lg font-bold text-xl hover:bg-yellow-400 transition"
                    >
                        📞 1900 1234
                    </a>
                    <p className="text-white/70 text-sm mt-4">
                        Thời gian hỗ trợ: 08:00 - 22:00 (Tất cả các ngày trong tuần)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LienHePage;