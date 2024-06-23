import User from "@/models/user";
import db from "@/utils/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {

    try {
        const data = await request.json();

        if (!(data.username && data.password && data.first_name && data.last_name)) {
            return NextResponse.json(
                {
                    message: "لطفاً تمام فیلدهای الزامی را ارسال کنید"
                }
                ,
                {
                    status: 400,
                }
            );
        }

        await db.connect();

        const existUsername = await User.findOne({
            username: data.username.trim()
        }).lean();

        if (existUsername) {
            return NextResponse.json(
                {
                    message: "کاربری با نام کاربری وارد شده، قبلاً ثبت شده است"
                }
                ,
                {
                    status: 400,
                }
            );
        }

        const newUser = new User({
            first_name: data.first_name,
            last_name: data.last_name,
            username: data.username,
            password: data.password
        });
        await newUser.save();

        return NextResponse.json(
            data
            ,
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: "مشکلی از سمت سرور رخ داده است.\nلطفاً چند لحظه بعد مجدداً تلاش کنید."
            }
            ,
            {
                status: 500,
            }
        );
    }
}