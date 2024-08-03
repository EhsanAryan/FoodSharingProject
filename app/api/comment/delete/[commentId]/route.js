import db from "@/utils/db";
import User from "@/models/user";
import Comment from "@/models/comment";
import Food from "@/models/food";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from 'fs';
import path from 'path';
import { checkTokenIsValid } from "@/app/actions/actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

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

        const commentId = context.params.commentId;

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

        const comment = await Comment.findById(commentId).lean();

        if (!comment) {
            return NextResponse.json(
                {
                    message: "کامنت مورد نظر یافت نشد."
                },
                {
                    status: 404,
                }
            );
        }

        if (comment.user.toString() !== user._id.toString() && user.is_admin === 0) {
            return NextResponse.json(
                {
                    message: "شما مجوز حذف این غذا را ندارید"
                },
                {
                    status: 403
                }
            );
        }

        const deletedComment = await Comment.findByIdAndDelete(commentId).lean();

        if (!deletedComment) {
            return NextResponse.json(
                {
                    message: "کامنت مورد نظر یافت نشد."
                },
                {
                    status: 404,
                }
            );
        }

        revalidatePath("/", "layout");

        return NextResponse.json(
            db.convertToObject(deletedComment)
            ,
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

