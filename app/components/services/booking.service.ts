// services/booking.ts
export async function getSeats() {
    const res = await fetch("http://localhost:8080/api/seats");
    if (!res.ok) throw new Error("Không thể lấy dữ liệu ghế");
    return res.json();
}