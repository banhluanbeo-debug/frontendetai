export interface FoodItem {
    id: number;
    name: string;
    price: number;
    description: string | null;
    imageUrl: string | null;
    isActive: boolean;
}

const API_URL = "http://localhost:8080/api/foods";

export const getAllFoods = async (): Promise<FoodItem[]> => {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch all foods");
        return await res.json();
    } catch (err) {
        console.error("Error fetching all foods", err);
        return [];
    }
};

export const getActiveFoods = async (): Promise<FoodItem[]> => {
    try {
        const res = await fetch(`${API_URL}/active`);
        if (!res.ok) throw new Error("Failed to fetch active foods");
        return await res.json();
    } catch (err) {
        console.error("Error fetching active foods", err);
        return [];
    }
};

export const createFood = async (data: Omit<FoodItem, "id">): Promise<FoodItem> => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Create food failed");
    return res.json();
};

export const updateFood = async (id: number, data: Partial<FoodItem>): Promise<FoodItem> => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Update food failed");
    return res.json();
};

export const deleteFood = async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Delete food failed");
};
