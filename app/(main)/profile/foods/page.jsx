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
import { foodCategoryOptions } from '@/data/data';
import { base_api_url } from '@/services/httpService';
import { Pagination } from '@mui/material';


const Page = () => {
    const { setIsLogin, isLogin, setIsAdmin } = useContext(MainContext);

    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(1);
    const [searchChar, setSearchChar] = useState("");
    const [category, setCategory] = useState("");

    const router = useRouter();

    const inputRef = useRef(null);

    let searchTimeout;

    const handleSetCurrentPage = (ev, newPage) => {
        setPage(newPage);
    }

    const getUserFoodsHandler = async () => {
        setLoading(true);
        try {
            const response = await getUserFoodsService(page, 20, searchChar, category);
            if (response.status === 200) {
                setFoods(response.data.data);
                setPagesCount(response.data.pagesCount);
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

    const setSearchCharHandler = (ev) => {
        const char = ev.target.value
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
        if (isLogin) getUserFoodsHandler();
    }, [page, searchChar, category]);

    return (
        <>
            <h1 className="text-primary text-3xl mb-3 text-center font-bold">غذاهای شما</h1>
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
                    ref={inputRef}
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
                                    src={item.images[0]?.startsWith("blob") ? item.images[0] : `${base_api_url}${item.images[0]}`}
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

            {pagesCount > 1 && (
                <div className={`mt-8 w-full
                  flex justify-center items-center children-dir-ltr
                  ${loading ? "pointer-events-none" : ""}`}>
                    <Pagination
                        count={pagesCount}
                        page={page}
                        boundaryCount={1}
                        onChange={(ev, newPage) => handleSetCurrentPage(ev, newPage)}
                        color="primary"
                        sx={{
                            direction: "ltr !important",
                            "& .MuiPagination-ul": {
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
