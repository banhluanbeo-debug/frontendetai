// types/booking.ts - cập nhật lại theo API thực tế
export interface SeatAPI {
    id: number;
    code: string;        // "A1", "A2", "B3"...
    type: "REGULAR" | "VIP" | "BED";
    status: boolean;     // true = còn trống, false = đã đặt
    createdAt: string;
}

export interface SelectedSeat {
    id: string;
    type: "single" | "vip" | "bed";
    price: number;
}