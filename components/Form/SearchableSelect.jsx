import { ErrorMessage, Field } from 'formik'
import React, { useEffect, useState } from 'react'
import ShowError from '../ShowError.jsx';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';



const SearchableSelect = ({
    formikObject,
    name,
    label,
    options,
    className,
    title,
    placeholder,
    initialItems
}) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [showItems, setShowItems] = useState(false);
    const [initOptions, setInitOptions] = useState(options);

    const handleSetSelectedItems = (selectedValue, formik) => {
        if (selectedValue && selectedItems.findIndex(item => item.value === selectedValue) === -1) {
            const newData = [...selectedItems, options.find(o => o.value === selectedValue)];
            setSelectedItems(newData);

            const selectedValues = newData.map(nd => nd.value);
            formik.setFieldValue(name, selectedValues);
        }
    }

    const handleRemoveFromSelectedItems = (ev, selectedValue, formik) => {
        ev.stopPropagation();
        const newData = selectedItems.filter(item => item.value !== selectedValue);
        setSelectedItems(newData);

        const selectedValues = newData.map(nd => nd.value);
        formik.setFieldValue(name, selectedValues);
    }

    const handleSearch = (txt) => {
        setInitOptions(options.filter(o => o.text.toLowerCase().trim().includes(txt.toLowerCase().trim())));
    }

    const handleShowItems = (ev, formik) => {
        // ev.nativeEvent.stopImmediatePropagation();
        ev.stopPropagation();
        formik.setFieldTouched(name, true);
        setShowItems(prevValue => !prevValue);
    }

    // useEffect(() => {
    //     document.body.addEventListener("click", () => {
    //         setShowItems(false);
    //     });
    // }, []);

    useEffect(() => {
        setInitOptions(options);
    }, [options]);

    useEffect(() => {
        if (formikObject.values[name] === formikObject.initialValues[name]) {
            formikObject.setFieldValue(name, []);
            setSelectedItems([]);
        }
    }, [formikObject.isSubmitting]);

    useEffect(() => {
        if (initialItems) {
            setSelectedItems(initialItems);
            const selectedValues = initialItems.map(item => item.value);
            formikObject.setFieldValue(name, selectedValues);
        }
    }, [initialItems]);


    return (
        <div className={`w-full p-0 ${className || ""}`}>
            <Field>
                {({ form }) => {
                    return (
                        <>
                            <div className="w-full mb-2">
                                {label && (
                                    <span className="ps-1">{label}</span>
                                )}
                                <div className="searchable-select w-full relative
                                overflow-visible cursor-pointer mt-1
                                flex justify-start items-center flex-wrap
                                border border-gray-400 rounded-lg px-2 py-1"
                                    onClick={(ev) => handleShowItems(ev, form)}>
                                    {
                                        selectedItems.length > 0 ? (
                                            selectedItems.map(item => {
                                                return (
                                                    <span key={`product_chips_${item.value}`}
                                                        className="bg-gray-300 ps-1 pe-2 py-1 
                                                    rounded-lg m-1 flex items-center
                                                    break-all whitespace-pre-line"
                                                    >
                                                        <IconButton
                                                            onClick={(ev) => handleRemoveFromSelectedItems(ev, item.value, form)}
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
                                        ) : <span className="text-gray-400">{title}</span>
                                    }
                                    <div
                                        className={`hidden-menu w-full
                                    absolute top-full right-0 bg-white
                                    ${!showItems ? "hidden" : ""}`}
                                        onClick={(ev) => ev.stopPropagation()}>
                                        <input type="text"
                                            className="hidden-input w-full 
                                        border-0 px-2 py-2 m-0"
                                            placeholder={placeholder}
                                            onChange={(ev) => handleSearch(ev.target.value)} />
                                        <div
                                            className="hidden-items-list w-full
                                        p-0 m-0 flex flex-col border-2"
                                        >
                                            {initOptions.map(opt => {
                                                return (
                                                    <div key={`option_${opt.value}_${Math.random()}`}
                                                        className="w-full cursor-pointer break-all whitespace-pre-line
                                                    px-2 py-1 border-b-2 hover:bg-gray-300
                                                    last-of-type:border-b-0"
                                                        onClick={() => handleSetSelectedItems(opt.value, form)}
                                                    >
                                                        {opt.text}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                }}
            </Field>
            <ErrorMessage name={name} component={ShowError} />
        </div>
    )
}

export default SearchableSelect;

