"use client";

import Loading from '@/components/Loading';
import ModalContainerWithoutHeader from '@/components/ModalContainerWithoutHeader';
import { foodCategoryOptions } from '@/data/data';
import { getFoodsOfUserService } from '@/services/foodServices';
import { base_api_url } from '@/services/httpService';
import { getSingleUserService } from '@/services/userServices';
import { Alert } from '@/utils/popupWindows';
import { Avatar, Pagination } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const Page = ({ params: { userId } }) => {
    const [loading, setLoading] = useState(true);
    const [foodLoading, setFoodLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [userFoods, setUserFoods] = useState([]);

    const [page, setPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(1);
    const [searchChar, setSearchChar] = useState("");
    const [category, setCategory] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const [modalImagePath, setModalImagePath] = useState("");

    const inputRef = useRef(null);

    const router = useRouter();

    let searchTimeout;

    const handleSetCurrentPage = (ev, newPage) => {
        setPage(newPage);
    }

    const getUserDataHandler = async () => {
        setLoading(true);
        try {
            const response = await getSingleUserService(userId);
            if (response.status === 200) {
                setUserData(response.data);
            }
        } catch (error) {
            if (error?.response?.status && error?.response?.data?.message) {
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

    const getUserFoodsHandler = async () => {
        setFoodLoading(true);
        try {
            const response = await getFoodsOfUserService(userId, page, 20, searchChar, category);
            if (response.status === 200) {
                setUserFoods(response.data.data);
                setPagesCount(response.data.pagesCount);
                setTimeout(() => {
                    inputRef?.current?.focus();
                }, 50);
            }
        } catch (error) {
            if (error?.response?.status && error?.response?.data?.message) {
                await Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
                router.back();
            } else {
                await Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
                router.back();
            }
        } finally {
            setFoodLoading(false);
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
        getUserDataHandler();
    }, []);

    useEffect(() => {
        getUserFoodsHandler();
    }, [page, searchChar, category]);

    return (
        <div className="w-full bg-slate-900 rounded-md px-4 md:px-6 py-6">
            {loading ? (
                <Loading
                    size={50}
                    className="my-20"
                />
            ) : userData ? (
                <>
                    <div className="w-full flex flex-col justify-center items-center gap-5 top-appear">
                        <Avatar
                            src={userData?.avatar || ""}
                            alt="Food Creator avatar"
                            sx={{
                                width: "100px",
                                height: "100px",
                                cursor: userData.avatar ? "pointer" : "auto"
                            }}
                            onClick={userData.avatar ? () => {
                                setModalImagePath(userData.avatar);
                                setIsOpen(true);
                            } : () => { }}
                        />
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="text-xl">
                                {userData.username}
                            </span>
                            <span>
                                {`${userData.first_name || ""} ${userData.last_name || ""}`}
                            </span>
                        </div>
                    </div>
                    <div className="divider top-appear my-6"></div>
                    <div className="w-full px-2 sm:px-4 bottom-appear">
                        <h1 className="mb-6 text-2xl sm:text-3xl font-bold text-primary text-center">
                            غذاهای کاربر
                        </h1>
                        <div
                            className={`flex justify-center mb-7 
                            ${foodLoading ? "pointer-events-none" : ""}`}
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
                        <div>
                            {foodLoading ? (
                                <Loading
                                    size={50}
                                    className="my-24"
                                />
                            ) : userFoods.length ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
                                lg:grid-cols-4 gap-y-8 sm:gap-x-6">
                                    {userFoods.map((item, index) => (
                                        <div
                                            key={`food_${item._id}_${index}`}
                                            className="bg-slate-800 rounded-lg overflow-hidden
							                normal-transition hover:translate-y-[-10px] flex flex-col"
                                        >
                                            <div className="relative w-full h-[300px]">
                                                <Image
                                                    src={item.images[0]?.startsWith("blob") ? item.images[0] : `${base_api_url}${item.images[0]}`}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                    placeholder="blur"
                                                    blurDataURL="/images/svg/loader.svg"
                                                />
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
                        </div>

                        {pagesCount > 1 && (
                            <div className={`mt-8 w-full
                            flex justify-center items-center children-dir-ltr
                            ${foodLoading ? "pointer-events-none" : ""}`}>
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
                    </div>
                </>
            ) : null}

            {/* Image modal */}
            <ModalContainerWithoutHeader
                isOpen={isOpen && modalImagePath}
                setIsOpen={setIsOpen}
                blur
                className="bg-transparent text-white rounded-full w-[200px] h-[200px] 
                sm:w-[400px] sm:h-[400px]"
            >
                <Image
                    src={modalImagePath?.startsWith("blob") ? modalImagePath : `${base_api_url}${modalImagePath}`}
                    alt="Modal Image"
                    className="rounded-full object-cover"
                    fill
                    placeholder="blur"
                    blurDataURL="/images/svg/loader.svg"
                />
            </ModalContainerWithoutHeader>
        </div>
    );
}

export default Page;
