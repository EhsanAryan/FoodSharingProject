import { ErrorMessage, FastField } from 'formik';
import React from 'react';
import ShowError from '../ShowError.jsx';

const SelectBoxTwo = ({
    name,
    options,
    label,
    title,
    className,
    fieldCalss,
    unshownError,
    ...rest
}) => {
    return (
        <>
            <div className={`flex flex-col gap-1 w-full ${className || ""}`}>
                {label && (
                    <label htmlFor={name} className="ms-1 whitespace-nowrap bg-transparent">
                        {label}
                    </label>
                )}
                <FastField name={name} id={name} as="select"
                    className={`w-full px-2 py-1 rounded-md 
                    border-none outline-none ${fieldCalss || ""}`}
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
            </div>
            {!unshownError && (
                <ErrorMessage name={name} component={ShowError} />
            )}
        </>
    );
}

export default SelectBoxTwo;
