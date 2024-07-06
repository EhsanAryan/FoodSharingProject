import { CircularProgress, Pagination } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Alert } from '../../utils/popupWindows';

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
}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [pagesCount, setPagesCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchChar, setSearchChar] = useState("");
    const [itemsCount, setItemsCount] = useState(20);

    const searchInputRef = useRef(null);

    let searchCharTimeout;

    const handleGetData = async (currentPage, itemsCnt, char) => {
        setLoading(true);
        try {
            const response = await APIFunction(currentPage, itemsCnt, char);
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

    useEffect(() => {
        handleGetData(currentPage, itemsCount, searchChar);
    }, [currentPage, itemsCount, searchChar]);

    // useEffect(() => {
    //     setCurrentPage(1);
    //     setSearchChar("");
    //     handleGetData(1, itemsCount, "");
    //     if (searchInputRef.current) {
    //         searchInputRef.current.value = "";
    //     }
    // }, [APIFunction, dataField])

    useEffect(() => {
        if(forceRequest === 0) return;
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
                {!withoutSearch && (
                    <div>
                        <input type="text"
                            className="bg-slate-800 min-w-[200px] sm:w-[280px] max-w-sm px-3 py-1.5 outline-none
                            rounded-[20px] placeholder:text-sm disabled:opacity-60"
                            placeholder={searchTitle || "جست و جو"}
                            onChange={(ev) => handleSetSearchChar(ev)}
                            ref={searchInputRef}
                        />
                    </div>
                )}
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
                  flex justify-center items-center
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
