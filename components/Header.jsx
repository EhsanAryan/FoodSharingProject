"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import DrawerNavbar from './DrawerNavbar';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import MenuIcon from '@mui/icons-material/Menu';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LoginIcon from '@mui/icons-material/Login';
import { Avatar, Box, IconButton } from '@mui/material';
import { MainContext } from '@/context/MainContextContainer';
import { getUserInfoService } from '@/services/userServices';
import { getCookieValue } from '@/utils/getCookieValue';
import { logoutAction } from '@/app/actions/actions';
import HomeIcon from '@mui/icons-material/Home';

const navbarItems = [
    {
        href: "/",
        text: "خانه",
        icon: <HomeIcon />
    },
    {
        href: "/profile",
        text: "حساب کاربری",
        icon: <AccountBoxIcon />
    },
    {
        href: "/sharing-food",
        text: "اشتراک غذا",
        icon: <LocalDiningIcon />
    },
];

const noAuthNavbarItems = [
    {
        href: "/",
        text: "خانه",
        icon: <HomeIcon />
    },
    {
        href: "/login",
        text: "ورود/ثبت نام",
        icon: <LoginIcon />
    },
];

const Header = () => {
    const { user, setUser, isLogin, setIsLogin, isLoading, setIsLoading } = useContext(MainContext);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSetIsMenuOpen = () => setIsMenuOpen(prevValue => !prevValue)

    const pathname = usePathname();

    const logoutHandler = async () => {
        await logoutAction();
        setIsLogin(false);
    }

    const getUserInfoHandler = async () => {
        try {
            const response = await getUserInfoService();
            if (response.status === 200) {
                setUser(response.data);
            }
        } catch (error) {
            if (error?.response?.status === 401) {
                await logoutAction();
                setIsLogin(false);
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        if (getCookieValue("foodToken")) {
            setIsLogin(true);
            getUserInfoHandler();
        } else {
            setUser(null);
            setIsLogin(false);
            setIsLoading(false);
        }
    }, [isLogin]);

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
                    {!isLoading ? isLogin ? (
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
                navbarItems={isLogin ? navbarItems : noAuthNavbarItems}
                anchor="right"
                isLoading={isLoading}
            />
        </header>
    );
}

export default Header;
