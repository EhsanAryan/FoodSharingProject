import db from "@/utils/db";
import Food from "@/models/food";
import { NextResponse } from "next/server";
import User from "@/models/user";
import { cookies } from "next/headers";
import fs from 'fs';
import path from 'path';
import { checkTokenIsValid } from "@/app/actions/actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
    try {
        const foodId = context.params.foodId;

        await db.connect();

        const food = await Food.findById(foodId).populate("creator").lean();

        if (!(food && food.creator)) {
            return NextResponse.json(
                {
                    message: "غذای مورد نظر یافت نشد."
                },
                {
                    status: 404,
                }
            );
        }

        food.creator = db.convertToObject(food.creator);
        delete food.creator.password;

        return NextResponse.json(
            db.convertToObject(food)
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

        const food = await Food.findById(foodId).lean();

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

        if (food.creator.toString() !== user._id.toString() && !user.is_admin) {
            return NextResponse.json(
                {
                    message: "شما مجوز تغییر اطلاعات این غذا را ندارید"
                },
                {
                    status: 403
                }
            );
        }

        // Delete the food image if exists
        const existImagePath = path.join(process.cwd(), "public", food.image);
        if (fs.existsSync(existImagePath)) {
            fs.unlinkSync(existImagePath);
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

        // Update the food
        const updatedFood = await Food.findByIdAndUpdate(
            foodId,
            {
                title,
                summary,
                instruction,
                image: imageDatabasePath,
            },
            { new: true } // Return the updated document
        ).lean();

        if (!updatedFood) {
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
            db.convertToObject(updatedFood)
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

        const food = await Food.findById(foodId).lean();

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
        if (food.creator.toString() !== user._id.toString() && !user.is_admin) {
            return NextResponse.json(
                {
                    message: "شما مجوز حذف این غذا را ندارید"
                },
                {
                    status: 403
                }
            );
        }

        const deletedFood = await Food.findByIdAndDelete(foodId).lean();

        if (!deletedFood) {
            return NextResponse.json(
                {
                    message: "غذای مورد نظر یافت نشد."
                },
                {
                    status: 404,
                }
            );
        }

        revalidatePath("/", "layout");

        return NextResponse.json(
            db.convertToObject(deletedFood)
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

