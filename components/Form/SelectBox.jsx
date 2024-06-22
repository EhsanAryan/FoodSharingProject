import { ErrorMessage, FastField } from 'formik';
import React from 'react';
import ShowError from '../ShowError.jsx';

const SelectBox = ({
    name,
    options,
    label,
    title,
    className,
    fieldCalss,
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
                className={`w-full bg-transparent
                border border-black px-2 py-1 rounded-lg ${fieldCalss || ""}`}
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
