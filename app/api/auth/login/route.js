import User from "@/models/user";
import db from "@/utils/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
    try {
        const data = await request.json();

        if (!(data.username && data.password)) {
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

        if (!existUsername) {
            return NextResponse.json(
                {
                    message: "کاربری با نام کاربری وارد شده، وجود ندارد"
                }
                ,
                {
                    status: 404,
                }
            );
        }

        const existUser = await User.findOne({
            username: data.username.trim(),
            password: data.password.trim()
        }).lean();

        if (!existUser) {
            return NextResponse.json(
                {
                    message: "رمز عبور نادرست می‌باشد"
                }
                ,
                {
                    status: 400,
                }
            );
        }

        cookies().set("userId", existUser._id.toString());

        return NextResponse.json(
            db.convertToObject(existUser)
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