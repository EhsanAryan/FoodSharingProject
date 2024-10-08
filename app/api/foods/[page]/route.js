// I don't use User model in this file, but it is necessary to recognize the userSchema, because it's the first API has been called in the project if user is not authenticated (GET /api/foods/[page])
import User from "@/models/user";
import Comment from "@/models/comment";
import Food from "@/models/food";
import db from "@/utils/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
    try {
        const page = Number(context.params.page) || 1;
        const pageSize = Number(new URL(request.url).searchParams.get("page_size")) || 20;
        const search = new URL(request.url).searchParams.get("search") || "";
        const category = new URL(request.url).searchParams.get("category") || "";

        await db.connect();

        const count = await Food.countDocuments((category.trim() && search.trim()) ? {
            title: {
                $regex: search.trim(),
                $options: "i"
            },
            category: category.trim()
        } : category.trim() ? {
            category: category.trim()
        } : search.trim() ? {
            title: {
                $regex: search.trim(),
                $options: "i"
            }
        } : {});
        const pagesCount = count === 0 ? 1 : Math.ceil(count / pageSize);

        if (page > pagesCount) {
            return NextResponse.json(
                {
                    message: "صفحه یافت نشد!"
                },
                {
                    status: 404,
                }
            );
        }

        const foods = await Food.find((category.trim() && search.trim()) ? {
            title: {
                $regex: search.trim(),
                $options: "i"
            },
            category: category.trim()
        } : category.trim() ? {
            category: category.trim()

        } : search.trim() ? {
            title: {
                $regex: search.trim(),
                $options: "i"
            },
        } : {})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate("creator")
            .lean();

        foods.forEach((food) => {
            food.creator = db.convertToObject(food.creator);
            delete food.creator.password;
        });


        return NextResponse.json(
            {
                pagesCount,
                data: foods.map(item => db.convertToObject(item))
            },
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

