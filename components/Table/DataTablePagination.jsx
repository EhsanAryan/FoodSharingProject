"use client";

import { CircularProgress, Pagination } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

const DataTablePagination = ({
    tableCols,
    searchTitle,
    withoutSearch,
    children,
    APIFunction,
    dataField,
    forceRequest,
    rowTitle,
    noDataText,
    hasCategory,
    categoryOptions = [],
    defaultCategory,
}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [pagesCount, setPagesCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchChar, setSearchChar] = useState("");
    const [itemsCount, setItemsCount] = useState(20);
    const [category, setCategory] = useState(defaultCategory || "");

    const searchInputRef = useRef(null);

    let searchCharTimeout;

    const handleGetData = async (currentPage, itemsCnt, char, cat) => {
        setLoading(true);
        try {
            let response;
            if (!withoutSearch && hasCategory) {
                response = await APIFunction(currentPage, itemsCnt, char, cat);
            } else if (withoutSearch && hasCategory) {
                response = await APIFunction(currentPage, itemsCnt, cat);
            } else if (!withoutSearch && !hasCategory) {
                response = await APIFunction(currentPage, itemsCnt, char);
            } else if (withoutSearch && !hasCategory) {
                response = await APIFunction(currentPage, itemsCnt);
            }
            if (response.status === 200) {
                setData(response.data[dataField]);
                setPagesCount(response.data.pagesCount || 1);
            }
        } catch (error) {
            
        } finally {
            setLoading(false);
        }
    }

    const handleSetCurrentPage = (ev, page) => {
        setCurrentPage(page);
    }

    const handleSetSearchChar = (ev) => {
        const char = ev.target.value;
        clearTimeout(searchCharTimeout);
        searchCharTimeout = setTimeout(() => {
            setSearchChar(char);
            setCurrentPage(1);
        }, 1000);
    }

    const handleSetCategory = (ev) => {
        const value = ev.target.value;
        setCategory(value);
        setCurrentPage(1);
    }

    useEffect(() => {
        handleGetData(currentPage, itemsCount, searchChar, category);
    }, [currentPage, itemsCount, searchChar, category]);

    // useEffect(() => {
    //     setCurrentPage(1);
    //     setSearchChar("");
    //     handleGetData(1, itemsCount, "");
    //     if (searchInputRef.current) {
    //         searchInputRef.current.value = "";
    //     }
    // }, [APIFunction, dataField])

    useEffect(() => {
        if (forceRequest === 0) return;
        if (data.length === 1 && currentPage > 1) {
            setCurrentPage(prevValue => prevValue - 1);
        } else {
            handleGetData(currentPage, itemsCount, searchChar);
        }
    }, [forceRequest])

    useEffect(() => {
        if (currentPage > pagesCount) {
            setCurrentPage(1);
        }
    }, [pagesCount]);

    return (
        <>
            <div className="flex justify-between items-center flex-wrap gap-3 px-2 mt-1 mb-3">
                <div className={`flex ${loading ? "pointer-events-none" : ""}`}>
                    {!withoutSearch && (
                        <input type="text"
                            className={`bg-slate-800 max-w-[150px] sm:w-[250px] sm:max-w-none 
                            border-none px-3 py-1.5 outline-none placeholder:text-sm disabled:opacity-60
                            ${hasCategory ? "rounded-s-[20px]" : "rounded-[20px]"}`}
                            placeholder={searchTitle || "جست و جو"}
                            onChange={(ev) => handleSetSearchChar(ev)}
                            ref={searchInputRef}
                        />
                    )}
                    {hasCategory && (
                        <select
                            value={category}
                            onChange={(ev) => handleSetCategory(ev)}
                            className="bg-slate-700 px-3 py-1.5 outline-none
                                max-w-[140px] border-none rounded-e-[20px]"
                        >
                            {categoryOptions.map(opt => (
                                <option
                                    key={`status_${opt.value}`}
                                    value={opt.value}
                                >
                                    {opt.text}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {children && (
                    <div className="flex items-center flex-wrap gap-4">
                        {children}
                    </div>
                )}
            </div>
            <div className="w-full overflow-x-auto mb-4">
                {loading ? (
                    <div className="w-full flex flex-col 
                    items-center justify-center gap-3 
                    px-4 py-12">
                        <CircularProgress
                            size={50}
                            sx={{
                                color: "#f16d01"
                            }}
                        />
                        <span className="text-primary text-lg">
                            لطفاً صبر کنید...
                        </span>
                    </div>
                ) : data.length > 0 ? (
                    <table
                        className="w-full min-w-[600px] 
                        rounded-[20px] overflow-hidden 
                        bg-slate-800 text-white"
                    >
                        <thead className="primary-font bg-black">
                            <tr>
                                {rowTitle && (
                                    <th
                                        align="center"
                                        className="text-white font-bold
                                        px-2 py-4"
                                    >
                                        {rowTitle}
                                    </th>
                                )}
                                {tableCols.map((col, index) => (
                                    <th
                                        key={`${Math.random()}_${index}`}
                                        align="center"
                                        className="text-white font-bold
                                        px-2 py-4"
                                    >
                                        {col.text}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((data, index) => (
                                <tr
                                    key={`${Math.random()}_${index}`}
                                >
                                    {rowTitle && (
                                        <td
                                            align="center"
                                            className="text-white px-2 py-4"
                                        >
                                            {index + 1}
                                        </td>
                                    )}
                                    {tableCols.map((col, index) => (
                                        <td
                                            key={`${Math.random()}_${index}`}
                                            align="center"
                                            className="text-white px-2 py-4"
                                        >
                                            {col.field ? data[col.field] : col.element(data)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="w-full px-4 py-12 
                    text-center text-red-500 text-xl sm:text-2xl md:text-2xl">
                        {noDataText || "هیچ نتیجه ای یافت نشد!"}
                    </div>
                )}
            </div>

            {pagesCount > 1 && (
                <div className={`mt-8 w-full
                  flex justify-center items-center children-dir-ltr
                  ${loading ? "pointer-events-none" : ""}`}>
                    <Pagination
                        count={pagesCount}
                        page={currentPage}
                        boundaryCount={1}
                        onChange={(ev, page) => handleSetCurrentPage(ev, page)}
                        color="primary"
                        sx={{
                            direction: "ltr !important",
                            "& .MuiPagination-ul": {
                                direction: "ltr !important",
                            },
                            "& .MuiPagination-ul li>:is(button, div)": {
                                color: "white"
                            },
                            "& button.MuiButtonBase-root.MuiPaginationItem-root.Mui-selected:not(.MuiPaginationItem-previousNext)": {
                                backgroundColor: "#343840 !important",
                            }
                        }}
                    />
                </div>
            )}
        </>
    );
}

export default DataTablePagination;
