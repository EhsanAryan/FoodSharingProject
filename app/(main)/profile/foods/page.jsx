"use client";

import { logoutAction } from '@/app/actions/actions';
import Loading from '@/components/Loading';
import { MainContext } from '@/context/MainContextContainer';
import { getUserFoodsService } from '@/services/userServices';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

const Page = () => {
    const { setIsLogin } = useContext(MainContext);

    const [loading, setLoading] = useState(true);
    const [foods, setFoods] = useState([]);

    const router = useRouter();

    const getUserFoodsHandler = async () => {
        setLoading(true);
        try {
            const response = await getUserFoodsService();
            if (response.status === 200) {
                setFoods(response.data);
            }
        } catch (error) {
            if (error?.response?.status && error?.response?.data?.message) {
                await Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
                if (error.response.status === 401) {
                    await logoutAction();
                    setIsLogin(false);
                    notFound();
                } else {
                    router.back();
                }
            } else {
                await Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
                router.back();
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserFoodsHandler();
    }, []);

    return (
        <>
            <h1 className="text-primary text-2xl text-center font-bold">غذاهای شما</h1>
            {loading ? (
                <Loading
                    size={40}
                    className="my-14"
                />
            ) : (
                <div className="mt-6 mb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                    gap-y-8 sm:gap-x-6 px-2 sm:px-1">
                    {foods.map((item, index) => (
                        <div
                            key={`food_${item._id}_${index}`}
                            className="bg-slate-800 rounded-lg overflow-hidden
                                normal-transition hover:translate-y-[-10px]"
                        >
                            <div className="relative w-full h-[300px]">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="px-3 pt-3 pb-6">
                                <h4 className="text-xl text-center">{item.title}</h4>
                                <div className="mt-2 mb-8">
                                    {item.summary}
                                </div>
                                <div>
                                    <Link
                                        href={`/food/${item._id}`}
                                        className="bg-primary px-4 py-2 rounded-lg box-hoverable"
                                    >
                                        مشاهده جزئیات
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Page;
