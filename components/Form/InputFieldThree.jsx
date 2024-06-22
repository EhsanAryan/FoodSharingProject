import { ErrorMessage, FastField } from 'formik'
import React from 'react'
import ShowError from '../ShowError.jsx'

const InputFieldThree = ({
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
            <div className={`${className || ""} w-full flex flex-col gap-1`}>
                {label && (
                    <label
                        className={`bg-transparent whitespace-nowrap text-[0.9rem] px-1
                        ${disabled ? "text-gray-500" : ""}`}
                        htmlFor={name}
                    >
                        {label}
                    </label>
                )}
                <FastField type={type}
                    name={name} id={name} placeholder={placeholder}
                    className={`px-2 py-1 outline-none bg-transparent 
                    border border-black rounded-[6px] text-black w-full
                    disabled:bg-gray-200 disabled:border-gray-400 disabled:text-gray-500
                    ${fieldClass || ""}`}
                    disabled={disabled}
                />
            </div>
            <ErrorMessage name={name} component={ShowError} />
        </>
    )
}

export default InputFieldThree;