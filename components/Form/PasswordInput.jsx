import { ErrorMessage, Field } from 'formik';
import React, { useState } from 'react';
import ShowError from '../ShowError.jsx';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const PasswordInput = ({
    name,
    placeholder,
    label,
    className,
    fieldClass,
    ltr,
    formik,
    disabled,
}) => {
    const [showPass, setShowPass] = useState(false);

    return (
        <>
            <div className={`${className || ""} w-full flex flex-col gap-1 text-white`}>
                {label && (
                    <label
                        htmlFor={name}
                        className={`bg-transparent whitespace-nowrap text-[0.9rem] px-1
                        ${disabled ? "text-gray-500" : ""}`}
                    >
                        {label}
                    </label>
                )}
                <div className="relative rounded-md">
                    <Field
                        type={showPass ? "text" : "password"}
                        name={name}
                        placeholder={placeholder}
                        className={`bg-slate-800 w-full
                        ps-2 pe-10 py-1 placeholder:text-sm outline-none 
                        rounded-md disabled:opacity-60 border
                        ${disabled ? "border-gray-500" : !formik.touched[name] ? "border-gray-500" : formik.errors[name] ? "border-red-500" : "border-green-500"}
                        ${ltr ? "dir-ltr" : ""}
                        ${fieldClass || ""}`}
                        disabled={disabled}
                    />
                    <span className={`absolute top-0 end-1.5 h-full cursor-pointer 
                    flex justify-center items-center
                    ${ltr ? "dir-ltr" : ""}
                    ${disabled ? "opacity-60 pointer-events-none" : "opacity-100"}
                    `}
                        onClick={() => setShowPass(prevValue => !prevValue)}
                        title="مشاهده رمز عبور"
                    >
                        {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </span>
                </div>
            </div>
            <ErrorMessage name={name} component={ShowError} />
        </>

    );
}

export default PasswordInput;
