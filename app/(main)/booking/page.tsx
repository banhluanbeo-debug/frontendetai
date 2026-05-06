// app/(main)/booking/page.tsx
"use client";

import SeatPicker from "@/app/components/ui/SeatPicker";

export default function BookingPage() {
    return (
        <SeatPicker onConfirm={(seats) => console.log("Đã chọn:", seats)} />
    );
}