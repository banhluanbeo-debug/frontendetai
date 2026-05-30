// "use client";
// import React from 'react';
// import HeroSlider from '../component/home/HeroSlider';
// import QuickBookingForm from '../component/home/QuickBookingForm';
// import NowShowing from '../component/home/NowShowing';
// import ComingSoon from '../component/home/ComingSoon';
// import Promotions from '../component/home/Promotions';
// import MembershipPrograms from '../component/home/MembershipPrograms';
// import EntertainmentServices from '../component/home/EntertainmentServices';

// // ✅ ĐỂ TYPE RA NGOÀI (không để trong component)
// interface Movie {
//     id: number;
//     title: string;
//     rating?: string;
//     genre?: string;
// }

// interface HomeProps {
//     movies: Movie[];
// }

// const Home: React.FC<HomeProps> = ({ movies }) => {
//     const theaters: string[] = [
//         'Luncinemas Hai Bà Trưng',
//         'Luncinemas Quốc Thanh',
//         'Luncinemas Sinh Viên'
//     ];

//     const dates: string[] = ['19/03', '20/03', '21/03', '22/03', '23/03'];
//     const showtimes: string[] = ['10:00', '13:30', '16:45', '19:30', '22:15'];

//     const comingSoonMovies = [
//         { id: 7, title: 'KUNG FU QUẢI CHƯỞNG' },
//         { id: 8, title: 'CHÚNG SẼ ĐOẠT MẠNG' },
//         { id: 9, title: 'TỨ HỔ ĐẠI NÁO' }
//     ];

//     const promotions = [
//         { icon: '🎓', title: 'HSSV', description: 'Giá vé chỉ từ 45.000đ - Áp dụng cả tuần', detail: 'Xuất trình thẻ HSSV/Căn cước' },
//         { icon: '⏰', title: 'Happy Hour', description: 'Trước 10h & Sau 22h - Giá vé từ 45.000đ', detail: 'Áp dụng tất cả các ngày trong tuần' },
//         { icon: '👑', title: 'Thành viên VIP', description: "Giảm đến 20% vé C'MÊ + Tặng vé sinh nhật", detail: 'Chi tiêu từ 10 triệu/năm' }
//     ];

//     const memberships = [
//         {
//             name: "C'FRIEND",
//             description: "Thẻ C'Friend mang đến nhiều ưu đãi cho thành viên mới.",
//             bgGradient: "from-blue-50 to-blue-100",
//             textColor: "text-blue-800",
//             buttonColor: "bg-blue-600"
//         },
//         {
//             name: "C'VIP",
//             description: "Thẻ VIP Luncinemas dành riêng cho bạn những đặc quyền chất riêng.",
//             bgGradient: "from-yellow-50 to-yellow-100",
//             textColor: "text-yellow-800",
//             buttonColor: "bg-yellow-600"
//         }
//     ];

//     const services = [
//         { name: 'KIDZONE', icon: '🎮' },
//         { name: 'BOWLING', icon: '🎳' },
//         { name: 'BILLIARDS', icon: '🎱' },
//         { name: 'GYM', icon: '💪' },
//         { name: 'TERA', icon: '🎯' }
//     ];


//     const handleBooking = (data: any) => {
//         console.log('Booking data:', data);
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">

//             <QuickBookingForm
//                 theaters={theaters}
//                 movies={movies}   // ✅ dùng props
//                 dates={dates}
//                 showtimes={showtimes}
//                 onSubmit={handleBooking}
//             />

//             <NowShowing movies={movies} />  {/* ✅ dùng props */}

//             <section className="bg-gray-100 py-12">
//                 <div className="container mx-auto px-4">
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                         <ComingSoon movies={comingSoonMovies} />
//                         <Promotions promotions={promotions} />
//                     </div>
//                 </div>
//             </section>

//             <MembershipPrograms memberships={memberships} />
//             <EntertainmentServices services={services} />
//         </div>
//     );
// };

// export default Home;

"use client";

import React, { useEffect, useState } from "react";

import QuickBookingForm from "../component/home/QuickBookingForm";
import NowShowing from "../component/home/NowShowing";
import ComingSoon from "../component/home/ComingSoon";
import Promotions from "../component/home/Promotions";
import MembershipPrograms from "../component/home/MembershipPrograms";
import EntertainmentServices from "../component/home/EntertainmentServices";

import {
    getComingSoonMovies,
    getNowShowingMovies,
} from "@/app/components/services/movie.service";
import QuickContactForm from "../component/home/QuickContactForm";
// ================= TYPES =================
interface Movie {
    id: number;
    title: string;
    rating?: string;
    genre?: string;
}

// ================= HOME =================
const Home = () => {
    // ===== STATE =====
    const [nowShowing, setNowShowing] = useState<Movie[]>([]);
    const [comingSoon, setComingSoon] = useState<Movie[]>([]);

    // ===== STATIC DATA =====

    const promotions = [
        {
            icon: "🎓",
            title: "HSSV",
            description: "Giá vé chỉ từ 45.000đ - Áp dụng cả tuần",
            detail: "Xuất trình thẻ HSSV/Căn cước",
        },
        {
            icon: "⏰",
            title: "Happy Hour",
            description: "Trước 10h & Sau 22h - Giá vé từ 45.000đ",
            detail: "Áp dụng tất cả các ngày trong tuần",
        },
        {
            icon: "👑",
            title: "Thành viên VIP",
            description: "Giảm đến 20% vé C'MÊ + Tặng vé sinh nhật",
            detail: "Chi tiêu từ 10 triệu/năm",
        },
    ];

    const memberships = [
        {
            name: "C'FRIEND",
            description:
                "Thẻ C'Friend mang đến nhiều ưu đãi cho thành viên mới.",
            bgGradient: "from-blue-50 to-blue-100",
            textColor: "text-blue-800",
            buttonColor: "bg-blue-600",
        },
        {
            name: "C'VIP",
            description:
                "Thẻ VIP Luncinemas dành riêng cho bạn những đặc quyền chất riêng.",
            bgGradient: "from-yellow-50 to-yellow-100",
            textColor: "text-yellow-800",
            buttonColor: "bg-yellow-600",
        },
    ];

    const services = [
        { name: "KIDZONE", icon: "🎮" },
        { name: "BOWLING", icon: "🎳" },
        { name: "BILLIARDS", icon: "🎱" },
        { name: "GYM", icon: "💪" },
        { name: "TERA", icon: "🎯" },
    ];

    // ===== FETCH DATA =====
    useEffect(() => {
        getNowShowingMovies().then(setNowShowing);
        getComingSoonMovies().then(setComingSoon);
    }, []);



    // ===== UI =====
    return (
        <div className="min-h-screen text-white bg-transparent">

            {/* QUICK BOOKING */}
            <QuickBookingForm movies={nowShowing} />

            {/* NOW SHOWING */}
            <NowShowing movies={nowShowing} />

            {/* COMING SOON + PROMOTIONS */}
            <section className="bg-black/20 py-12 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <ComingSoon movies={comingSoon} />
                        <Promotions promotions={promotions} />
                    </div>
                </div>
            </section>

            {/* MEMBERSHIP */}
            <MembershipPrograms memberships={memberships} />

            {/* CONTACT */}
            <QuickContactForm />

            {/* SERVICES */}
            <EntertainmentServices services={services} />
        </div>
    );
};

export default Home;