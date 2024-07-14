"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import DrawerNavbar from './DrawerNavbar';
import MenuIcon from '@mui/icons-material/Menu';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { Avatar, Box, IconButton } from '@mui/material';
import { MainContext } from '@/context/MainContextContainer';
import { getUserInfoService } from '@/services/userServices';
import { getCookieValue } from '@/utils/getCookieValue';
import { logoutAction } from '@/app/actions/actions';
import { Alert } from '@/utils/popupWindows';
import axios from 'axios';
import { adminNavbarItems, navbarItems, noAuthNavbarItems } from '@/data/data';
import { base_api_url } from '@/services/httpService';

const Header = () => {
    const {
        user,
        setUser,
        isLogin,
        setIsLogin,
        isAdmin,
        setIsAdmin,
        isLoading,
        setIsLoading,
        forceGetUserInfo
    } = useContext(MainContext);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSetIsMenuOpen = () => setIsMenuOpen(prevValue => !prevValue)

    const pathname = usePathname();

    // Axios response interceptors
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error?.response?.status && error?.response?.data?.message) {
                // if (error.response.status !== 401) {
                //     Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
                // }
                Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
            } else {
                Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
            }
            return Promise.reject(error);
        }
    );

    const logoutHandler = async () => {
        await logoutAction();
        setIsLogin(false);
        setIsAdmin(0);
    }

    const getUserInfoHandler = async () => {
        try {
            const response = await getUserInfoService();
            if (response.status === 200) {
                setUser(response.data);
                setIsLogin(true);
                setIsAdmin(response.data.is_admin);
            }
        } catch (error) {
            if (error?.response?.status === 401) {
                await logoutAction();
                setIsLogin(false);
                setIsAdmin(0);
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        if (getCookieValue("foodToken")) {
            if (getCookieValue("isAdmin")) {
                setIsAdmin(Number(getCookieValue("isAdmin")))
            }
            setIsLogin(true);
            getUserInfoHandler();
        } else {
            setUser(null);
            setIsLogin(false);
            setIsAdmin(0);
            setIsLoading(false);
        }
    }, [isLogin]);

    useEffect(() => {
        if (forceGetUserInfo > 0) {
            getUserInfoHandler();
        }
    }, [forceGetUserInfo]);

    return (
        <header className=" w-full h-[70px] bg-primary px-3 md:px-5 
        flex items-center justify-between">
            <div>
                <Box sx={{
                    display: {
                        xs: "none",
                        md: "flex"
                    },
                    alignItems: "center",
                    gap: "1rem"
                }}>
                    {!isLoading ? isLogin ?
                        isAdmin === 1 ? (
                            adminNavbarItems.map((item, index) => (
                                <Link
                                    key={`link_${Math.random()}_${index}`}
                                    href={item.href}
                                    className={`${item.href === "/profile" ? pathname.startsWith(item.href) ? "navbar-acitve-link" : "navbar-link" :
                                        pathname === item.href ? "navbar-acitve-link" : "navbar-link"
                                        }`}
                                >
                                    {item.text}
                                </Link>
                            ))
                        ) : (
                            navbarItems.map((item, index) => (
                                <Link
                                    key={`link_${Math.random()}_${index}`}
                                    href={item.href}
                                    className={`${item.href === "/profile" ? pathname.startsWith(item.href) ? "navbar-acitve-link" : "navbar-link" :
                                        pathname === item.href ? "navbar-acitve-link" : "navbar-link"
                                        }`}
                                >
                                    {item.text}
                                </Link>
                            ))
                        ) : (
                            noAuthNavbarItems.map((item, index) => (
                                <Link
                                    key={`link_${Math.random()}_${index}`}
                                    href={item.href}
                                    className={`${item.href === "/profile" ? pathname.startsWith(item.href) ? "navbar-acitve-link" : "navbar-link" :
                                        pathname === item.href ? "navbar-acitve-link" : "navbar-link"
                                        }`}
                                >
                                    {item.text}
                                </Link>
                            ))
                        ) : null}
                </Box>
                <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    sx={{
                        display: {
                            xs: "flex",
                            md: "none"
                        },
                        width: 50,
                        height: 50,
                        justifyContent: "center",
                        alignItems: "center"

                    }}
                    onClick={handleSetIsMenuOpen}
                >
                    <MenuIcon />
                </IconButton>
            </div>
            <div className="flex items-center gap-8">
                {(!isLoading && isLogin) ? (
                    <div
                        className="navbar-link cursor-pointer"
                        onClick={logoutHandler}
                    >
                        خروج
                    </div>
                ) : null}
                <Link
                    href="/profile"
                    className="hover-shadow"
                >
                    {!isLoading ? isLogin ? (
                        <Avatar
                            src={user?.avatar || ""}
                            alt="User avatar"
                            sx={{
                                width: "55px",
                                height: "55px",
                                cursor: "pointer"
                            }}
                        />
                    ) : (
                        <FastfoodIcon sx={{ fontSize: "2rem" }} />
                    ) : null}
                </Link>
            </div>
            <DrawerNavbar
                isMenuOpen={isMenuOpen}
                handleSetIsMenuOpen={handleSetIsMenuOpen}
                navbarItems={isLogin ? isAdmin === 1 ? adminNavbarItems : navbarItems : noAuthNavbarItems}
                anchor="right"
                isLoading={isLoading}
            />
        </header>
    );
}

export default Header;
