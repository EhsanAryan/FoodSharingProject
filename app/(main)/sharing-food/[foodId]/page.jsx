"use client";

import { ErrorMessage, FastField, Form, Formik } from 'formik';
import GetField from '@/components/GetField';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MainContext } from '@/context/MainContextContainer';
import { notFound, useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import { initialValues, onSubmit, validationSchema } from './updateFoodFormik';
import ShowError from '@/components/ShowError';
import { Alert } from '@/utils/popupWindows';
import Image from 'next/image';
import Link from 'next/link';
import { getSingleFoodService } from '@/services/foodServices';
import axios from 'axios';

const Page = ({ params: { foodId } }) => {
    const { isLogin, setIsLogin, isLoading } = useContext(MainContext);

    const [loading, setLoading] = useState(false);
    const [foodData, setFoodData] = useState(null);
    const [reinitializeValues, setReinitializeValues] = useState(null);

    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("");

    const router = useRouter()

    const imageInputRef = useRef(null);

    const changeImageHandler = (ev, props) => {
        const file = ev.target.files[0];
        if (!file) return;
        if (!file.type.includes("image/")) return Alert("خطا!", "لطفاً یک تصویر بارگذاری کنید", "error");
        if (file.size > 2 * 1024 * 1024) return Alert("خطا!", "حداکثر سایز تصویر باید 2 مگابایت باشد", "error");
        setImage(file);
        setImageURL(URL.createObjectURL(file));
        props.form.setFieldValue("image", file);
    }

    const getFoodDataHandler = async () => {
        setLoading(true)
        try {
            const response = await getSingleFoodService(foodId);
            if (response.status === 200) {
                setFoodData(response.data);
            }
        } catch (error) {
            if (error?.response?.status && error?.response?.data?.message) {
                await Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
                router.back();
            } else {
                await Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
                router.back();
            }
            setLoading(false);
        }
    }

    const getFileByPath = async (path) => {
        try {
            const response = await axios.get(path, {
                responseType: "blob"
            });
            if (response.status === 200) {
                const fileName = path.split("/").pop();
                const file = new File([response.data], fileName, {
                    type: response.data.type
                });
                return file;
            }
        } catch (error) {
            return null;
        } finally {
            setLoading(false);
        }
    }

    const setReinitializeValuesHandler = async () => {
        const image = await getFileByPath(foodData.image);
        setImage(image);
        setImageURL(URL.createObjectURL(image));
        setReinitializeValues({
            title: foodData.title,
            summary: foodData.summary,
            instruction: foodData.instruction,
            image: image,
        });
    }

    useEffect(() => {
        if (!isLoading) {
            if (!isLogin) {
                notFound();
            } else {
                getFoodDataHandler();
            }
        }
    }, [isLogin, isLoading]);

    useEffect(() => {
        if (foodData) {
            setReinitializeValuesHandler();
        } else {
            setReinitializeValues(null);
        }
    }, [foodData]);

    return (
        <div className="w-full bg-slate-900 rounded-md px-4 md:px-8 py-6 max-w-screen-xl mx-auto">
            {(isLoading || loading) ? (
                <Loading
                    size={50}
                    className="my-12"
                />
            ) : isLogin ? (
                <Formik
                    initialValues={reinitializeValues || initialValues}
                    onSubmit={(values, actions) => onSubmit(values, actions, foodId, router, setIsLogin, notFound)}
                    validationSchema={validationSchema}
                    validateOnMount
                    enableReinitialize
                >
                    {(formik) => {
                        return (
                            <Form className="flex flex-col gap-4">
                                <div className="flex flex-col gap-4 md:flex-row top-appear">
                                    <div className="flex-1">
                                        <GetField
                                            control="input"
                                            name="title"
                                            placeholder="نام غذا"
                                            label="نام غذا"
                                            formik={formik}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <GetField
                                            control="input"
                                            name="summary"
                                            placeholder="چکیده"
                                            label="چکیده"
                                            formik={formik}
                                        />
                                    </div>
                                </div>
                                <div className="bottom-appear">
                                    <GetField
                                        control="textarea"
                                        name="instruction"
                                        placeholder="دستور پخت"
                                        label="دستور پخت"
                                        formik={formik}
                                        rows={4}
                                    />
                                </div>
                                <div className="mt-4 flex flex-col gap-4 right-appear">
                                    <FastField>
                                        {(props) => (
                                            <input
                                                type="file"
                                                name="image"
                                                id="image"
                                                className="hidden"
                                                ref={imageInputRef}
                                                onChange={(ev) => changeImageHandler(ev, props)}
                                            />
                                        )}
                                    </FastField>
                                    <div>
                                        <button
                                            type="button"
                                            className="bg-cyan-600 px-4 py-2 rounded-lg"
                                            onClick={() => imageInputRef?.current?.click()}
                                        >
                                            {image ? "تغییر تصویر" : "بارگذاری تصویر"}
                                        </button>
                                    </div>
                                    {image ? (
                                        <div className="relative mt-1 w-full max-w-[300px] 
                                        h-[220px] rounded-xl">
                                            <Image
                                                src={imageURL}
                                                alt={image.name}
                                                fill
                                                className="object-cover rounded-xl cursor-pointer
                                                shadow-lg shadow-gray-700"
                                                onClick={() => window.open(imageURL)}
                                            />
                                        </div>
                                    ) : null}
                                    <ErrorMessage name={"image"} component={ShowError} />
                                </div>
                                <div className="mt-8 flex justify-end gap-4 left-appear">
                                    <Link
                                        href="/"
                                        className="px-6 rounded-md
                                        flex justify-center items-center"
                                        style={{
                                            background: "linear-gradient(120deg, #bd1600, #e60000)"
                                        }}
                                    >
                                        لغو
                                    </Link>
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
                        )
                    }}
                </Formik>
            ) : null}
        </div>
    );
}

export default Page;
