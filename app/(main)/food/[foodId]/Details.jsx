"use client";

import { Avatar } from '@mui/material';
import React, { useContext, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Confirm } from '@/utils/popupWindows';
import Loading from '@/components/Loading';
import { MainContext } from '@/context/MainContextContainer';
import { logoutAction } from '@/app/actions/actions';
import { deleteFoodService } from '@/services/foodServices';

const Details = ({ food }) => {
    const { setIsLogin } = useContext(MainContext);

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const foodDeleteHandler = async (foodId) => {
        const confirm = await Confirm("تایید عملیات", "آیا از حذف این غذا مطمئن هستید؟", "warning", true, "لغو", "بله");
        if (!confirm) return;
        setLoading(true)
        try {
            const response = await deleteFoodService(foodId);
            if (response.status === 200) {
                Alert(null, "غذای مورد نظر با موفقیت حذف شد", "success");
                router.back();
            }
        } catch (error) {
            if (error?.response?.status && error?.response?.data?.message) {
                await Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
                if (error.response.status === 401) {
                    await logoutAction();
                    setIsLogin(false);
                }
            } else {
                await Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {food.is_owner ? (
                <div className="top-appear flex items-center gap-8 
                    sm:px-4 md:px-8">
                    {loading ? (
                        <Loading
                            size={35}
                            noText
                        />
                    ) : (
                        <>
                            <button
                                type="button"
                                className="flex justify-center items-center gap-2
                                py-2 px-6 rounded-md red-btn"
                                onClick={() => foodDeleteHandler(food._id)}
                            >
                                <DeleteIcon />
                                <span>حذف</span>
                            </button>
                            <Link
                                href={`/sharing-food/${food._id}`}
                                className="flex justify-center items-center gap-2
                        py-2 px-6 rounded-lg yellow-btn"
                            >
                                <EditIcon />
                                <span>ویرایش</span>
                            </Link>
                        </>
                    )}
                </div>
            ) : (
                <div className="right-appear flex items-center gap-4 
                        sm:px-4 md:px-8">
                    <Avatar
                        src={food?.creator?.avatar || ""}
                        alt="Food Creator avatar"
                        sx={{
                            width: "65px",
                            height: "65px",
                        }}
                    />
                    <div className="flex flex-col gap-1">
                        <small>
                            {food?.creator?.username}
                        </small>
                        <small>
                            {`${food?.creator?.first_name || ""} ${food?.creator?.last_name || ""}`}
                        </small>
                    </div>
                </div>
            )}
        </>
    );
}

export default Details;
