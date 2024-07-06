"use client";

import Loading from '@/components/Loading';
import { MainContext } from '@/context/MainContextContainer';
import { notFound } from 'next/navigation';
import React, { useContext, useEffect } from 'react';

const AdminLayout = ({ children }) => {
    const { isLogin, isAdmin, isLoading } = useContext(MainContext);

    useEffect(() => {
        if (!isLoading) {
            if (!(isLogin && isAdmin === 1)) {
                notFound();
            }
        }
    }, [isLogin, isAdmin, isLoading]);

    return (
        <>
             {isLoading ? (
                <Loading
                    size={50}
                    className="my-12"
                />
            ) : (isLogin && isAdmin === 1) ? (
                <>
                    {children}
                </>
            ) : null}
        </>
    );
}

export default AdminLayout;
