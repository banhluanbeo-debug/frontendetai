"use client";
import React from 'react';

interface SocialLink {
    name: string;
    icon: string;
    link: string;
}

interface NavLink {
    name: string;
    link: string;
}

const Footer: React.FC = () => {
    const socialLinks: SocialLink[] = [
        { name: 'Facebook', icon: 'fab fa-facebook', link: '#' },
        { name: 'Instagram', icon: 'fab fa-instagram', link: '#' },
        { name: 'TikTok', icon: 'fab fa-tiktok', link: '#' },
        { name: 'YouTube', icon: 'fab fa-youtube', link: '#' },
        { name: 'Zalo', icon: 'fas fa-comment', link: '#' }
    ];

    const aboutLinks: NavLink[] = [
        { name: 'Giới thiệu', link: '/gioi-thieu' },
        { name: 'Liên hệ', link: '/contact' },
        { name: 'Tin điện ảnh', link: '#' }
    ];

    const supportLinks: NavLink[] = [
        { name: 'Hỏi đáp', link: '#' },
        { name: 'Chính sách bảo mật', link: '#' },
        { name: 'Điều khoản sử dụng', link: '#' }
    ];

    return (
        <footer className="bg-gray-800 text-gray-300 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Social Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">LIÊN HỆ</h3>
                        <div className="flex flex-wrap gap-3">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.link}
                                    className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                                >
                                    <i className={social.icon}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* About Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">VỀ CHÚNG TÔI</h3>
                        <ul className="space-y-2">
                            {aboutLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.link} className="hover:text-red-400 transition">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">HỖ TRỢ</h3>
                        <ul className="space-y-2">
                            {supportLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.link} className="hover:text-red-400 transition">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">KẾT NỐI</h3>
                        <p className="mb-2">📞 Hotline: 1900 1234</p>
                        <p className="mb-2">✉️ Email: support@luncinemas.vn</p>
                        <p>🏢 52 Nguyễn Trãi, Q.1, TP.HCM</p>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p>&copy; 2024 Luncinemas. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;