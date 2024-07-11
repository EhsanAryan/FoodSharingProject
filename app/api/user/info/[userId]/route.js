import User from "@/models/user";
import db from "@/utils/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
    try {
        const userId = context.params.userId;

        await db.connect();

        const user = await User.findById(userId).populate("favorites").lean();

        for (let item of user.favorites) {
            item = db.convertToObject(item);
        }

        if (!user) {
            return NextResponse.json(
                {
                    message: "کاربر مورد نظر یافت نشد"
                },
                {
                    status: 404,
                }
            );
        }

        const { password, ...userData } = db.convertToObject(user);

        return NextResponse.json(
            userData
            ,
            {
                status: 200,
            }
        );
    } catch (err) {
        return NextResponse.json(
            {
                message: "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید."
            }
            ,
            {
                status: 500,
            }
        );
    }
}