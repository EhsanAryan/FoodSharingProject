"use client";

import { ErrorMessage, FastField, Form, Formik } from 'formik';
import GetField from '@/components/GetField';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MainContext } from '@/context/MainContextContainer';
import { notFound, useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import { initialValues, onSubmit, validationSchema } from './sharingFoodFormik';
import ShowError from '@/components/ShowError';
import { Alert } from '@/utils/popupWindows';
import Image from 'next/image';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { IconButton } from '@mui/material';
import ModalContainerWithoutHeader from '@/components/ModalContainerWithoutHeader';
import { createFoodCategoryOptions, loaderDataURL } from '@/data/data';
import { base_api_url } from '@/services/httpService';


const Page = () => {
    const { isLogin, setIsLogin, isLoading, setIsAdmin } = useContext(MainContext);

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

    useEffect(() => {
        if (!isLoading) {
            if (!isLogin) {
                notFound();
            }
        }
    }, [isLogin, isLoading]);

    return (
        <div className="w-full bg-slate-900 rounded-md px-4 md:px-8 py-6 max-w-screen-xl mx-auto">
            {isLoading ? (
                <Loading
                    size={50}
                    className="my-12"
                />
            ) : isLogin ? (
                <>
                    <h1 className="text-2xl sm:text-3xl text-primary text-center mb-6 top-appear">
                        افزودن غذا
                    </h1>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values, actions) => onSubmit(values, actions, router, setIsLogin, setIsAdmin, notFound)}
                        validationSchema={validationSchema}
                        validateOnMount
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
                                                placeholder="توضیحات"
                                                label="توضیحات"
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
                                            options={createFoodCategoryOptions}
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
                                                className="bg-cyan-600 px-4 py-2 rounded-lg mb-2"
                                                onClick={() => imageInputRef?.current?.click()}
                                            >
                                                بارگذاری تصویر
                                            </button>
                                        </div>
                                        {images.length ? (
                                            <div className="flex items-center gap-x-4 gap-y-6 flex-wrap">
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
                                                            placeholder={loaderDataURL}
                                                            quality={70}
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
                                            text="ایجاد"
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
                className="bg-transparent text-white rounded-xl max-w-[90vw] max-h-[90vh]"
            >
                {/* eslint-disable  */}
                <img
                    src={modalImagePath}
                    alt="Modal Image"
                    className="rounded-xl max-w-[90vw] max-h-[90vh]"
                />
                {/* eslint-enable */}
            </ModalContainerWithoutHeader>
        </div>
    );
}

export default Page;
