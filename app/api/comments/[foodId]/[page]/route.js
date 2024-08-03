import db from "@/utils/db";
import User from "@/models/user";
import Comment from "@/models/comment";
import Food from "@/models/food";
import { NextResponse } from "next/server";
import { checkIsOwner } from "@/app/actions/actions";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
    try {

        const foodId = context.params.foodId;
        const page = context.params.page;
        const pageSize = Number(new URL(request.url).searchParams.get("page_size")) || 20;

        await db.connect();

        const food = await Food.findById(foodId).lean();

        if (!food) {
            return NextResponse.json(
                {
                    message: "غذای مورد نظر یافت نشد."
                },
                {
                    status: 404
                }
            );
        }

        const count = await Comment.countDocuments({ food: foodId });
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

        const comments = await Comment.find({ food: foodId })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate("user")
            .populate("food")
            .lean();


        for(let comment of comments) {
            comment.user = db.convertToObject(comment.user);
            delete comment.user.password;
            comment.food = db.convertToObject(comment.food);
            comment.is_owner = await checkIsOwner(comment.user._id.toString());
        }

        return NextResponse.json(
            {
                pagesCount,
                data: comments.map(item => db.convertToObject(item))
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