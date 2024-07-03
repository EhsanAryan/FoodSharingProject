"use client";

import Loading from '@/components/Loading';
import { MainContext } from '@/context/MainContextContainer';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react';

const AuthLayout = ({ children }) => {
    const { isLogin, isLoading } = useContext(MainContext);

    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (isLogin) {
                router.push("/");
            }
        }
    }, [isLogin, isLoading]);

    return (
        <>
            {isLoading ? (
                <Loading
                    size={50}
                    className="my-12"
                />
            ) : !isLogin ? (
                <div className="bg-primary fixed top-0 right-0 w-full h-screen 
                    overflow-x-hidden overflow-y-auto px-4 py-10">
                    {children}
                </div>
            ) : null}
        </>

    );
}

export default AuthLayout;
