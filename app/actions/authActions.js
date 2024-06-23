"use server";

import User from "@/models/user";
import db from "@/utils/db";
import { cookies } from "next/headers";

// Register
export const registerAction = async (data) => {
    try {
        if (!(data.username && data.password && data.first_name && data.last_name)) {
            return {
                status: 400,
                message: "لطفاً تمام فیلدهای الزامی را ارسال کنید"
            };
        }

        await db.connect();

        const existUsername = await User.findOne({
            username: data.username.trim()
        }).lean();

        if (existUsername) {
            return {
                status: 400,
                message: "کاربری با نام کاربری وارد شده، قبلاً ثبت شده است"
            };
        }

        const newUser = new User({
            first_name: data.first_name,
            last_name: data.last_name,
            username: data.username,
            password: data.password
        });
        await newUser.save();

        return {
            status: 200,
            data: data
        };


    } catch (error) {
        return {
            status: 500,
            message: "مشکلی از سمت سرور رخ داده است.\nلطفاً چند لحظه بعد مجدداً تلاش کنید."
        };
    }
}

// Login
export const loginAction = async (data) => {
    try {
        if (!(data.username && data.password)) {
            return {
                status: 400,
                message: "لطفاً تمام فیلدهای الزامی را ارسال کنید"
            };
        }

        await db.connect();

        const existUsername = await User.findOne({
            username: data.username.trim()
        }).lean();

        if (!existUsername) {
            return {
                status: 400,
                message: "کاربری با نام کاربری وارد شده، وجود ندارد"
            };
        }

        const existUser = await User.findOne({
            username: data.username.trim(),
            password: data.password.trim()
        }).lean();

        if (!existUser) {
            return {
                status: 400,
                message: "رمز عبور نادرست می‌باشد"
            };
        }

        cookies().set("userId", existUser._id.toString());

        return {
            status: 200,
            data: db.convertToObject(existUser)
        };

    } catch (error) {
        return {
            status: 500,
            message: "مشکلی از سمت سرور رخ داده است.\nلطفاً چند لحظه بعد مجدداً تلاش کنید."
        };
    }
}