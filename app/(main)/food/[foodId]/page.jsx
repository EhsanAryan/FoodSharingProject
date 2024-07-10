import { checkIsOwner } from '@/app/actions/actions';
import Food from '@/models/food';
import db from '@/utils/db';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react';
import Details from './Details';
import CustomSlider from '@/components/CustomSlider';
import FoodSlider from '../FoodSlider';

export const dynamic = "force-dynamic";

const getFoodHandler = async (foodId) => {
    try {
        await db.connect();

        const food = await Food.findById(foodId).populate("creator").lean();

        if (!(food && food?.creator)) return null;

        food.creator = db.convertToObject(food.creator);
        delete food.creator.password;

        let is_owner = await checkIsOwner(food.creator._id.toString());

        return {
            ...db.convertToObject(food),
            is_owner
        };
    } catch (error) {
        throw new Error("در دریافت جزئیات غذا خطایی رخ داده است.");
    }
}

const Page = async ({ params: { foodId } }) => {
    const food = await getFoodHandler(foodId);

    if (food === null) notFound();

    return (
        <div className="w-full bg-slate-900 rounded-md px-4 md:px-6 py-5 max-w-screen-xl mx-auto">
            <h1 className="mt-2 mb-6 text-3xl sm:text-4xl font-bold text-primary text-center yop-appear">
                {food?.title}
            </h1>
            {food && (
                <FoodSlider images={food.images} />
            )}
            {/* <div className="relative w-full max-w-[500px] h-[300px] md:h-[350px] mx-auto rounded-xl">
                <Image
                    src={food?.images[0]}
                    alt={food?.title}
                    fill
                    className="object-cover top-appear
                    rounded-xl shadow-lg shadow-gray-700"
                />
            </div> */}
            <h2 className="mt-7 text-xl sm:text-2xl text-center bottom-appear">
                {food?.category === "B" ? "پیش غذا" :
                    food?.category === "M" ? "غذای اصلی" :
                        food?.category === "A" ? "دسر" : ""}
            </h2>
            <div className="text-sm sm:text-base mt-6 sm:px-4 md:px-8 right-appear">
                توضیحات:
            </div>
            <div className="sm:text-lg mt-2 px-2 sm:px-6 md:px-10 right-appear break-words">
                {food?.summary}
            </div>
            <div className="text-sm sm:text-base mt-8 sm:px-4 md:px-8 right-appear">
                دستور پخت:
            </div>
            <div
                className="sm:text-lg mt-2 px-2 sm:px-6 md:px-10 right-appear break-words"
                dangerouslySetInnerHTML={{
                    __html: food?.instruction ?
                        food.instruction.replaceAll("\n", "<br />")
                        : ""
                }}
            ></div>
            {food ? (
                <>
                    <div className="divider mt-14 mb-6 top-appear"></div>
                    <Details food={food} />
                </>
            ) : null}
        </div>
    );
}

export default Page;
