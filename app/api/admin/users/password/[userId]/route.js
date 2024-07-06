import User from "@/models/user";
import db from "@/utils/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { checkTokenIsValid } from "@/app/actions/actions";
import bcrypt from "bcryptjs";
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

        if (!(data.new_password && data.confirm_password)) {
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
        
        if (data.new_password.trim() !== data.confirm_password.trim()) {
            return NextResponse.json(
                {
                    message: "رمز عبور جدید با تکرار آن تطابق ندارد."
                }
                ,
                {
                    status: 400,
                }
            );
        }

        const newHashPassword = bcrypt.hashSync(data.new_password.trim());

        // Update new password of user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                password: newHashPassword
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

