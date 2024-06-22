import { Switch } from '@mui/material';
import { ErrorMessage, FastField } from 'formik';
import React from 'react';
import ShowError from '../ShowError';

const SwitchCheckbox = ({
    name,
    color,
    label,
    className,
    onChange,
    formik
}) => {
    return (
        <>
            <FastField name={name}>
                {({ field }) => {
                    return (
                        <div className={className || ""}>
                            {onChange ? (
                                <Switch
                                    color={color || "primary"}
                                    {...field}
                                    checked={field.value}
                                    onChange={(ev) => onChange(ev, formik)}
                                />
                            ) : (
                                <Switch
                                    color={color || "primary"}
                                    {...field}
                                    checked={field.value}
                                />
                            )}
                            <span className="text-sm opacity-50">{label}</span>
                        </div>
                    );
                }}
            </FastField>
            <ErrorMessage name={name} component={ShowError} />
        </>
    );
}

export default SwitchCheckbox;
