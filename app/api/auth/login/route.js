import User from "@/models/user";
import db from "@/utils/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

        const existUser = await User.findOne({
            username: data.username.trim()
        }).lean();

        if (!existUser) {
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

        const isCorrectPassword = bcrypt.compareSync(data.password.trim(), existUser.password);

        if (!isCorrectPassword) {
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

        const payload = {
            sub: existUser._id.toString(),
            username: existUser.username,
            // first_name: existUser.first_name,
            // last_name: existUser.last_name
        };

        const JWT_SECRET = process.env.JWT_SECRET;

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: "30d" }
        );

        cookies().set("foodToken", token, {
            maxAge: 30 * 24 * 60 * 60,
        });

        return NextResponse.json(
            {}
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