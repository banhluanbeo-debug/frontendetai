"use client";
import React from 'react';
import Link from 'next/link';

interface Promotion {
    icon: string;
    title: string;
    description: string;
    detail: string;
}

interface PromotionsProps {
    promotions: Promotion[];
}

const Promotions: React.FC<PromotionsProps> = ({ promotions }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-l-8 border-red-600 pl-4">
                KHUYẾN MÃI NỔI BẬT
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-4">
                    {promotions.map((promo, index) => (
                        <div key={index} className={index < promotions.length - 1 ? "border-b pb-4" : ""}>
                            <h3 className="font-bold text-lg text-red-600">
                                {promo.icon} {promo.title}
                            </h3>
                            <p className="text-gray-600">{promo.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{promo.detail}</p>
                        </div>
                    ))}
                </div>
                <Link href="/khuyen-mai">
                    <button className="w-full mt-6 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                        XEM TẤT CẢ ƯU ĐÃI
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Promotions;