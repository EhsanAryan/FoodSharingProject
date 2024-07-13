import db from "@/utils/db";
import User from "@/models/user";
import Food from "@/models/food";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
    try {
        const userId = context.params.userId;
        const search = new URL(request.url).searchParams.get("search") || "";
        const category = new URL(request.url).searchParams.get("category") || "";

        await db.connect();

        const user = await User.findById(userId).lean();

        if (!user) {
            return NextResponse.json(
                {
                    message: "کاربر مورد نظر یافت نشد."
                },
                {
                    status: 404
                }
            );
        }

        const foods = await Food.find((category.trim() && search.trim()) ? {
            creator: userId,
            title: {
                $regex: search.trim(),
                $options: "i"
            },
            category: category.trim()
        } : category.trim() ? {
            creator: userId,
            category: category.trim()
        } : search.trim() ? {
            creator: userId,
            title: {
                $regex: search.trim(),
                $options: "i"
            }
        } : {
            creator: userId
        }).populate("creator").lean();

        foods.forEach((food) => {
            food.creator = db.convertToObject(food.creator);
            delete food.creator.password;
        });

        return NextResponse.json(
            foods.map(item => db.convertToObject(item))
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