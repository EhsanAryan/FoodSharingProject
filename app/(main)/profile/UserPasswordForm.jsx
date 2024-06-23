"use client";

import GetField from '@/components/GetField';
import { Form, Formik } from 'formik';
import React from 'react';
import { initialValues, onSubmit, validationSchema } from './userPasswordFormik';
import { useRouter } from 'next/navigation';

const UserPasswordForm = () => {

    const router = useRouter();

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={(values, actions) => onSubmit(values, actions, router)}
                validationSchema={validationSchema}
            >
                {(formik) => (
                    <Form className="flex flex-col gap-4 items-center">
                        <div className="w-full max-w-sm">
                            <GetField
                                control="password"
                                name="old_password"
                                placeholder="رمز عبور فعلی"
                                label="رمز عبور فعلی"
                                ltr
                                formik={formik}
                            />
                        </div>
                        <div className="w-full max-w-sm">
                            <GetField
                                control="password"
                                name="password"
                                placeholder="رمز عبور جدید"
                                label="رمز عبور جدید"
                                ltr
                                formik={formik}
                            />
                        </div>
                        <div className="w-full max-w-sm">
                            <GetField
                                control="password"
                                name="confirm_password"
                                placeholder="تکرار رمز عبور جدید"
                                label="تکرار رمز عبور جدید"
                                ltr
                                formik={formik}
                            />
                        </div>
                        <div className="mt-4">
                            <GetField
                                control="submit"
                                formik={formik}
                                text="ارسال"
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

export default UserPasswordForm;
