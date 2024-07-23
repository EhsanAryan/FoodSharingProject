import db from "@/utils/db";
import User from "@/models/user";
import Food from "@/models/food";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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

        const foodId = context.params.foodId;

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

        const food = await Food.findById(foodId);

        if (!food) {
            return NextResponse.json(
                {
                    message: "غذای مورد نظر یافت نشد."
                },
                {
                    status: 404,
                }
            );
        }

        if (user.favorites.find(item => item.toString() === foodId)) {
            return NextResponse.json(
                {
                    message: "غذای مورد نظر در حال حاضر جزو علاقه مندی‌های شما می‌باشد."
                },
                {
                    status: 400,
                }
            );
        }

        // Update the food (to use save() method to update an existing document, you must not use lean() method when getting the food)
        food.likes += 1;
        await food.save();

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            decodedToken.sub,
            {
                $push: { favorites: foodId }
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
                status: 201
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

export async function DELETE(request, context) {
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

        const foodId = context.params.foodId;

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

        const food = await Food.findById(foodId);

        if (!food) {
            return NextResponse.json(
                {
                    message: "غذای مورد نظر یافت نشد."
                },
                {
                    status: 404,
                }
            );
        }

        // Update the food (to use save() method to update an existing document, you must not use lean() method when getting the food)
        if (food.likes > 0) {
            food.likes -= 1;
            await food.save();
        }

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            decodedToken.sub,
            {
                $pull: { favorites: foodId }
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
                message: "مشکلی از سمت سرور رخ داده است.\nلطفاً چند لحظه بعد مجدداً تلاش کنید."
            }
            ,
            {
                status: 500,
            }
        );
    }
}