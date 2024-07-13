import React from 'react';
import EmailIcon from '@mui/icons-material/Email';
import PhoneEnabledRoundedIcon from '@mui/icons-material/PhoneEnabledRounded';
// import Link from 'next/link';

const Page = () => {
    return (
        <div className="w-full min-h-[300px] bg-slate-900 rounded-md px-4 md:px-6 py-5 
        max-w-screen-lg mx-auto flex flex-col justify-center items-center gap-4">
            <div className="bg-primary text-black px-4 py-2 rounded-xl w-full max-w-[400px]
            flex flex-col sm:flex-row justify-between items-center gap-y-2 gap-x-10">
                <span className="flex items-center gap-1">
                    <EmailIcon />
                    <span>ایمیل:</span>
                </span>
                {/* <Link href="mailto:ehsan.aryan2001@gmail.com">ehsan.aryan2001@gmail.com</Link> */}
                <span>ehsan.aryan2001@gmail.com</span>
            </div>
            <div className="bg-primary text-black px-4 py-2 rounded-xl w-full max-w-[400px]
            flex flex-col sm:flex-row justify-between items-center gap-y-2 gap-x-10">
                <span className="flex items-center gap-1">
                    <PhoneEnabledRoundedIcon />
                    <span>شماره تماس:</span>
                </span>
                {/* <Link href="tel:+989197477916" className="dir-ltr">+989197477916</Link> */}
                <span className="dir-ltr">+989197477916</span>
            </div>
        </div>
    );
}

export default Page;
