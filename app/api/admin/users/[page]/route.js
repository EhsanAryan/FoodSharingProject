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

        if (user.is_admin === 0) {
            return NextResponse.json(
                {
                    message: "شما مجوز دسترسی به این اطلاعات را ندارید"
                },
                {
                    status: 403
                }
            );
        }

        const pageSize = Number(new URL(request.url).searchParams.get("page_size")) || 20;
        const page = Number(context.params.page) || 1;
        const search = new URL(request.url).searchParams.get("search") || "";

        await db.connect();

        const count = await User.countDocuments(search.trim() ? {
            username: {
                $regex: search.trim(),
                $options: "i"
            },
            is_admin: 0
        } : {
            is_admin: 0
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

        const users = await User.find(search.trim() ? {
            username: {
                $regex: search.trim(),
                $options: "i"
            },
            is_admin: 0
        } : {
            is_admin: 0
        })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();


        return NextResponse.json(
            {
                pagesCount,
                data: users.map(item => db.convertToObject(item))
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

