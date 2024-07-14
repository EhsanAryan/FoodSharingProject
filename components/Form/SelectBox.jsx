import { ErrorMessage, FastField } from 'formik';
import React from 'react';
import ShowError from '../ShowError.jsx';

const SelectBox = ({
    name,
    options,
    label,
    title,
    className,
    fieldClass,
    formik,
    disabled,
    ltr,
    ...rest
}) => {
    return (
        <div className={`flex flex-col gap-1 w-full ${className || ""}`}>
            {label && (
                <label htmlFor={name} className="bg-transparent whitespace-nowrap text-[0.9rem] px-1">
                    {label}
                </label>
            )}
            <FastField name={name} id={name} as="select"
                className={`bg-slate-800 px-2 py-1 outline-none w-full
                rounded-md placeholder:text-sm disabled:opacity-60 border
                ${disabled ? "border-gray-500" : !formik.touched[name] ? "border-gray-500" : formik.errors[name] ? "border-red-500" : "border-green-500"}
                ${ltr ? "dir-ltr" : ""}
                ${fieldClass || ""}`}
                disabled={disabled}
                {...rest}
            >
                {title && (
                    <option value="" className="hidden">
                        {title}
                    </option>
                )}
                {options.map((op, index) => (
                    <option
                        key={`${Math.random()}_${index}`}
                        value={op.value}
                    >
                        {op.text}
                    </option>
                ))}
            </FastField>
            <ErrorMessage name={name} component={ShowError} />
        </div>
    );
}

export default SelectBox;
