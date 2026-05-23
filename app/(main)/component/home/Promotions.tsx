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
            <h2 className="text-3xl font-bold mb-6 text-white border-l-8 border-[#7c4dff] pl-4">
                KHUYẾN MÃI NỔI BẬT
            </h2>
            <div className="bg-[#1a237e]/40 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6">
                <div className="space-y-4">
                    {promotions.map((promo, index) => (
                        <div key={index} className={index < promotions.length - 1 ? "border-b border-white/10 pb-4" : ""}>
                            <h3 className="font-bold text-lg text-[#7c4dff]">
                                {promo.icon} {promo.title}
                            </h3>
                            <p className="text-gray-300">{promo.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{promo.detail}</p>
                        </div>
                    ))}
                </div>
                <Link href="/khuyen-mai">
                    <button className="w-full mt-6 bg-[#7c4dff] text-white py-2 rounded-lg hover:bg-[#651fff] transition shadow-[0_4px_15px_rgba(124,77,255,0.4)]">
                        XEM TẤT CẢ ƯU ĐÃI
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Promotions;