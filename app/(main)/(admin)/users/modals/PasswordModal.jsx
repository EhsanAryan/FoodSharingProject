"use client";

import ModalContainerWithoutHeader from '@/components/ModalContainerWithoutHeader';
import { Form, Formik } from 'formik';
import React, { useContext } from 'react';
import { initialValues, onSubmit, validationSchema } from './changePasswordFormik';
import { MainContext } from '@/context/MainContextContainer';
import GetField from '@/components/GetField';
import { notFound } from 'next/navigation';

const PasswordModal = ({ isOpen, setIsOpen, rowData }) => {
    const { setIsLogin, setIsAdmin } = useContext(MainContext);

    return (
        <ModalContainerWithoutHeader
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            blur
            className="bg-slate-900 text-white rounded-xl px-6 md:px-10 pt-5 pb-5
            w-full max-w-[500px] max-h-full overflow-x-hidden overflow-y-auto"
        >
            <h1 className="mb-5 text-center text-xl md:text-2xl text-primary">
                {`تغییر رمز عبور کاربر "${rowData.username}"`}
            </h1>
            <Formik
                initialValues={initialValues}
                onSubmit={(values, actions) => onSubmit(values, actions, setIsLogin, setIsAdmin, notFound, rowData, setIsOpen)}
                validationSchema={validationSchema}
            >
                {(formik) => (
                    <Form className="flex flex-col gap-4 items-center">
                        <div className="w-full max-w-sm">
                            <GetField
                                control="password"
                                name="new_password"
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
        </ModalContainerWithoutHeader>
    );
}

export default PasswordModal;
