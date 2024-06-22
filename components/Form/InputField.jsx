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
}) => {
    return (
        <>
            <div className={`${className || ""} flex items-center h-[36px] w-full`}>
                {label && (
                    <span className="border-2 border-e-0 border-white bg-input h-full
                    rounded-s-md px-1.5 whitespace-nowrap
                    flex items-center justify-center">
                        {label}
                    </span>
                )}
                <FastField type={type}
                    name={name} placeholder={placeholder}
                    className={`border-2 border-white bg-input px-2 py-1 outline-none bg-transparent
                w-full h-full transition-all placeholder:text-sm placeholder:text-white
                ${label ? "rounded-e-md" : "rounded-md"} 
                ${fieldClass || ""}`}
                    disabled={disabled}
                />
            </div>
            <ErrorMessage name={name} component={ShowError} />
        </>
    )
}

export default InputField;