import { ErrorMessage, FastField } from 'formik';
import moment from 'moment-jalaali';
import React, { useEffect, useState } from 'react';
import ShowError from '../ShowError.jsx';
import DoneIcon from '@mui/icons-material/Done';
import { IconButton } from '@mui/material';
import addZeroToNumber from '../../utils/addZeroToNumber.js';

const allDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
const allMonths = [
    { value: 1, text: "فروردین" },
    { value: 2, text: "اردیبهشت" },
    { value: 3, text: "خرداد" },
    { value: 4, text: "تیر" },
    { value: 5, text: "مرداد" },
    { value: 6, text: "شهریور" },
    { value: 7, text: "مهر" },
    { value: 8, text: "آبان" },
    { value: 9, text: "آذر" },
    { value: 10, text: "دی" },
    { value: 11, text: "بهمن" },
    { value: 12, text: "اسفند" }
]

const DatePicker = ({
    name,
    label,
    placeholder,
    formik,
    className,
    yearRange,
    initialDate
}) => {
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [allYears, setAllYears] = useState([])
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleOpenDatePicker = () => {
        let years = [];
        for (let i = parseInt(year) - (yearRange?.from || 100); i <= parseInt(year) + (yearRange?.to || 10); i++) {
            years.push(i);
        }
        setAllYears(years);
        setShowDatePicker(true);
    }

    const handleCloseDatePicker = () => {
        const fieldValue = `${year}/${addZeroToNumber(month)}/${addZeroToNumber(day)}`;
        formik.setFieldValue(name, fieldValue);
        setShowDatePicker(false);
    }

    useEffect(() => {
        const date = initialDate ? moment(initialDate) : moment();
        setYear(date.jYear());
        setMonth(date.jMonth() + 1);
        setDay(date.jDate());
    }, [initialDate]);

    return (
        <>
            <div className={`w-full relative p-0
            overflow-hidden ${className || ""}`}
            >
                {label ? (
                    <label htmlFor={name}>
                        {label}
                    </label>
                ) : null}
                <div onClick={() => handleOpenDatePicker()}
                    className="mt-1">
                    <FastField id={name} name={name}
                        className="w-full h-10 border border-gray-400
                        rounded-lg bg-transparent 
                        cursor-pointer px-2 outline-none"
                        placeholder={placeholder || "برای انتخاب تاریخ کلیک کنید"}
                    />
                </div>
                {
                    showDatePicker && (
                        <div className="absolute bottom-0 
                        left-0 w-full h-10 border-2 
                        rounded-lg bg-white m-0 p-0 
                        grid grid-cols-4"
                        >
                            <div className="flex justify-center items-center">
                                <select className="date-select cursor-pointer" 
                                value={day}
                                onChange={(ev) => setDay(ev.target.value)}
                                >
                                    {allDays.map(d => {
                                        return (
                                            <option key={`day_${d}`} value={d}>
                                                {d}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="flex justify-center items-center">
                                <select className="date-select cursor-pointer" 
                                value={month}
                                onChange={(ev) => setMonth(ev.target.value)}
                                >
                                    {allMonths.map(m => {
                                        return (
                                            <option key={`month_${m.value}`} value={m.value}>
                                                {m.text}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="flex justify-center items-center">
                                <select className="date-select cursor-pointer" 
                                value={year}
                                onChange={(ev) => setYear(ev.target.value)}
                                >
                                    {allYears.map(y => {
                                        return (
                                            <option key={`year_${y}`} value={y}>
                                                {y}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="flex justify-center items-center">
                                <IconButton
                                    onClick={() => handleCloseDatePicker()}
                                    sx={{
                                        p: "0.25rem"
                                    }}
                                >
                                    <DoneIcon
                                        className="text-green-500"
                                    />
                                </IconButton>
                            </div>
                        </div>
                    )
                }
            </div>
            <ErrorMessage name={name} component={ShowError} />
        </>
    );
}

export default DatePicker;
