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
    ltr
}) => {
    const [showPass, setShowPass] = useState(false);

    return (
        <>
            <div className={`${className || ""} relative flex flex-col gap-1`}>
                {label && (
                    <label className="bg-transparent whitespace-nowrap text-[0.9rem] px-1">
                        {label}
                    </label>
                )}
                <Field type={showPass ? "text" : "password"}
                    name={name} placeholder={placeholder}
                    className={`bg-[#30373F] w-full
                    ps-2 pe-10 py-1 outline-none rounded-md ${ltr ? "dir-ltr" : ""}
                    ${fieldClass || ""}`}
                />
                <span className={`cursor-pointer absolute bottom-1 end-1.5 ${ltr ? "dir-ltr" : ""}`}
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
