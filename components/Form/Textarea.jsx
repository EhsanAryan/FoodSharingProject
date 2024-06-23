"use client";

import { ErrorMessage, FastField } from 'formik'
import React from 'react'
import ShowError from '../ShowError.jsx'

const Textarea = ({
    name,
    placeholder,
    label,
    rows,
    unresizable,
    className,
    fieldClass,
    noError,
    autoFocus,
    formik,
    disabled,
}) => {
    return (
        <>
            <div className={` ${className || ""} w-full flex flex-col gap-1 text-white`}>
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
                    as="textarea"
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    rows={rows || 3}
                    className={`bg-slate-800 w-full h-full
                    border outline-none rounded-md
                    placeholder:text-sm px-2 py-1 disabled:opacity-60
                    ${disabled ? "border-gray-500" : !formik.touched[name] ? "border-gray-500" : formik.errors[name] ? "border-red-500" : "border-green-500"}
                    ${unresizable ? "resize-none" : "resize-y"} 
                    ${fieldClass || ""}`}
                    autoFocus={autoFocus}
                    disabled={disabled}
                />
            </div>
            {!noError ? (
                <ErrorMessage name={name} component={ShowError} />
            ) : null}
        </>
    )
}

export default Textarea;