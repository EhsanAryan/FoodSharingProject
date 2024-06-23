"use client";

import { ErrorMessage, FastField } from 'formik'
import React from 'react'
import ShowError from '../ShowError.jsx'

const InputField = ({
    name,
    type,
    placeholder,
    label,
    className,
    fieldClass,
    disabled,
    formik,
    ltr,
}) => {
    return (
        <>
            <div
                className={`${className || ""} w-full flex flex-col gap-1 text-white`}
            >
                {label && (
                    <label
                        htmlFor={name}
                        className={`bg-transparent whitespace-nowrap text-[0.9rem] px-1
                        ${disabled ? "text-gray-500" : ""}`}
                    >
                        {label}
                    </label>
                )}
                <FastField
                    type={type || "text"}
                    name={name}
                    id={name}
                    placeholder={placeholder}
                    className={`bg-slate-800 px-2 py-1 outline-none w-full h-full
                    rounded-md placeholder:text-sm disabled:opacity-60 border
                    ${disabled ? "border-gray-500" : !formik.touched[name] ? "border-gray-500" : formik.errors[name] ? "border-red-500" : "border-green-500"}
                    ${ltr ? "dir-ltr" : ""}
                    ${fieldClass || ""}`}
                    disabled={disabled}
                />
            </div>
            <ErrorMessage name={name} component={ShowError} />
        </>
    )
}

export default InputField;