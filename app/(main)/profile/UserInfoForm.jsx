"use client";

import GetField from '@/components/GetField';
import { Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { initialValues, onSubmit, validationSchema } from './userInfoFormik';
import { Alert } from '@/utils/popupWindows';
import { useRouter } from 'next/navigation';
import { Avatar } from '@mui/material';
import { MainContext } from '@/context/MainContextContainer';

const UserInfoForm = () => {
    const { user } = useContext(MainContext);

    const [reinitializeValues, setReinitializeValues] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (user) {
            setReinitializeValues({
                first_name: user.first_name,
                last_name: user.last_name
            });
        } else {
            setReinitializeValues(null);
            Alert("خطا!", "در دریافت جزئیات حساب کاربری شما مشکلی رخ داده است!", "error");
            router.back();
        }
    }, [user]);

    return (
        <div>
            <div className="flex justify-center mb-6">
                <Avatar
                    src={user?.avatar || ""}
                    alt="User avatar"
                    sx={{
                        width: "200px",
                        height: "200px",
                        cursor: "pointer"
                    }}
                />
            </div>
            <Formik
                initialValues={reinitializeValues || initialValues}
                onSubmit={(values, actions) => onSubmit(values, actions, router)}
                validationSchema={validationSchema}
                enableReinitialize
            >
                {(formik) => (
                    <Form className="flex flex-col gap-4 items-center">
                        <div className="w-full max-w-sm">
                            <GetField
                                control="input"
                                name="first_name"
                                placeholder="نام"
                                label="نام"
                                formik={formik}
                            />
                        </div>
                        <div className="w-full max-w-sm">
                            <GetField
                                control="input"
                                name="last_name"
                                placeholder="نام خانوادگی"
                                label="نام خانوادگی"
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

export default UserInfoForm;
