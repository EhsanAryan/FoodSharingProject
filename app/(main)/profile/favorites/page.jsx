"use client";

import { MainContext } from '@/context/MainContextContainer';
import { base_api_url } from '@/services/httpService';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react';

const Page = () => {
    const { user } = useContext(MainContext);

    useEffect(() => {
        if (!user) {
            Alert("خطا!", "در دریافت جزئیات حساب کاربری شما مشکلی رخ داده است!", "error");
            router.back();
        }
    }, [user]);

    return (
        <>
            <h1 className="text-primary text-3xl mb-7 text-center font-bold">غذاهای مورد علاقه شما</h1>
            {user.favorites.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                    gap-y-8 sm:gap-x-6 px-2 sm:px-1">
                    {user.favorites.map((item, index) => (
                        <div
                            key={`food_${item._id}_${index}`}
                            className="bg-slate-800 rounded-lg overflow-hidden
                            normal-transition hover:translate-y-[-10px]"
                        >
                            <div className="relative w-full h-[300px]">
                                <Image
                                    src={item.images[0]?.startsWith("blob") ? item.images[0] : `${base_api_url}/${item.images[0]}`}
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
                                        className="px-4 py-2 rounded-lg yellow-btn"
                                    >
                                        مشاهده جزئیات
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="my-12 text-red-500 text-xl md:text-2xl text-center">
                    غذایی برای نمایش موجود نیست!
                </div>
            )}
        </>
    );
}

export default Page;
