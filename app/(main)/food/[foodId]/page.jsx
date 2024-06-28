import Food from '@/models/food';
import User from '@/models/user';
import db from '@/utils/db';
import { Avatar } from '@mui/material';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react';

const getFoodHandler = async (foodId) => {
    await db.connect();

    const food = await Food.findById(foodId).lean();

    if (!food) notFound();

    const foodCreator = await User.findById(food.creator_id).lean();

    if (!foodCreator) notFound();

    const { password, ...foodCreatorData } = db.convertToObject(foodCreator);

    return {
        ...db.convertToObject(food),
        creator: {
            ...foodCreatorData
        }
    };
}

const Page = async ({ params: { foodId } }) => {
    const food = await getFoodHandler(foodId);

    return (
        <div className="w-full bg-slate-900 rounded-md px-4 md:px-6 py-6 max-w-screen-xl mx-auto">
            <div className="relative w-full max-w-[500px] h-[300px] md:h-[350px] mx-auto rounded-xl">
                <Image
                    src={food?.image}
                    alt={food?.title}
                    fill
                    className="object-cover top-appear
                    rounded-xl shadow-lg shadow-gray-700"
                />
            </div>
            <h1 className="mt-7 text-3xl sm:text-4xl font-bold text-primary text-center bottom-appear">
                {food?.title}
            </h1>
            <div className="text-sm sm:text-base mt-6 sm:px-4 md:px-8 right-appear">
                توضیحات:
            </div>
            <div className="text-sm sm:text-base mt-2 px-2 sm:px-6 md:px-10 right-appear">
                {food?.summary}
            </div>
            <div className="text-sm sm:text-base mt-8 sm:px-4 md:px-8 right-appear">
                دستور پخت:
            </div>
            <div
                className="text-sm sm:text-base mt-2 px-2 sm:px-6 md:px-10 right-appear"
                dangerouslySetInnerHTML={{
                    __html: food.instruction ?
                        food.instruction.replaceAll("\n", "<br />")
                        : ""
                }}
            ></div>
            <div className="divider mt-14 mb-6"></div>
            <div className="right-appear flex items-center gap-2 
            sm:px-4 md:px-8">
                <Avatar
                    src={food?.creator?.avatar || ""}
                    alt="Food Creator avatar"
                    sx={{
                        width: "55px",
                        height: "55px",
                    }}
                />
                <div className="flex flex-col">
                    <small>
                        {food?.creator?.username}
                    </small>
                    <small>
                        {`${food?.creator?.first_name || ""} ${food?.creator?.last_name || ""}`}
                    </small>
                </div>
            </div>
        </div>
    );
}

export default Page;
