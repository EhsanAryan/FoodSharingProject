import { ErrorMessage, Field } from 'formik'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import ShowError from '../ShowError.jsx';

const MultiSelect = ({
    formikObject,
    name,
    label,
    options,
    title,
    initialItems,
    className,
    fieldCalss
}) => {
    const [selectedItems, setSelectedItems] = useState([]);

    const handleSetSelectedItems = (selectedValue, formik) => {
        if (selectedValue && selectedItems.findIndex(item => item.value == selectedValue) === -1) {
            const newData = [...selectedItems, options.find(o => o.value == selectedValue)];
            setSelectedItems(newData);

            const selectedValues = newData.map(nd => nd.value);
            formik.setFieldValue(name, selectedValues);
        }
    }

    const handleRemoveFromSelectedItems = (selectedValue, formik) => {
        const newData = selectedItems.filter(item => item.value !== selectedValue);
        setSelectedItems(newData);

        const selectedValues = newData.map(nd => nd.value);
        formik.setFieldValue(name, selectedValues);
    }

    useEffect(() => {
        if (initialItems) {
            setSelectedItems(initialItems);
            const selectedValues = initialItems.map(item => item.value);
            formikObject.setFieldValue(name, selectedValues);
        }
    }, [initialItems]);

    useEffect(() => {
        if (formikObject.values[name] === formikObject.initialValues[name]) {
            formikObject.setFieldValue(name, []);
            setSelectedItems([]);
        }
    }, [formikObject.isSubmitting]);

    return (
        <div className={`w-full p-0 ${className || ""}`}>
            <Field>
                {({ form }) => {
                    return (
                        <>
                            <div className="mb-2">
                                {label && (
                                    <label htmlFor={name} className="ms-1">
                                        {label}
                                    </label>
                                )}
                                <Field as="select" id={name} name={name}
                                    className={`w-full bg-transparent mt-1
                                    border border-gray-400 px-2 py-1 rounded-lg ${fieldCalss || ""}`}
                                    value={selectedItems.length > 0 ? selectedItems[selectedItems.length - 1].value : ""}
                                    onChange={(ev) => handleSetSelectedItems(ev.target.value, form)}
                                >
                                    {title && (
                                        <option value="" disabled>{title}</option>
                                    )}
                                    {options.map(opt => {
                                        return (
                                            <option key={`option_${opt.value}`}
                                                value={opt.value}
                                            >
                                                {opt.text}
                                            </option>
                                        );
                                    })}
                                </Field>
                            </div>
                            <div className="pt-1 flex justify-start items-center flex-wrap">
                                {
                                    selectedItems.map(item => {
                                        return (
                                            <span key={`product_chips_${item.value}`}
                                                className="bg-gray-300 ps-1 pe-2 py-1 
                                                rounded-lg my-1 mx-1 flex items-center"
                                            >
                                                <IconButton
                                                    onClick={() => handleRemoveFromSelectedItems(item.value, form)}
                                                    sx={{
                                                        p: "0.2rem",
                                                        ml: "0.3rem"
                                                    }}
                                                >
                                                    <CloseIcon className="text-red-500"
                                                        sx={{
                                                            fontSize: "1.3rem"
                                                        }}
                                                    />
                                                </IconButton>
                                                <span className="text-sm">
                                                    {item.text}
                                                </span>
                                            </span>
                                        );
                                    })
                                }
                            </div>
                        </>
                    );
                }}
            </Field>
            <ErrorMessage name={name} component={ShowError} />
        </div>
    )
}

export default MultiSelect;

