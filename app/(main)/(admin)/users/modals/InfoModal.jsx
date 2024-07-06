"use client";

import ModalContainerWithoutHeader from '@/components/ModalContainerWithoutHeader';
import { Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { initialValues, onSubmit, validationSchema } from './changeInfoFormik';
import { MainContext } from '@/context/MainContextContainer';
import GetField from '@/components/GetField';
import { notFound } from 'next/navigation';

const PasswordModal = ({ isOpen, setIsOpen, rowData, setForceRequest }) => {
    const { setIsLogin, setIsAdmin } = useContext(MainContext);

    const [reinitializeValues, setReinitializeValues] = useState(null);

    useEffect(() => {
        if(!rowData) return setIsOpen(false);
        setReinitializeValues({
            username: rowData.username,
            first_name: rowData.first_name,
            last_name: rowData.last_name,
        })
    }, [rowData]);

    return (
        <ModalContainerWithoutHeader
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            blur
            className="bg-slate-900 text-white rounded-xl px-6 md:px-10 pt-5 pb-5
            w-full max-w-[500px] max-h-full overflow-x-hidden overflow-y-auto"
        >
            <h1 className="mb-5 text-center text-xl md:text-2xl text-primary">
                {`ویرایش اطلاعات کاربر "${rowData.username}"`}
            </h1>
            <Formik
                initialValues={reinitializeValues || initialValues}
                onSubmit={(values, actions) => onSubmit(values, actions, setIsLogin, setIsAdmin, notFound, rowData, setIsOpen, setForceRequest)}
                validationSchema={validationSchema}
                enableReinitialize
            >
                {(formik) => (
                    <Form className="w-full flex flex-col gap-4 items-center">
                        <div className="w-full max-w-sm">
                            <GetField
                                control="input"
                                name="username"
                                placeholder="نام کاربری"
                                label="نام کاربری"
                                formik={formik}
                                ltr
                            />
                        </div>
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
        </ModalContainerWithoutHeader>
    );
}

export default PasswordModal;
