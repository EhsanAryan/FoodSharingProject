import User from "@/models/user";
import Food from "@/models/food";
import db from "@/utils/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { checkTokenIsValid } from "@/app/actions/actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request) {
    try {
        if (!(cookies().has("foodToken") && cookies().get("foodToken")?.value)) {
            return NextResponse.json(
                {
                    message: "احراز هویت انجام نشده است."
                },
                {
                    status: 401,
                }
            );
        }

        const formData = await request.formData();
        const title = formData.get("title");
        const summary = formData.get("summary");
        const instruction = formData.get("instruction");
        const image = formData.get("image");

        if (!(title && summary && instruction && image)) {
            return NextResponse.json(
                {
                    message: "لطفاً تمام فیلدهای الزامی را ارسال کنید"
                }
                ,
                {
                    status: 400
                }
            );
        }

        if (!(image instanceof File)) {
            return NextResponse.json(
                {
                    message: "فایل ارسال شده، نامعتبر می‌باشد"
                }
                ,
                {
                    status: 400
                }
            );
        }

        const token = cookies().get("foodToken").value;

        const { decodedToken, error } = await checkTokenIsValid(token);

        if (error) {
            if (error.name === "TokenExpiredError") {
                return NextResponse.json(
                    {
                        message: "توکن منقضی شده است!"
                    }
                    ,
                    {
                        status: 401,
                    }
                );
            } else {
                return NextResponse.json(
                    {
                        message: "توکن نامعتبر می‌باشد!"
                    }
                    ,
                    {
                        status: 401,
                    }
                );
            }
        }

        await db.connect();

        const user = await User.findById(decodedToken.sub).lean();

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

        // Write food image
        const imageExtension = image.name.split(".").pop();
        const imageName = `food_${decodedToken.sub}_${Math.random()}.${imageExtension}`;
        const imageDir = path.join(process.cwd(), "public", "foods");
        const imagePath = path.join(imageDir, imageName);
        const imageDatabasePath = `/foods/${imageName}`;

        const fileStream = fs.createWriteStream(imagePath);
        const bufferedAvatar = await image.arrayBuffer();
        fileStream.write(Buffer.from(bufferedAvatar), (err) => {
            if (err) {
                throw new Error("Saving image failed!");
            }
        });
        fileStream.end();

        const newUser = new Food({
            title,
            summary,
            instruction,
            image: imageDatabasePath,
            creator_id: user._id
        });
        await newUser.save();

        revalidatePath("/", "layout");

        return NextResponse.json(
            {}
            ,
            {
                status: 200
            }
        );

    } catch (err) {
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