import User from "@/models/user";
import db from "@/utils/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export const dynamic = "force-dynamic";

export async function POST(request) {
    try {
        if (!(cookies().has("userId") && cookies().get("userId")?.value)) {
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

        const userId = cookies().get("userId").value;

        await db.connect();

        // Delete the avatar of user if exists
        const user = await User.findById(userId).lean();
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
        const avatarName = `avatar_${userId}_${Math.random()}.${avatarExtension}`;
        const avatarDir = path.join(process.cwd(), "public", "avatars");
        const avatarPath = path.join(avatarDir, avatarName);
        const avatarDatabasePath = `/avatars/${avatarName}`;

        const fileStream = fs.createWriteStream(avatarPath);
        const bufferedAvatar = await avatar.arrayBuffer();
        fileStream.write(Buffer.from(bufferedAvatar), (error) => {
            if (error) {
                throw new Error("Saving image failed!");
            }
        });
        fileStream.end();

        // Update new avatar path of user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatar: avatarDatabasePath },
            { new: true } // Return the updated document
        );

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

        return NextResponse.json(
            db.convertToObject(updatedUser)
            ,
            {
                status: 200
            }
        );

    } catch (error) {
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