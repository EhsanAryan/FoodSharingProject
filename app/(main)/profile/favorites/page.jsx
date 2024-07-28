"use client";

import { MainContext } from '@/context/MainContextContainer';
import { foodCategoryOptions } from '@/data/data';
import { base_api_url } from '@/services/httpService';
import { Pagination } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

const Page = () => {
    const { user } = useContext(MainContext);

    const [favorites, setFavorites] = useState(user?.favorites || []);
    const [showfavorites, setShowFavorites] = useState(user?.favorites || []);

    const [searchChar, setSearchChar] = useState("");
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(1);
    const [itemsCount, setItemsCount] = useState(20);

    const router = useRouter();

    const handleSetCurrentPage = (ev, newPage) => {
        setPage(newPage);
    }

    const setShowFavoritesHandler = () => {
        const startIndex = (page - 1) * itemsCount;
        const endIndex = page * itemsCount;
        let filteredFavorites = favorites;
        if (searchChar.trim() && category.trim()) {
            filteredFavorites = favorites.filter(item => item.title.toLowerCase().includes(searchChar.toLowerCase()) && item.category === category);
        } else if (searchChar.trim()) {
            filteredFavorites = favorites.filter(item => item.title.toLowerCase().includes(searchChar.toLowerCase()));
        } else if (category.trim()) {
            filteredFavorites = favorites.filter(item => item.category === category);
        }
        const pagesCnt = filteredFavorites.length === 0 ? 1 : Math.ceil(filteredFavorites.length / itemsCount);
        setPagesCount(pagesCnt);
        const currentFavorites = filteredFavorites.slice(startIndex, endIndex);
        setShowFavorites(currentFavorites);
    }

    const setSearchCharHandler = (ev) => {
        const char = ev.target.value
        setSearchChar(char.trim());
        setPage(1);
    }

    const handleSetCategory = (ev) => {
        const value = ev.target.value;
        setCategory(value);
        setPage(1);
    }

    useEffect(() => {
        if (!user) {
            Alert("خطا!", "در دریافت جزئیات حساب کاربری شما مشکلی رخ داده است!", "error");
            router.back();
        }
    }, [user]);

    useEffect(() => {
        if (page > pagesCount) {
            setPage(1);
        } else {
            setShowFavoritesHandler();
        }
    }, [page, searchChar, category]);

    return (
        <>
            <h1 className="text-primary text-3xl mb-7 text-center font-bold">غذاهای مورد علاقه شما</h1>
            <div
                className={`flex justify-center mb-7`}
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
            {showfavorites.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                    gap-y-8 sm:gap-x-6 px-2 sm:px-1">
                    {showfavorites.map((item, index) => (
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
                <div className="my-12 text-red-500 text-xl md:text-2xl text-center">
                    غذایی برای نمایش موجود نیست!
                </div>
            )}

            {pagesCount > 1 && (
                <div className={`mt-8 w-full
                  flex justify-center items-center children-dir-ltr`}>
                    <Pagination
                        count={pagesCount}
                        page={page}
                        boundaryCount={1}
                        onChange={(ev, newPage) => handleSetCurrentPage(ev, newPage)}
                        color="primary"
                        sx={{
                            direction: "ltr !important",
                            "& .MuiPagination-ul, & .MuiPagination-root": {
                                direction: "ltr !important",
                            },
                            "& .MuiPagination-ul li>:is(button, div)": {
                                color: "white"
                            },
                            "& button.MuiButtonBase-root.MuiPaginationItem-root.Mui-selected:not(.MuiPaginationItem-previousNext)": {
                                backgroundColor: "#343840 !important",
                            }
                        }}
                    />
                </div>
            )}
        </>
    );
}

export default Page;
