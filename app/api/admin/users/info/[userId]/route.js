import User from "@/models/user";
import Comment from "@/models/comment";
import Food from "@/models/food";
import db from "@/utils/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { checkTokenIsValid } from "@/app/actions/actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function PUT(request, context) {
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

        const userId = context.params.userId;

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

        const me = await User.findById(decodedToken.sub).lean();

        if (!me) {
            return NextResponse.json(
                {
                    message: "اطلاعات حساب کاربری شما یافت نشد."
                },
                {
                    status: 404
                }
            );
        }

        if (me.is_admin === 0) {
            return NextResponse.json(
                {
                    message: "شما مجوز تغییر رمز عبور این کاربر را ندارید"
                },
                {
                    status: 403
                }
            );
        }

        const user = await User.findOne({
            username: data.username
        }).lean();

        if (user && user._id.toString() !== userId) {
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
            userId,
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
                message: "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید."
            }
            ,
            {
                status: 500,
            }
        );
    }
}
