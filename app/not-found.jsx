import Link from 'next/link';
import React from 'react';

const NotFound = () => {
    return (
        <div className="my-14 text-center flex flex-col gap-5 items-center">
            <span className="text-primary text-5xl">
                صفحه یافت نشد!
            </span>
            <Link 
            href="/" 
            className="bg-primary px-4 py-2 rounded-lg box-hoverable"
            >
                بازگشت به صفحه اصلی
            </Link>
        </div>
    );
}

export default NotFound;
