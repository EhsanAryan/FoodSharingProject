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
    const { setIsLogin, setIsAdmin, setForceGetUserInfo } = useContext(MainContext);

    const [isFavorite, setIsFavorite] = useState(food.is_favorite);
    const [likes, setLikes] = useState(food.likes)
    const [loading, setLoading] = useState(false);

    const addFoodToFavoritesHandler = async (foodId) => {
        setLoading(true);
        try {
            const response = await addFoodToFavoritesService(foodId);
            if (response.status === 201) {
                Alert(null, "غذای مورد نظر به علاقه مندی‌های شما افزوده شد.", "success");
                setIsFavorite(true);
                setLikes(prevValue => prevValue + 1);
                setForceGetUserInfo(prevValue => prevValue + 1);
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
                if (likes > 0) {
                    setLikes(prevValue => prevValue - 1);
                }
                setForceGetUserInfo(prevValue => prevValue + 1);
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
        <div
            className={`w-full relative mt-12 py-9 ${loading ? "pointer-events-none" : ""}`}
        >
            <div className="absolute top-0 left-[2.5%] flex flex-col items-center gap-2">
                <FavoriteIcon sx={{ fontSize: "2.5rem", color: "#dc2626" }}
                    className={`favorite-icon ${isFavorite ? "active" : ""}`}
                />
                <Tooltip
                    title={isFavorite ? "حذف از علاقه مندی‌ها" : "افزودن به علاقه مندی‌ها"}
                    arrow
                    placement="top-start"
                >
                    <FavoriteBorderIcon sx={{ fontSize: "2.5rem", color: "#dc2626" }}
                        className="absolute top-0 left-0 cursor-pointer z-[1]"
                        onClick={isFavorite ?
                            () => removeFoodFromFavoritesHandler(food._id) :
                            () => addFoodToFavoritesHandler(food._id)
                        }
                    />
                </Tooltip>
                <div className="text-xl text-[#dc2626] font-bold">
                    {likes}
                </div>
            </div>
        </div>
    );
}

export default Favorite;
