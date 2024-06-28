"use client";

import { Form, Formik } from 'formik';
import React from 'react';
import GetField from '@/components/GetField';
import Link from 'next/link';
import { initialValues, onSubmit, validationSchema } from './registerFormik';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();

    return (
        <div className="bg-slate-950 rounded-lg px-6 md:px-10 pt-3 pb-5 w-full max-w-[500px] 
        top-appear mx-auto">
            <h1 className="text-primary mb-5 text-center text-4xl">ثبت نام</h1>
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
                                name="first_name"
                                placeholder="نام"
                                label="نام"
                                formik={formik}
                            />
                        </div>
                        <div>
                            <GetField
                                control="input"
                                name="last_name"
                                placeholder="نام خانوادگی"
                                label="نام خانوادگی"
                                formik={formik}
                            />
                        </div>
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
                        <div>
                            <GetField
                                control="password"
                                name="confirm_password"
                                placeholder="تکرار رمز عبور"
                                label="تکرار رمز عبور"
                                ltr
                                formik={formik}
                            />
                        </div>
                        <div className="mt-4 flex justify-between items-center gap-2">
                            <Link
                                href="/login"
                                className="text-sm text-primary border-b border-b-[#f16d01]"
                            >
                               قبلاً حساب کاربری ایجاد کرده‌ام
                            </Link>
                            <GetField
                                control="submit"
                                formik={formik}
                                text="ثبت نام"
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
