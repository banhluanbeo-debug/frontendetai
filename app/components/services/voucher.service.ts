export interface Voucher {
    id: number;
    code: string;
    discountAmount: number;
    type: string;
    status: "UNUSED" | "USED";
    userId: number;
    createdAt: string;
}

export const getVouchersByUser = async (userId: number): Promise<Voucher[]> => {
    try {
        const res = await fetch(`http://localhost:8080/api/vouchers/user/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch vouchers");
        return await res.json();
    } catch (err) {
        console.error("Error fetching vouchers", err);
        return [];
    }
};
