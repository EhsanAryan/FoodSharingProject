"use client";

import Loading from '@/components/Loading';
import UserInfoForm from './UserInfoForm';
import UserPasswordForm from './UserPasswordForm';
import { getUserInfoService } from '@/services/userServices';
import { Alert } from '@/utils/popupWindows';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '@/context/MainContextContainer';

const Page = () => {
    const { user, setUser } = useContext(MainContext);

    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("info"); // info, password

    const router = useRouter();

    const getUserInfoHandler = async () => {
        setLoading(true);
        try {
            const response = await getUserInfoService();
            if (response.status === 200) {
                setUser(response.data);
            }
        } catch (error) {
            if (error?.response?.status && error?.response?.data?.message) {
                await Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
                if (error.response.status === 401) {
                    router.push("/login");
                }
            } else {
                Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!user) {
            getUserInfoHandler();
        } else {
            setLoading(false);
        }
    }, [user]);

    return (
        <div>
            {loading ? (
                <Loading
                    size={50}
                    className="mt-12"
                />
            ) : user ? (
                <div className="w-full bg-slate-900 rounded-xl max-w-screen-xl mx-auto">
                    <div className="w-full bg-slate-800 flex gap-2 items-center 
                    rounded-t-xl py-6">
                        <div
                            className="flex-1 flex justify-center items-center 
                            text-xl sm:text-2xl md:text-3xl"
                        >
                            <span
                                className={`px-4 pb-1 cursor-pointer text-primary font-bold
                                 ${tab === "info" ? "border-b-4 border-[#f16d01]" : ""}`}
                                onClick={() => setTab("info")}
                            >
                                اطلاعات
                            </span>
                        </div>
                        <div
                            className="flex-1 flex justify-center items-center 
                            text-xl sm:text-2xl md:text-3xl"
                        >
                            <span
                                className={`px-4 pb-1 cursor-pointer text-primary font-bold
                                ${tab === "password" ? "border-b-4 border-[#f16d01]" : ""}`}
                                onClick={() => setTab("password")}

                            >
                                کلمه عبور
                            </span>
                        </div>
                    </div>
                    <div className="px-4 md:px-8 pt-8 pb-6">
                        {tab === "info" ? (
                            <UserInfoForm />
                        ) : (
                            <UserPasswordForm />
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Page;
