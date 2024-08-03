"use client";

import React, { useContext, useEffect, useState } from 'react';
import Details from './Details';
import FoodSlider from './FoodSlider';
import Loading from '@/components/Loading';
import { MainContext } from '@/context/MainContextContainer';
import { getSingleFoodService } from '@/services/foodServices';
import { Alert } from '@/utils/popupWindows';
import { useRouter } from 'next/navigation';
import Favorite from './Favorite';
import Comments from './Comments';

export const dynamic = "force-dynamic";

const Page = ({ params: { foodId } }) => {
    const { isLogin, isLoading, setForceGetUserInfo } = useContext(MainContext);

    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const getFoodDataHandler = async () => {
        setLoading(true)
        try {
            const response = await getSingleFoodService(foodId);
            if (response.status === 200) {
                setFood(response.data);
            }
        } catch (error) {
            if (error?.response?.status && error?.response?.data?.message) {
                if (error.response.status === 404) {
                    setForceGetUserInfo(prevValue => prevValue + 1);
                }
                await Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
                router.back();
            } else {
                await Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
                router.back();
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getFoodDataHandler();
    }, []);

    return (
        <>
            {loading ? (
                <div className="w-full bg-slate-900 rounded-md px-4 md:px-6 py-5 max-w-screen-xl mx-auto">
                    <Loading
                        size={50}
                        className="my-20"
                    />
                </div>
            ) : (
                <>
                    <div className="w-full bg-slate-900 rounded-md px-4 md:px-6 py-5 max-w-screen-xl mx-auto">
                        {food ? (
                            <>
                                <h1 className="mt-2 mb-6 text-3xl sm:text-4xl font-bold text-primary text-center top-appear">
                                    {food.title}
                                </h1>
                                <FoodSlider images={food.images} />
                                <h2 className="mt-7 text-xl sm:text-2xl text-center bottom-appear">
                                    {food.category === "B" ? "پیش غذا" :
                                        food.category === "M" ? "غذای اصلی" :
                                            food.category === "A" ? "دسر" : ""}
                                </h2>
                                <div className="text-sm sm:text-base mt-6 sm:px-4 md:px-8 right-appear">
                                    توضیحات:
                                </div>
                                <div className="sm:text-lg mt-2 px-2 sm:px-6 md:px-10 right-appear break-words">
                                    {food.summary}
                                </div>
                                <div className="text-sm sm:text-base mt-8 sm:px-4 md:px-8 right-appear">
                                    دستور پخت:
                                </div>
                                <div
                                    className="sm:text-lg mt-2 px-2 sm:px-6 md:px-10 right-appear break-words"
                                    dangerouslySetInnerHTML={{
                                        __html: food.instruction.replaceAll("\n", "<br />")
                                    }}
                                ></div>
                                {(!isLoading && isLogin) && (
                                    <Favorite food={food} />
                                )}
                                <div
                                    className={`divider top-appear 
                                    ${(!isLoading && isLogin) ? "my-6" : "mt-14 mb-6"}`}
                                ></div>
                                <Details food={food} />
                            </>
                        ) : null}
                    </div>
                    <Comments
                        food={food}
                    />
                </>
            )}
        </>
    );
}

export default Page;
