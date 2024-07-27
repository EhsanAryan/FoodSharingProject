"use client";

import { Form, Formik } from 'formik';
import React, { useContext } from 'react';
import { initialValues, onSubmit, validationSchema } from './loginFormik';
import GetField from '@/components/GetField';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainContext } from '@/context/MainContextContainer';

const Page = () => {
    const { setIsLogin } = useContext(MainContext);
    const router = useRouter();

    return (
        <div className="bg-slate-950 rounded-lg px-6 md:px-10 pt-3 pb-5 w-full max-w-[500px] 
        top-appear mx-auto">
            <h1 className="text-primary mb-5 text-center text-4xl">ورود</h1>
            <Formik
                initialValues={initialValues}
                onSubmit={(values, actions) => onSubmit(values, actions, router, setIsLogin)}
                validationSchema={validationSchema}
            >
                {(formik) => (
                    <Form className="flex flex-col gap-4">
                        <div>
                            <GetField
                                control="input"
                                name="username"
                                placeholder="نام کاربری"
                                label="نام کاربری"
                                formik={formik}
                                ltr
                            />
                        </div>
                        <div>
                            <GetField
                                control="password"
                                name="password"
                                placeholder="رمز عبور"
                                label="رمز عبور"
                                ltr
                                formik={formik}
                            />
                        </div>
                        <div className="mt-4 flex flex-wrap-reverse justify-between items-center 
                        gap-x-2 gap-y-4">
                            <Link
                                href="/register"
                                className="text-sm text-primary border-b border-b-[#f16d01]"
                            >
                                هنوز ثبت نام نکرده‌ام
                            </Link>
                            <div className="flex gap-3">
                                <Link
                                    href="/"
                                    className="flex justify-center items-center 
                                    px-4 rounded-[4px]"
                                    style={{
                                        background: "linear-gradient(120deg, #bd1600, #e60000)"
                                    }}
                                >
                                    لغو
                                </Link>
                                <GetField
                                    control="submit"
                                    formik={formik}
                                    text="ورود"
                                    disabledButton
                                    sx={{
                                        background: "linear-gradient(120deg, #cfc205, #f16d01)"
                                    }}
                                />
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Page;
