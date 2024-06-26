"use server"

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const logoutAction = async () => {
    cookies().delete("foodToken");
}

export const checkTokenIsValid = async (token) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        return { decodedToken, error: null };
    } catch (error) {
        return { decodedToken: null, error };
    }
}