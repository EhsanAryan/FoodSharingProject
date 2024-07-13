// I don't use Food model in this file, but it is necessary to recognize the foodSchema, because it's the first API has been called in the project (GET /api/user/info)
import Food from "@/models/food";
import User from "@/models/user";
import db from "@/utils/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { checkTokenIsValid } from "@/app/actions/actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(request) {
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

        const user = await User.findById(decodedToken.sub).populate("favorites").lean();

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
        
        for (let item of user.favorites) {
            item = db.convertToObject(item);
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

export async function PUT(request) {
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

        const data = await request.json();

        if (!(data.username && data.first_name && data.last_name)) {
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

        const user = await User.findOne({
            username: data.username
        }).lean();

        if (user && user._id.toString() !== decodedToken.sub) {
            return NextResponse.json(
                {
                    message: "نام کاربری وارد شده در حال حاضر وجود دارد.\nلطفاً نام کاربری دیگری را انتخاب نمایید."
                }
                ,
                {
                    status: 400,
                }
            );
        }

        // Update new data of user
        const updatedUser = await User.findByIdAndUpdate(
            decodedToken.sub,
            {
                username: data.username,
                first_name: data.first_name,
                last_name: data.last_name
            },
            { new: true } // Return the updated document
        ).lean();

        if (!updatedUser) {
            return NextResponse.json(
                {
                    message: "کاربر مورد نظر یافت نشد."
                },
                {
                    status: 404
                }
            );
        }

        revalidatePath("/", "layout");

        const { password, ...updatedUserData } = db.convertToObject(updatedUser);

        return NextResponse.json(
            updatedUserData
            ,
            {
                status: 200
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

