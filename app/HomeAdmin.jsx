"use client";

import { getFoodsService } from '@/services/foodServices';
import React, { useState } from 'react';
import DataTablePagination from '@/components/Table/DataTablePagination';
import Actions from './Actions';
import { foodCategoryOptions } from '@/data/data';

const HomeAdmin = () => {
    const [forceRequest, setForceRequest] = useState(0);

    const tableCols = [
        // {
        //     text: "شناسه",
        //     field: "_id"
        // },
        {
            text: "نام",
            field: "title"
        },
        {
            text: "چکیده",
            field: "summary"
        },
        {
            text: "عملیات",
            field: null,
            element : (rowData) => <Actions rowData={rowData} setForceRequest={setForceRequest} />
        }

    ];

    return (
        <>
            <h1 className="text-primary mb-3 text-center text-4xl">غذاها</h1>
            <DataTablePagination
                tableCols={tableCols}
                searchTitle="نام غذا را وارد کنید"
                APIFunction={getFoodsService}
                dataField={"data"}
                forceRequest={forceRequest}
                rowTitle="ردیف"
                noDataText="غذایی برای نمایش موجود نیست!"
                hasCategory
                categoryOptions={foodCategoryOptions}
                defaultCategory=""
            >
            </DataTablePagination>
        </>
    );
}

export default HomeAdmin;
