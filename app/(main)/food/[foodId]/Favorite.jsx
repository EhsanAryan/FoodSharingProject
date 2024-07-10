"use client";

import React, { useContext, useState } from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Tooltip } from '@mui/material';
import { logoutAction } from '@/app/actions/actions';
import { MainContext } from '@/context/MainContextContainer';
import { addFoodToFavoritesService, removeFoodFromFavoritesService } from '@/services/userServices';
import { Alert } from '@/utils/popupWindows';

const Favorite = ({ food }) => {
    const { setIsLogin, setIsAdmin } = useContext(MainContext);

    const [isFavorite, setIsFavorite] = useState(food.is_favorite);
    const [loading, setLoading] = useState(false);

    const addFoodToFavoritesHandler = async (foodId) => {
        setLoading(true);
        try {
            const response = await addFoodToFavoritesService(foodId);
            if (response.status === 201) {
                Alert(null, "غذای مورد نظر به علاقه مندی‌های شما افزوده شد.", "success");
                setIsFavorite(true);
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

    const removeFoodFromFavoritesHandler = async (foodId) => {
        setLoading(true);
        try {
            const response = await removeFoodFromFavoritesService(foodId);
            if (response.status === 200) {
                Alert(null, "غذای مورد نظر از علاقه مندی‌های شما حذف شد.", "success");
                setIsFavorite(false);
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
        <div className={`w-full relative mt-12 pb-8 sm:px-4 md:px-8 flex justify-end items-center
        ${loading ? "pointer-events-none" : ""}`}>
            <FavoriteIcon sx={{ fontSize: "2.5rem", color: "#dc2626" }}
                className={`absolute top-0 bottom-0 my-auto left-[2.5%]
                favorite-icon ${isFavorite ? "active" : ""}`}
            />
            <Tooltip
                title={isFavorite ? "حذف از علاقه مندی‌ها" : "افزودن به علاقه مندی‌ها"}
                arrow
                placement="top-start"
            >
                <FavoriteBorderIcon sx={{ fontSize: "2.5rem", color: "#dc2626" }}
                    className="absolute top-0 bottom-0 my-auto left-[2.5%] cursor-pointer z-[1]"
                    onClick={isFavorite ?
                        () => removeFoodFromFavoritesHandler(food._id) :
                        () => addFoodToFavoritesHandler(food._id)
                    }
                />
            </Tooltip>
        </div>
    );
}

export default Favorite;
