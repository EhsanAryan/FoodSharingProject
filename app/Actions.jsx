"use client";

import Link from 'next/link';
import React, { useContext, useState } from 'react';
import SubjectIcon from '@mui/icons-material/Subject';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, Confirm } from '@/utils/popupWindows';
import { deleteFoodService } from '@/services/foodServices';
import { logoutAction } from './actions/actions';
import { MainContext } from '@/context/MainContextContainer';

const Actions = ({ rowData, setForceRequest }) => {
    const { setIsLogin, setIsAdmin } = useContext(MainContext);

    const [loading, setLoading] = useState(false);

    const foodDeleteHandler = async (foodId) => {
        const confirm = await Confirm("تایید عملیات", "آیا از حذف این غذا مطمئن هستید؟", "warning", true, "لغو", "بله");
        if (!confirm) return;
        setLoading(true);
        try {
            const response = await deleteFoodService(foodId);
            if (response.status === 200) {
                Alert(null, "غذای مورد نظر با موفقیت حذف شد", "success");
                setForceRequest(prevValue => prevValue + 1);
            }
        } catch (error) {
            if (error?.response?.status && error?.response?.data?.message) {
                await Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
                if (error.response.status === 401) {
                    await logoutAction();
                    setIsLogin(false);
                    setIsAdmin(0);
                }
            } else {
                await Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className={`flex items-center justify-center gap-4
        ${loading ? "pointer-events-none" : ""}`}>
            <Link
                href={`/food/${rowData._id}`}
                className="px-4 py-1.5 rounded-lg green-btn
                flex justify-center items-center gap-2"
            >
                <SubjectIcon />
                <span>جزئیات</span>
            </Link>
            <Link
                href={`/sharing-food/${rowData._id}`}
                className="px-4 py-1.5 rounded-lg yellow-btn
                flex justify-center items-center gap-2"
            >
                <EditIcon />
                <span>ویرایش</span>
            </Link>
            <button
                type="button"
                className="px-4 py-1.5 rounded-lg red-btn
                flex justify-center items-center gap-2"
                onClick={() => foodDeleteHandler(rowData._id)}
            >
                <DeleteIcon />
                <span>حذف</span>
            </button>
        </div>
    );
}

export default Actions;
