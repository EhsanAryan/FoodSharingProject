"use client";

import { getFoodsService } from '@/services/foodServices';
import { Alert } from '@/utils/popupWindows';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/components/Loading';
import { foodCategoryOptions } from '@/data/data';
import { base_api_url } from '@/services/httpService';

const HomeUser = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(1);
    const [searchChar, setSearchChar] = useState("");
    const [category, setCategory] = useState("");

    let searchTimeout;

    const getFoodsHandler = async () => {
        setLoading(true);
        let prevScrollTop = 0;
        if (document.querySelector(".main-content-section")) {
            prevScrollTop = document.querySelector(".main-content-section").scrollTop;
        }
        try {
            const response = await getFoodsService(page, 16, searchChar, category);
            if (response.status === 200) {
                if (page === 1) {
                    setFoods(response.data.data);
                } else {
                    setFoods(prevValue => [...prevValue, ...response.data.data]);
                }
                setPagesCount(response.data.pagesCount);
                setTimeout(() => {
                    if (page > 1 && document.querySelector(".main-content-section")) {
                        document.querySelector(".main-content-section").scrollTop = prevScrollTop;
                    }
                }, 50);
            }
        } catch (error) {
            if (error?.response?.status && error?.response?.data?.message) {
                Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
            } else {
                Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
            }
        } finally {
            setLoading(false);
        }
    }

    const setSearchCharHandler = (ev) => {
        const char = ev.target.value;
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            setSearchChar(char.trim());
            setPage(1);
        }, 1000);
    }

    const handleSetCategory = (ev) => {
        const value = ev.target.value;
        setCategory(value);
        setPage(1);
    }

    useEffect(() => {
        getFoodsHandler();
    }, [page, searchChar, category])

    return (
        <>
            <h1 className="text-primary mb-3 text-center text-4xl">غذاها</h1>
            <div
                className={`flex justify-center mb-7 
                ${loading ? "pointer-events-none" : ""}`}
            >
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="نام غذا را وارد کنید"
                    className="bg-slate-800 w-full max-w-sm px-3 py-1.5 outline-none
                    rounded-s-[20px] placeholder:text-sm disabled:opacity-60"
                    onChange={(ev) => setSearchCharHandler(ev)}
                />
                <select
                    value={category}
                    onChange={(ev) => handleSetCategory(ev)}
                    className="bg-slate-700 px-3 py-1.5 outline-none
                    max-w-[140px] border-none rounded-e-[20px]"
                >
                    {foodCategoryOptions.map(opt => (
                        <option
                            key={`status_${opt.value}`}
                            value={opt.value}
                        >
                            {opt.text}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                {(loading && page === 1 && foods.length === 0) ? (
                    <Loading
                        size={50}
                        className="my-12"
                    />
                ) : foods.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
						gap-y-8 sm:gap-x-6">
                        {foods.map((item, index) => (
                            <div
                                key={`food_${item._id}_${index}`}
                                className={`bg-slate-800 rounded-lg overflow-hidden
							    normal-transition hover:translate-y-[-10px] flex flex-col
                                ${item.images.length > 1 ? "food-cart" : ""}`}
                            >
                                <div className="relative w-full h-[300px]">
                                    <Image
                                        src={item.images[0]?.startsWith("blob") ? item.images[0] : `${base_api_url}${item.images[0]}`}
                                        alt={item.title}
                                        fill
                                        className="object-cover rounded-t-lg slow-transition"
                                        placeholder="blur"
                                        blurDataURL="/images/svg/loader.svg"
                                        quality={70}
                                    />
                                    {item.images.length > 1 && (
                                        <Image
                                            src={item.images[1]?.startsWith("blob") ? item.images[1] : `${base_api_url}${item.images[1]}`}
                                            alt={item.title}
                                            fill
                                            className="object-cover z-[1] rounded-t-lg slow-transition"
                                            placeholder="blur"
                                            blurDataURL="/images/svg/loader.svg"
                                            quality={70}
                                        />
                                    )}
                                </div>
                                <div className="px-3 pt-3 pb-6 flex-1 flex flex-col">
                                    <h4 className="text-xl text-center">{item.title}</h4>
                                    <div className="mt-2 mb-8 break-words">
                                        {item.summary}
                                    </div>
                                    <div className="mt-auto">
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
                    <div className="my-12 text-red-500 text-xl sm:text-2xl md:text-2xl text-center">
                        غذایی برای نمایش موجود نیست!
                    </div>
                )}

                <div
                    className="mt-12 w-full flex justify-center items-center"
                >
                    <button
                        className={`w-full max-w-[170px] blue-btn px-4 py-3 rounded-lg
                        ${loading ? "pointer-events-none" : ""}
                        ${(pagesCount === 1 || page >= pagesCount || foods.length === 0) ?
                                "opacity-0 pointer-events-none" :
                                ""}`}
                        onClick={() => setPage(prevValue => prevValue + 1)}
                    >
                        {loading ? (
                            <Loading
                                size={30}
                                color="#fff"
                                noText
                            />
                        ) : (
                            "مشاهده بیشتر"
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}

export default HomeUser;
