import db from "@/utils/db";
import Food from "@/models/food";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// const foods = [
//     {
//         name: "همبرگر",
//         summary: "یه همبرگر ساده",
//         instruction: "ابتدا گوشت را میپزیم\nسپس میزاریم لای نون.",
//         image: "/foods/burger.jpg",
//     },
//     {
//         name: "پیتزا",
//         summary: "پیتزا مخلوط",
//         instruction: "پیتزا رو میزاریم تو فر\n10 دقیقه بعد برمیداریم میخوریم",
//         image: "/foods/pizza.jpg",
//     },
// ]

export async function GET(request, context) {
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
            statusText: "Foods received successfully!"
        }
    );
}

