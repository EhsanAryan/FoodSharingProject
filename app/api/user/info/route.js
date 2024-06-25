import User from "@/models/user";
import db from "@/utils/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        if (!(cookies().has("userId") && cookies().get("userId")?.value)) {
            return NextResponse.json(
                {
                    message: "احراز هویت انجام نشده است."
                },
                {
                    status: 401,
                }
            );
        }

        db.connect();

        const userId = cookies().get("userId").value;

        const user = await User.findById(userId).lean();

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

        return NextResponse.json(
            db.convertToObject(user)
            ,
            {
                status: 200,
            }
        );
    } catch (error) {
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

