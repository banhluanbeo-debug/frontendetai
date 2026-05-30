"use client";
import React, { useState, useEffect } from 'react';

interface ContactForm {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

const QuickContactForm = () => {
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
            // Chỉ reset subject và message, giữ nguyên thông tin cá nhân
            setFormData(prev => ({ ...prev, subject: '', message: '' }));
        } catch (error) {
            console.error(error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitStatus(null), 5000);
        }
    };

    return (
        <section className="py-12 bg-transparent text-white">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto bg-black/40 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 border-l-8 border-red-600 pl-4 uppercase">
                        Gửi tin nhắn cho chúng tôi
                    </h2>

                    {submitStatus === 'success' && (
                        <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
                            <p className="text-green-400">✓ Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.</p>
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                            <p className="text-red-400">✗ Có lỗi xảy ra. Vui lòng thử lại sau.</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-white/80 font-semibold mb-2">Họ tên *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/50 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                    placeholder="Nhập họ tên"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 font-semibold mb-2">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/50 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                    placeholder="example@email.com"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-white/80 font-semibold mb-2">Số điện thoại</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                    placeholder="090 1234 567"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 font-semibold mb-2">Chủ đề *</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/50 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition [&>option]:bg-gray-900"
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
                            <label className="block text-white/80 font-semibold mb-2">Nội dung *</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="w-full px-4 py-3 bg-black/50 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
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
            </div>
        </section>
    );
};

export default QuickContactForm;
