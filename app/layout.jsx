import Header from "@/components/Header";
import "./globals.css";
import localFont from "next/font/local";
import MainContextContainer from "@/context/MainContextContainer";

export const metadata = {
    title: "سامانه به اشتراک گذاری غذا",
    description: "سامانه به اشتراک گذاری غذا",
};

const BYekan = localFont({
    src: [
        {
            path: "./fonts/BYekan/BYekan-webfont.woff",
        },
        {
            path: "./fonts/BYekan/BYekan-webfont.ttf",
        },
    ]
});

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl">
            <body className={`${BYekan.className}`}>
                <MainContextContainer>
                    <Header />
                    <main className="bg-slate-950 main-content-section fixed top-[70px] right-0 
                    w-full text-white px-4 md:px-6 lg:px-10 py-8 overflow-x-hidden overflow-y-auto">
                        {children}
                    </main>
                </MainContextContainer>
            </body>
        </html>
    );
}
