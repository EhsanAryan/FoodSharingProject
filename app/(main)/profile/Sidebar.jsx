"use client";

import { profileSections } from '@/data/data';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <div className="bg-slate-800 w-full
        md:fixed md:top-[70px] md:right-0 md:h-full md:w-[22%] 
        md:overflow-x-hidden md:overflow-y-auto md:pb-[70px]">
                {profileSections.map((item, index) => (
                    <Link
                        key={`profile_section_${index}`}
                        href={item.href}
                        className={`w-full block px-2 py-3 border-b-2 border-b-slate-900
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
