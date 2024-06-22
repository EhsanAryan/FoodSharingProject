import { ErrorMessage, FastField } from 'formik'
import React from 'react'
import ShowError from '../ShowError.jsx'

const TextareaTwo = ({
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
        <>
            <div className={`w-full flex items-start text-primary-900 ${className || ""}`}>
                {label && (
                    <label htmlFor={name}
                        className="h-full bg-transparent whitespace-nowrap 
                        flex items-center justify-center">
                        {label}
                    </label>
                )}
                <FastField as="textarea" id={name} name={name}
                    placeholder={placeholder} rows={rows || 3}
                    className={`${fieldClass || ""} bg-primary-50 w-full h-full
                border-none outline-none rounded-md text-lg 
                placeholder:text-sm placeholder:text-primary-700
                px-2 py-1
                ${unresizable ? "resize-none" : "resize-y"}`}
                    autoFocus={autoFocus}
                />
                {children || null}
            </div>
            {!unshownError && (
                <ErrorMessage name={name} component={ShowError} />
            )}
        </>
    )
}

export default TextareaTwo;