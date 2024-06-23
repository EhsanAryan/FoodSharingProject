"use client";

import { Form, Formik } from 'formik';
import React from 'react';
import { initialValues, onSubmit, validationSchema } from './loginFormik';
import GetField from '@/components/GetField';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();

    return (
        <div className="bg-slate-950 rounded-lg px-6 md:px-10 pt-3 pb-5 w-full max-w-[500px] 
        appear mx-auto">
            <h1 className="text-primary mb-5 text-center text-4xl">ورود</h1>
            <Formik
                initialValues={initialValues}
                onSubmit={(values, actions) => onSubmit(values, actions, router)}
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
                        <div className="mt-4 flex justify-between items-center gap-2">
                            <Link
                                href="/register"
                                className="text-sm text-primary border-b border-b-[#f16d01]"
                            >
                                هنوز ثبت نام نکرده‌ام
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
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Page;
