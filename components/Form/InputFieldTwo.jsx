import { ErrorMessage, FastField } from 'formik'
import React from 'react'
import ShowError from '../ShowError.jsx'

const InputFieldTwo = ({
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
            <div
                className={`${className || ""} w-full flex flex-col text-white`}
            >
                {label && (
                    <label htmlFor={name}
                        className="bg-transparent whitespace-nowrap text-start mb-1">
                        {label}
                    </label>
                )}
                <FastField type={type}
                    name={name} id={name} placeholder={placeholder}
                    className={`bg-[#30373F] px-2 py-1 outline-none w-full h-full
                    rounded-md placeholder:text-sm 
                    ${fieldClass || ""}`}
                    disabled={disabled}
                />
            </div>
            <ErrorMessage name={name} component={ShowError} />
        </>
    )
}

export default InputFieldTwo;