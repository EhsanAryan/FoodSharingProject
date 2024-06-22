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
    unshownError,
    autoFocus,
    children,
}) => {
    return (
        <div className={`w-full flex flex-col gap-1 p-0 ${className || ""}`}>
            {label && (
                <label htmlFor={name}>
                    {label}
                </label>
            )}
            <FastField as="textarea" id={name} name={name}
                placeholder={placeholder} rows={rows || 3}
                className={`${fieldClass || ""} w-full 
                border border-black rounded-[6px]
                px-2 py-1 outline-none bg-transparent
                ${unresizable ? "resize-none" : "resize-y"}`}
                autoFocus={autoFocus}
            />
            {children || null}
            {!unshownError && (
                <ErrorMessage name={name} component={ShowError} />
            )}
        </div>
    )
}

export default Textarea;

