"use client";

import { logoutAction } from '@/app/actions/actions';
import Loading from '@/components/Loading';
import { MainContext } from '@/context/MainContextContainer';
import { getUserInfoService } from '@/services/userServices';
import { Alert } from '@/utils/popupWindows';
import { notFound, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './Sidebar';

const ProfileLayout = ({ children }) => {
    const { user, setUser, isLogin, setIsLogin, isLoading } = useContext(MainContext);

    const [loading, setLoading] = useState(true);

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
        if (!isLoading) {
            if (!isLogin) {
                notFound();
            } else {
                if (!user) {
                    getUserInfoHandler();
                } else {
                    setLoading(false);
                }
            }
        }
    }, [user, isLogin, isLoading]);

    return (
        <>
            {(loading || isLoading) ? (
                <Loading
                    size={50}
                    className="my-12"
                />
            ) : user ? (
                <div className="absolute top-0 right-0 w-full h-full">
                    <Sidebar />
                    <div className="w-full px-4 md:px-6 lg:px-8 py-8
                    md:absolute md:top-0 md:left-0 md:w-[78%]">
                        <div className="w-full bg-slate-900 rounded-xl 
                        max-w-screen-xl mx-auto px-4 md:px-6 py-6">
                            {children}
                        </div>
                    </div>
                </div>

            ) : null}
        </>
    );
}

export default ProfileLayout;
