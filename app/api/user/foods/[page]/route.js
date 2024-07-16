import db from "@/utils/db";
import User from "@/models/user";
import Food from "@/models/food";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkTokenIsValid } from "@/app/actions/actions";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
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

        const page = Number(context.params.page) || 1;
        const pageSize = Number(new URL(request.url).searchParams.get("page_size")) || 20;
        const search = new URL(request.url).searchParams.get("search") || "";
        const category = new URL(request.url).searchParams.get("category") || "";

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

        const count = await Food.countDocuments((category.trim() && search.trim()) ? {
            creator: decodedToken.sub,
            title: {
                $regex: search.trim(),
                $options: "i"
            },
            category: category.trim()
        } : category.trim() ? {
            creator: decodedToken.sub,
            category: category.trim()
        } : search.trim() ? {
            creator: decodedToken.sub,
            title: {
                $regex: search.trim(),
                $options: "i"
            }
        } : {
            creator: decodedToken.sub
        });
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
            creator: decodedToken.sub,
            title: {
                $regex: search.trim(),
                $options: "i"
            },
            category: category.trim()
        } : category.trim() ? {
            creator: decodedToken.sub,
            category: category.trim()
        } : search.trim() ? {
            creator: decodedToken.sub,
            title: {
                $regex: search.trim(),
                $options: "i"
            }
        } : {
            creator: decodedToken.sub
        })
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