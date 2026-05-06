"use client";
import React from 'react';

interface Service {
    name: string;
    icon: string;
}

interface EntertainmentServicesProps {
    services: Service[];
}

const EntertainmentServices: React.FC<EntertainmentServicesProps> = ({ services }) => {
    return (
        <section className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-6 text-center">DỊCH VỤ GIẢI TRÍ KHÁC</h2>
                <p className="text-center text-gray-300 mb-10 max-w-2xl mx-auto">
                    Luncinemas không chỉ chiếu phim – chúng tôi còn mang đến nhiều mô hình giải trí đặc sắc khác,
                    giúp bạn tận hưởng từng giây phút bên ngoài màn ảnh rộng.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {services.map((service, index) => (
                        <div key={index} className="text-center group cursor-pointer">
                            <div className="bg-gray-800 w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl mb-3 group-hover:bg-red-600 transition">
                                {service.icon}
                            </div>
                            <p className="font-semibold">{service.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EntertainmentServices;