"use client";

import GetField from '@/components/GetField';
import { Form, Formik } from 'formik';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { initialValues, onSubmit, validationSchema } from './userInfoFormik';
import { Alert } from '@/utils/popupWindows';
import { useRouter } from 'next/navigation';
import { Avatar } from '@mui/material';
import { MainContext } from '@/context/MainContextContainer';
import { changeAvatarService } from '@/services/userServices';
import Loading from '@/components/Loading';

const UserInfoForm = () => {
    const { user, setUser } = useContext(MainContext);

    const [reinitializeValues, setReinitializeValues] = useState(null);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const router = useRouter();
    const imageInputRef = useRef(null);

    const changeAvatarHandler = async (ev) => {
        const file = ev.target.files[0];
        if (!file) return;
        if (!file.type.includes("image/")) return Alert("خطا!", "لطفاً یک تصویر آپلود کنید", "error");
        if (file.size > 3 * 1024 * 1024) return Alert("خطا!", "حداکثر سایز تصویر باید 3 مگابایت باشد", "error");

        setAvatarLoading(true);
        const formData = new FormData();
        formData.append("avatar", file);
        try {
            const response = await changeAvatarService(formData);
            if (response.status === 200) {
                Alert(null, "تصویر آواتار با موفقیت به روز رسانی شد.", "success");
                setUser(response.data);
            }
        } catch (error) {
            if (error?.response?.status && error?.response?.data?.message) {
                Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
            } else {
                Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
            }
        } finally {
            setAvatarLoading(false);
        }
    }

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
                {/* Hidden file input */}
                <input
                    type="file"
                    className="hidden"
                    ref={imageInputRef}
                    onChange={(ev) => changeAvatarHandler(ev)}
                />
                {avatarLoading ? (
                    <Loading
                        size={20}
                        className="my-4"
                    />
                ) : (
                    <Avatar
                        src={user?.avatar || ""}
                        alt="User avatar"
                        sx={{
                            width: "200px",
                            height: "200px",
                            cursor: "pointer"
                        }}
                        onClick={() => imageInputRef?.current?.click()}
                    />
                )}
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
