"use client";

import { Form, Formik } from 'formik';
import GetField from '@/components/GetField';
import React, { useContext, useEffect, useState } from 'react';
import * as Yup from "yup";
import { MainContext } from '@/context/MainContextContainer';
import { notFound } from 'next/navigation';
import Loading from '@/components/Loading';

const Page = () => {
    const { isLogin } = useContext(MainContext);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLogin) {
            notFound();
        } else {
            setLoading(false);
        }
    }, [isLogin]);

    return (
        <div>
            {loading ? (
                <Loading
                    size={50}
                    className="mt-12"
                />
            ) : isLogin ? (
                <Formik
                    initialValues={{
                        firstName: ""
                    }}
                    onSubmit={(values, actions) => { }}
                    validationSchema={Yup.object({
                        firstName: Yup.string().required("نام غذا الزامی است")
                    })}
                >
                    {(formik) => {
                        return (
                            <Form>
                                <GetField
                                    control="textarea"
                                    name="firstName"
                                    placeholder="نام"
                                    label="نام"
                                    formik={formik}
                                />
                            </Form>
                        )
                    }}
                </Formik>
            ) : null}
        </div>
    );
}

export default Page;
