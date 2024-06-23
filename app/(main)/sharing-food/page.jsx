"use client";

import { Form, Formik } from 'formik';
import GetField from '@/components/GetField';
import React from 'react';
import * as Yup from "yup";

const Page = () => {
    return (
        <div>
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
        </div>
    );
}

export default Page;
