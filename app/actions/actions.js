"use server"

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import db from "@/utils/db";

export const logoutAction = async () => {
    cookies().delete("foodToken");
    cookies().delete("isAdmin");
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

export const checkIsOwner = async (id) => {
    if (!(cookies().has("foodToken") && cookies().get("foodToken")?.value)) {
        return false;
    }

    const token = cookies().get("foodToken").value;

    const { decodedToken, error } = await checkTokenIsValid(token);
    if (error) return false;

    await db.connect();

    const user = await User.findById(decodedToken.sub).lean();
    if (!user) return false;
    
    if(user._id.toString() === id.toString() || user.is_admin === 1) return true;
    return false;
}

export const checkIsFavorite = async (id) => {
    if (!(cookies().has("foodToken") && cookies().get("foodToken")?.value)) {
        return false;
    }

    const token = cookies().get("foodToken").value;

    const { decodedToken, error } = await checkTokenIsValid(token);
    if (error) return false;

    await db.connect();

    const user = await User.findById(decodedToken.sub).lean();
    if (!user) return false;
    
    if(user.favorites.find(item => item.toString() === id.toString())) return true;
    return false;
}
