"use client";

import Link from 'next/link';
import React from 'react';

const Error = ({ error, reset }) => {
    return (
        <div className="my-10 flex flex-col items-center gap-4">
            <span className="text-4xl text-primary">
                خطا!
            </span>
            <span className="text-2xl text-primary">
                {error.message}
            </span>
            <Link
                href="/"
                className="mt-2 px-4 py-2 rounded-lg yellow-btn"
            >
                بازگشت به صفحه اصلی
            </Link>

        </div>
    );
}

export default Error;
