import React from 'react';

export const metadata = {
    title: "احراز هویت",
    description: "بخش احراز هویت سامانه به اشتراک گذاری غذا",
};


const Layout = ({children}) => {
    return (
        <div className="bg-primary fixed top-0 right-0 w-full h-screen 
        overflow-x-hidden overflow-y-auto px-4 py-10">
            {children}
        </div>
    );
}

export default Layout;
