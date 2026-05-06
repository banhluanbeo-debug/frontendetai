"use client";
import React from 'react';

const ChinhSachBaoMatPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">CHÍNH SÁCH BẢO MẬT</h1>
                    <p className="text-gray-500 mb-8">Cập nhật lần cuối: 01/03/2024</p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-red-600 pl-3">1. MỤC ĐÍCH THU THẬP THÔNG TIN</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Chúng tôi thu thập thông tin cá nhân của bạn nhằm mục đích:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
                                <li>Xử lý đặt vé và thanh toán</li>
                                <li>Cập nhật thông tin về lịch chiếu, khuyến mãi và sự kiện</li>
                                <li>Quản lý tài khoản thành viên và tích điểm</li>
                                <li>Hỗ trợ khách hàng và giải đáp thắc mắc</li>
                                <li>Cải thiện chất lượng dịch vụ</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-red-600 pl-3">2. PHẠM VI THU THẬP THÔNG TIN</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Chúng tôi có thể thu thập các thông tin sau:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
                                <li>Họ tên, ngày tháng năm sinh</li>
                                <li>Địa chỉ email, số điện thoại</li>
                                <li>Địa chỉ nhà riêng</li>
                                <li>Lịch sử đặt vé và các giao dịch</li>
                                <li>Thông tin đăng nhập và mật khẩu</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-red-600 pl-3">3. BẢO MẬT THÔNG TIN</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
                                <li>Mã hóa dữ liệu bằng công nghệ SSL</li>
                                <li>Giới hạn quyền truy cập thông tin</li>
                                <li>Kiểm tra và cập nhật hệ thống bảo mật thường xuyên</li>
                                <li>Không chia sẻ thông tin với bên thứ ba khi chưa có sự đồng ý</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-red-600 pl-3">4. QUYỀN CỦA KHÁCH HÀNG</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Bạn có quyền:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
                                <li>Yêu cầu xem, sửa hoặc xóa thông tin cá nhân</li>
                                <li>Hủy đăng ký nhận email quảng cáo</li>
                                <li>Khiếu nại về việc sử dụng thông tin cá nhân</li>
                                <li>Yêu cầu chấm dứt tài khoản thành viên</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-red-600 pl-3">5. LIÊN HỆ</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg mt-3">
                                <p className="text-gray-700">📧 Email: privacy@luncinemas.vn</p>
                                <p className="text-gray-700 mt-1">📞 Hotline: 1900 1234</p>
                                <p className="text-gray-700 mt-1">📍 Địa chỉ: 52 Nguyễn Trãi, Q.1, TP.HCM</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChinhSachBaoMatPage;