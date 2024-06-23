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
import { Box, IconButton } from '@mui/material';
import { MainContext } from '@/context/MainContextContainer';
import { getUserInfoService } from '@/services/userServices';
import { getCookieValue } from '@/utils/getCookieValue';



const navbarItems = [
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
        href: "/login",
        text: "ورود/ثبت نام",
        icon: <LoginIcon />
    },
];

const Header = () => {
    const { setUser } = useContext(MainContext);

    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [navItems, setNavItems] = useState(noAuthNavbarItems);

    const handleSetIsMenuOpen = () => setIsMenuOpen(prevValue => !prevValue)

    const pathname = usePathname();

    const getUserInfoHandler = async () => {
        try {
            const response = await getUserInfoService();
            if (response.status === 200) {
                setUser(response.data);
            }
        } catch (error) {
            // if (error?.response?.status && error?.response?.data?.message) {
            //     await Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
            //     if (error.response.status === 401) {
            //         router.push("/login");
            //     }
            // } else {
            //     Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
            // }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        if (getCookieValue("userId")) {
            setNavItems(navbarItems);
            getUserInfoHandler();
        } else {
            setNavItems(noAuthNavbarItems);
            setLoading(false);
        }
    }, [])

    return (
        <header className=" w-full h-[60px] bg-primary px-3 md:px-5 
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
                    {!loading ? (
                        navItems.map((item, index) => (
                            <Link
                                key={`link_${Math.random()}_${index}`}
                                href={item.href}
                                className={`${pathname === item.href ? "navbar-acitve-link" : "navbar-link"}`}
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
            <div>
                <Link
                    href="/"
                    className="hover-shadow"
                >
                    <FastfoodIcon sx={{ fontSize: "2rem" }} />
                </Link>
            </div>
            <DrawerNavbar
                isMenuOpen={isMenuOpen}
                handleSetIsMenuOpen={handleSetIsMenuOpen}
                navbarItems={navItems}
                anchor="right"
            />
        </header>
    );
}

export default Header;
