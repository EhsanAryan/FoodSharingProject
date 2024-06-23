"use client";

import Link from 'next/link';
import React from 'react';

const Error = ({ error, reset }) => {
    return (
        <div className="mt-10 mb-6 flex flex-col items-center gap-4">
            <span className="text-4xl text-primary">
                خطا!
            </span>
            <span className="text-2xl text-primary">
                در دریافت جزئیات غذا خطایی رخ داده است.
            </span>
            <Link
                href="/"
                className="mt-2 bg-primary px-4 py-2 rounded-lg box-hoverable"
            >
                بازگشت به صفحه اصلی
            </Link>

        </div>
    );
}

export default Error;
