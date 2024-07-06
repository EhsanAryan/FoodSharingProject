"use client";

import React, { useState } from 'react';
import DataTablePagination from '@/components/Table/DataTablePagination';
import Actions from './Actions';
import { getUsersService } from '@/services/userServices';
import { Avatar } from '@mui/material';

const Page = () => {
    const [forceRequest, setForceRequest] = useState(0);

    const tableCols = [
        {
            text: "نام کاربری",
            field: "username"
        },
        {
            text: "آواتار",
            field: null,
            element: (rowData) => {
                return rowData.avatar ? (
                    <Avatar
                        src={rowData.avatar || ""}
                        alt="Food Creator avatar"
                        sx={{
                            width: "75px",
                            height: "75px",
                            cursor: "pointer"
                        }}
                        onClick={() => window.open(rowData.avatar)}
                    />
                ) : (
                    <span className="text-red-500 text-center">فاقد آواتار</span>
                )
            }
        },
        {
            text: "نام",
            field: "first_name"
        },
        {
            text: "نام خانوادگی",
            field: "last_name"
        },
        {
            text: "عملیات",
            field: null,
            element : (rowData) => <Actions rowData={rowData} setForceRequest={setForceRequest} />
        },
    ];

    return (
        <>
            <h1 className="text-primary mb-3 text-center text-4xl">کاربران</h1>
            <DataTablePagination
                tableCols={tableCols}
                searchTitle="نام کاربری را وارد کنید"
                APIFunction={getUsersService}
                dataField={"data"}
                forceRequest={forceRequest}
                rowTitle="ردیف"
                noDataText="کاربری برای نمایش موجود نیست!"
            >
            </DataTablePagination>
        </>
    );
}

export default Page;
