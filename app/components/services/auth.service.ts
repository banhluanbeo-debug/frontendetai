const BASE_URL = "http://localhost:8080/api/auth";

export const login = async (data: {
    email: string;
    password: string;
}) => {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Login failed");

    return res.json();
};

export const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
}) => {
    const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Register failed");

    return res.json();
};