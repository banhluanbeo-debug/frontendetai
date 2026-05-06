"use client";
import React from 'react';

interface Membership {
    name: string;
    description: string;
    bgGradient: string;
    textColor: string;
    buttonColor: string;
}

interface MembershipProgramsProps {
    memberships: Membership[];
}

const MembershipPrograms: React.FC<MembershipProgramsProps> = ({ memberships }) => {
    return (
        <section className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 border-l-8 border-red-600 pl-4">
                CHƯƠNG TRÌNH THÀNH VIÊN
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {memberships.map((membership, index) => (
                    <div
                        key={index}
                        className={`bg-gradient-to-br ${membership.bgGradient} rounded-xl shadow-lg p-6 hover:shadow-2xl transition`}
                    >
                        <h3 className={`text-2xl font-bold ${membership.textColor} mb-3`}>
                            {membership.name}
                        </h3>
                        <p className="text-gray-700 mb-4">
                            {membership.description}
                        </p>
                        <button className={`${membership.buttonColor} text-white px-6 py-2 rounded-lg hover:opacity-90 transition`}>
                            TÌM HIỂU NGAY
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MembershipPrograms;