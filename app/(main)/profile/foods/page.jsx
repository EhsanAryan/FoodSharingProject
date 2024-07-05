"use client";

import { logoutAction } from '@/app/actions/actions';
import Loading from '@/components/Loading';
import { MainContext } from '@/context/MainContextContainer';
import { getUserFoodsService } from '@/services/userServices';
import { Alert } from '@/utils/popupWindows';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';

const Page = () => {
    const { setIsLogin, isLogin, setIsAdmin } = useContext(MainContext);

    const [loading, setLoading] = useState(true);
    const [foods, setFoods] = useState([]);
    const [searchChar, setSearchChar] = useState("");

    const router = useRouter();

    const inputRef = useRef(null);

    let searchTimeout;

    const getUserFoodsHandler = async () => {
        setLoading(true);
        try {
            const response = await getUserFoodsService(searchChar);
            if (response.status === 200) {
                setFoods(response.data);
                setTimeout(() => {
                    inputRef?.current?.focus();
                }, 50);
            }
        } catch (error) {
            if (error?.response?.status && error?.response?.data?.message) {
                await Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
                if (error.response.status === 401) {
                    await logoutAction();
                    setIsLogin(false);
                    setIsAdmin(0);
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

    const setSearchCharHandler = (char) => {
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            setSearchChar(char.trim());
        }, 1000);
    }

    useEffect(() => {
        if(isLogin) getUserFoodsHandler();
    }, [searchChar]);

    return (
        <>
            <h1 className="text-primary text-3xl mb-3 text-center font-bold">غذاهای شما</h1>
            <div className="text-center mb-7">
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="نام غذا را وارد کنید"
                    className="bg-slate-800 w-full max-w-sm px-3 py-1.5 outline-none
                    rounded-[20px] placeholder:text-sm disabled:opacity-60"
                    onChange={(ev) => setSearchCharHandler(ev.target.value)}
                    ref={inputRef}
                    disabled={loading}
                />
            </div>
            {loading ? (
                <Loading
                    size={40}
                    className="my-14"
                />
            ) : foods.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
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
            ) : (
                <div className="my-12 text-red-500 text-2xl md:text-3xl text-center">
                    غذایی برای نمایش موجود نیست!
                </div>
            )}
        </>
    );
}

export default Page;
