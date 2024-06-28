import db from "@/utils/db";
import Food from "@/models/food";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
    try {
        const pageSize = Number(new URL(request.url).searchParams.get("page_size")) || 20;
        const page = Number(context.params.page) || 1;

        await db.connect();

        const count = await Food.countDocuments({});
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

        const data = await Food.find()
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();


        return NextResponse.json(
            {
                pagesCount,
                data: data.map(item => db.convertToObject(item))
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

