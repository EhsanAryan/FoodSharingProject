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
        const avatar = formData.get("avatar");

        if (!avatar || !(avatar instanceof File)) {
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

        // Delete the avatar of user if exists
        const user = await User.findById(decodedToken.sub).lean();
        if (user) {
            if (user.avatar) {
                const existAvatarPath = path.join(process.cwd(), "public", user.avatar);
                if (fs.existsSync(existAvatarPath)) {
                    fs.unlinkSync(existAvatarPath);
                }
            }
        } else {
            return NextResponse.json(
                {
                    message: "کاربر مورد نظر یافت نشد."
                },
                {
                    status: 404
                }
            );
        }

        // Write new avatar
        const avatarExtension = avatar.name.split(".").pop();
        const avatarName = `avatar_${decodedToken.sub}_${Math.random()}.${avatarExtension}`;
        const avatarDir = path.join(process.cwd(), "public", "avatars");
        const avatarPath = path.join(avatarDir, avatarName);
        const avatarDatabasePath = `/avatars/${avatarName}`;

        const fileStream = fs.createWriteStream(avatarPath);
        const bufferedAvatar = await avatar.arrayBuffer();
        fileStream.write(Buffer.from(bufferedAvatar), (err) => {
            if (err) {
                throw new Error("Saving image failed!");
            }
        });
        fileStream.end();

        // Update new avatar path of user
        const updatedUser = await User.findByIdAndUpdate(
            decodedToken.sub,
            { avatar: avatarDatabasePath },
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

        const { password, ...updatedUserData } = db.convertToObject(updatedUser);

        revalidatePath("/", "layout");

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
                message: "مشکلی از سمت سرور رخ داده است.\nلطفاً چند لحظه بعد مجدداً تلاش کنید."
            }
            ,
            {
                status: 500,
            }
        );
    }
}