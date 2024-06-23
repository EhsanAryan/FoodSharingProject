import Food from '@/models/food';
import db from '@/utils/db';
import Image from 'next/image';
import React from 'react';

const getFoodHandler = async (foodId) => {
    db.connect();

    const food = await Food.findById(foodId).lean();

    return db.convertToObject(food);
}

const Page = async ({ params: { foodId } }) => {
    const food = await getFoodHandler(foodId);

    return (
        <div className="w-full bg-slate-900 rounded-md px-4 py-6 max-w-screen-xl mx-auto">
            <div className="relative w-full max-w-[500px] h-[300px] md:h-[350px] mx-auto rounded-xl">
                <Image
                    src={food?.image}
                    alt={food?.name}
                    fill
                    className="object-cover appear
                    rounded-xl shadow-lg shadow-gray-700"
                />
            </div>
            <h1 className="mt-7 text-3xl sm:text-4xl font-bold text-primary text-center left-appear">
                {food?.name}
            </h1>
            <div className="text-sm sm:text-base mt-6 sm:px-4 md:px-8">
                توضیحات:
            </div>
            <div className="text-sm sm:text-base mt-2 right-appear px-2 sm:px-6 md:px-10">
                {food?.summary}
            </div>
            <div className="text-sm sm:text-base mt-8 sm:px-4 md:px-8">
                دستور پخت:
            </div>
            <div
                className="text-sm sm:text-base mt-2 right-appear px-2 sm:px-6 md:px-10"
                dangerouslySetInnerHTML={{
                    __html: food.instruction ?
                        food.instruction.replaceAll("\n", "<br />")
                        : ""
                }}
            ></div>
        </div>
    );
}

export default Page;
