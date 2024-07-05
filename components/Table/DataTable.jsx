import { CircularProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';

const DataTable = ({
    tableCols,
    tableData,
    itemsCount,
    searchField,
    searchTitle,
    searchHandler,
    children,
    isLoading,
    rowTitle,
}) => {
    const [initData, setInitData] = useState(tableData);
    const [shownData, setShownData] = useState([]);
    const [pagesCount, setPagesCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsCnt, setItemsCnt] = useState((itemsCount >= 1 && itemsCount <= 20) ? itemsCount : 6);
    const [searchChar, setSearchChar] = useState("");

    const handleSetCurrentPage = (ev, page) => {
        setCurrentPage(page);
    }

    const handleSetItemsCnt = (ev) => {
        const cnt = parseInt(ev.target.value);
        if (Number.isNaN(cnt)) {
            return setItemsCnt(10);
        } else if (cnt > 20) {
            return setItemsCnt(20);
        } else if (cnt < 1) {
            return setItemsCnt(1);
        }
        setItemsCnt(cnt);
    }

    const handleSetSearchChar = (ev) => {
        const char = ev.target.value;
        setSearchChar(char);
        const data = tableData.filter((d) => {
            return d[searchField].toString().toLowerCase().includes(char.trim().toLowerCase());
        });
        setInitData(data);
    }

    useEffect(() => {
        setInitData(tableData);
    }, [tableData]);

    useEffect(() => {
        const pagesCnt = Math.ceil(initData.length / itemsCnt);
        setPagesCount(pagesCnt);
        if (currentPage > pagesCnt) {
            setCurrentPage(1);
        }
    }, [itemsCnt, initData]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsCnt;
        const endIndex = currentPage * itemsCnt;
        const data = initData.slice(startIndex, endIndex);
        setShownData(data);
    }, [itemsCnt, currentPage, initData]);

    return isLoading ? (
        <div className="flex flex-col 
        items-center justify-center
        py-8">
            <CircularProgress size={50} style={{ color: "#111" }} />
            <span className="text-primary-900 mt-4 text-xl">
                صبر کنید...
            </span>
        </div>
    ) : (
        <>
            <div className="flex justify-between items-center flex-wrap gap-3 px-2 mt-1 mb-3">
                <div className="flex">
                    <input type="text"
                        className="border border-black border-e-0 rounded-s-[20px]
                    outline-none w-[280px] ps-3 pe-1 py-1"
                        placeholder={`جست و جو ${searchTitle ? `(${searchTitle})` : ""}`}
                        value={searchChar}
                        onChange={
                            searchHandler ?
                                (ev) => searchHandler(ev, tableData, setSearchChar, setInitData) :
                                (ev) => handleSetSearchChar(ev)
                        }
                    />
                    <div className="flex justify-center items-center px-4
                    border border-black border-s-0 rounded-e-[20px] bg-white">
                        <img
                            src="/assets/svg/search.svg"
                            alt="search icon"
                        />
                    </div>
                </div>
                {children && (
                    <div className="flex items-center flex-wrap gap-4">
                        {children}
                    </div>
                )}
            </div>
            {/* <div className="flex justify-between items-center flex-wrap mb-5">
                <Tooltip
                    title="تعداد سطرهای جدول (1 تا 20)"
                    arrow={true}
                    placement="bottom"
                >
                    <input type="number"
                        className="border-2 rounded-md 
                        outline-none w-52 px-2 py-1"
                        // min="1" max="20"
                        // value={itemsCnt}
                        placeholder="تعداد سطرها"
                        onChange={(ev) => handleSetItemsCnt(ev)}
                    />
                </Tooltip>
            </div> */}
            <TableContainer component={Paper}
                sx={{
                    overflowX: "auto",
                    mb: 4,
                    borderRadius: "0px",
                    backgroundColor: "transparent",
                }}
                elevation={0}
            >
                {initData.length > 0 ? (
                    <Table
                        sx={{
                            minWidth: "600px",
                            backgroundColor: "#CCCCCC",
                        }}
                        className="rounded-t-[20px] overflow-hidden"
                    >
                        <TableHead
                            sx={{
                                backgroundColor: "#343840"
                            }}
                        >
                            <TableRow
                                sx={{
                                    "& th, & td": {
                                        color: "#fff",
                                        fontWeight: "600",
                                        borderBottom: "none"
                                    }
                                }}
                            >
                                {rowTitle && (
                                    <TableCell align="center">
                                        {rowTitle}
                                    </TableCell>
                                )}
                                {tableCols.map((col, index) => (
                                    <TableCell
                                        key={`${Math.random()}_${index}`}
                                        align="center"
                                    >
                                        {col.text}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shownData.map((data, index) => (
                                <TableRow
                                    key={`${Math.random()}_${index}`}
                                    sx={{
                                        "& th, & td": {
                                            color: "#222",
                                            borderBottom: "none",
                                        },
                                        borderBottom: "none"
                                    }}
                                >
                                    {rowTitle && (
                                        <TableCell align="center">
                                            {index + 1}
                                        </TableCell>
                                    )}
                                    {tableCols.map((col, index) => (
                                        <TableCell
                                            key={`${Math.random()}_${index}`}
                                            align="center"
                                        >
                                            {col.field ? data[col.field] : col.element(data)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="w-full px-3 py-10 text-center text-red-500 text-xl">
                        هیچ نتیجه ای یافت نشد!
                    </div>
                )}
            </TableContainer>
            {pagesCount > 1 && (
                <div className="mt-8 w-full
                  flex justify-center items-center">
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
                            "& button.MuiButtonBase-root.MuiPaginationItem-root.Mui-selected:not(.MuiPaginationItem-previousNext)": {
                                backgroundColor: "#343840 !important"
                            }
                        }}
                    />
                </div>
            )}
        </>
    );
}

export default DataTable;
