"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const profileSections = [
    {
        href: "/profile",
        title: "ویرایش اطلاعات"
    },
    {
        href: "/profile/password",
        title: "تغییر رمز عبور"
    },
    {
        href: "/profile/foods",
        title: "غذاها"
    },
];

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <div className="bg-slate-800 w-full
        md:fixed md:top-[70px] md:right-0 md:h-full md:w-[22%] 
        md:overflow-x-hidden md:overflow-y-auto md:pb-[70px]">
            {/* md:absolute md:top-0 md:right-0 md:h-full md:w-[22%]"> */}
                {profileSections.map((item, index) => (
                    <Link
                        key={`profile_section_${index}`}
                        href={item.href}
                        className={`w-full block px-2 py-3 border-b-2 border-slate-900
                        hover:bg-slate-900 
                        ${pathname === item.href ? "bg-slate-900" : ""}`}
                    >
                        {item.title}
                    </Link>
                ))}
        </div>
    );
}

export default Sidebar;
