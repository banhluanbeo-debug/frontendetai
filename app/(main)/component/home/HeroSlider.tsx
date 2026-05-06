"use client";
import React, { useState } from 'react';

interface Slide {
    id: number;
    image: string;
    title: string;
}

interface HeroSliderProps {
    slides: Slide[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const nextSlide = (): void => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = (): void => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center text-white">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                            <button className="bg-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                                MUA VÉ NGAY
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition z-10"
            >
                ❮
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition z-10"
            >
                ❯
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition ${index === currentSlide ? 'bg-red-600' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;