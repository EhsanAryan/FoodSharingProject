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
    formik,
}) => {
    const [showPass, setShowPass] = useState(false);

    return (
        <>
            <div className={`${className || ""} 
            relative flex items-center
            dir-ltr children-dir-ltr`}>
                {label && (
                    <span className="border border-gray-400 bg-gray-200 
                    border-e-0 rounded-s-md px-2 py-1 whitespace-nowrap">
                        {label}
                    </span>
                )}
                <Field type={showPass ? "text" : "password"}
                    name={name} placeholder={placeholder}
                    className={`border border-gray-400
                ps-2 pe-9 py-1 outline-none flex-1
                bg-transparent focus:border-cyan-500 
                transition-all placeholder:text-sm
                ${!formik.touched[name] ? "border-gray-400" : formik.errors[name] ? "border-red-500" : "border-green-500"}
                ${label ? "rounded-e-md" : "rounded-md"} 
                ${fieldClass || ""}`}
                />
                <span className="cursor-pointer absolute top-1 right-1.5"
                    onClick={() => setShowPass(prevValue => !prevValue)}
                    title="مشاهده رمز عبور"
                >
                    {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </span>
            </div>
            <ErrorMessage name={name} component={ShowError} />
        </>

    );
}

export default PasswordInput;
