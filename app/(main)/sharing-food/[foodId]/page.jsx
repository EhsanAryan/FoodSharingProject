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
import { base_api_url } from '@/services/httpService';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { IconButton } from '@mui/material';
import ModalContainerWithoutHeader from '@/components/ModalContainerWithoutHeader';
import { foodCategoryOptions } from '@/data/data';


const Page = ({ params: { foodId } }) => {
    const { isLogin, setIsLogin, isLoading, setIsAdmin } = useContext(MainContext);

    const [loading, setLoading] = useState(true);
    const [foodData, setFoodData] = useState(null);
    const [reinitializeValues, setReinitializeValues] = useState(null);

    const [images, setImages] = useState([]);
    const [imageURLs, setImageURLs] = useState([]);

    const [isOpen, setIsOpen] = useState(false);
    const [modalImagePath, setModalImagePath] = useState("");

    const router = useRouter()

    const imageInputRef = useRef(null);

    const changeImageHandler = (ev, props) => {
        const file = ev.target.files[0];
        if (!file) return;
        if (images.length >= 4) return Alert("خطا!", "حداکثر میتوانید 4 تصویر را بارگذاری کنید", "error");
        if (!file.type.includes("image/")) return Alert("خطا!", "لطفاً یک تصویر بارگذاری کنید", "error");
        if (file.size > 2 * 1024 * 1024) return Alert("خطا!", "حداکثر سایز تصویر باید 2 مگابایت باشد", "error");
        setImages(prevValue => [...prevValue, file]);
        setImageURLs(prevValue => [...prevValue, URL.createObjectURL(file)]);
        props.form.setFieldValue("images", [...images, file]);
    }

    const deleteImageHandler = (index, formik) => {
        let allImages = images;
        let allImageURLs = imageURLs;
        allImages.splice(index, 1);
        allImageURLs.splice(index, 1);
        setImages(allImages);
        setImageURLs(allImageURLs);
        formik.setFieldValue("images", allImages);
    }

    const getFoodDataHandler = async () => {
        setLoading(true);
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
            // const response = await axios.get(`${base_api_url}${path}`, {
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
            return null;
        } catch (error) {
            return null;
        }
    }

    const setReinitializeValuesHandler = async () => {
        const allImages = [];
        const allImageURLs = [];
        for (let item of foodData.images) {
            const image = await getFileByPath(item);
            if (image) {
                allImages.push(image);
                allImageURLs.push(URL.createObjectURL(image));
            }
        }
        setImages(allImages);
        setImageURLs(allImageURLs);
        setReinitializeValues({
            title: foodData.title,
            summary: foodData.summary,
            instruction: foodData.instruction,
            category: foodData.category,
            images: allImages,
        });
        setLoading(false);
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
                <>
                    <h1 className="text-2xl sm:text-3xl text-primary text-center mb-6 top-appear">
                        ویرایش غذا
                    </h1>
                    <Formik
                        initialValues={reinitializeValues || initialValues}
                        onSubmit={(values, actions) => onSubmit(values, actions, foodId, router, setIsLogin, setIsAdmin, notFound)}
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
                                    <div className="top-appear">
                                        <GetField
                                            control="select"
                                            name="category"
                                            placeholder="دسته بندی"
                                            label="دسته بندی"
                                            formik={formik}
                                            options={foodCategoryOptions}
                                            title="دسته بندی را انتخاب کنید"
                                        />
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
                                                    name="images"
                                                    id="images"
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
                                                بارگذاری تصویر
                                            </button>
                                        </div>
                                        {images.length ? (
                                            <div className="flex items-center gap-4 flex-wrap">
                                                {images.map((item, index) => (
                                                    <div
                                                        key={`image_${item.name}_${index}`}
                                                        className="relative mt-1 w-full max-w-[300px] 
                                                        h-[220px] rounded-xl image-container"
                                                    >
                                                        <Image
                                                            src={imageURLs[index]?.startsWith("blob") ? imageURLs[index] : `${base_api_url}${imageURLs[index]}`}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover rounded-xl
                                                            shadow-lg shadow-gray-700"
                                                        />
                                                        <div className="hidden-card flex justify-center 
                                                             items-center gap-2 rounded-xl z-[1]"
                                                        >
                                                            <IconButton
                                                                onClick={() => {
                                                                    setModalImagePath(imageURLs[index]);
                                                                    setIsOpen(true);
                                                                }}
                                                            >
                                                                <RemoveRedEyeIcon
                                                                    sx={{
                                                                        color: "#30c014dd",
                                                                        fontSize: "2rem"
                                                                    }}
                                                                />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => deleteImageHandler(index, formik)}
                                                            >
                                                                <DeleteIcon
                                                                    sx={{
                                                                        color: "red",
                                                                        fontSize: "2rem"
                                                                    }}
                                                                />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}
                                        <ErrorMessage name={"images"} component={ShowError} />
                                    </div>
                                    <div className="mt-8 flex justify-end gap-4 left-appear">
                                        <Link
                                            href="/"
                                            className="px-6 rounded-md
                                        flex justify-center items-center red-btn"
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
                </>
            ) : null}

            {/* Image modal */}
            <ModalContainerWithoutHeader
                isOpen={isOpen && modalImagePath}
                setIsOpen={setIsOpen}
                blur
                className="bg-transparent text-white rounded-xl w-[75vw] h-[85vh]"
            >
                <Image
                    src={modalImagePath?.startsWith("blob") ? modalImagePath : `${base_api_url}${modalImagePath}`}
                    alt="Modal Image"
                    className="rounded-xl object-cover"
                    fill
                />
            </ModalContainerWithoutHeader>
        </div>
    );
}

export default Page;
