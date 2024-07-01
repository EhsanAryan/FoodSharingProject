import httpService from "./httpService"

export const getFoodsService = (page, pageSize=20) => {
    return httpService(`/api/foods/${page}?page_size=${pageSize}`, "get");
}

export const getSingleFoodService = (foodId) => {
    return httpService(`/api/food/${foodId}`, "get");
}

export const createNewFoodService = (formData) => {
    return httpService("/api/food", "post", formData, "multipart/form-data")
}

export const updateFoodService = (foodId, formData) => {
    return httpService(`/api/food/${foodId}`, "put", formData, "multipart/form-data")
}

export const deleteFoodService = (foodId) => {
    return httpService(`/api/food/${foodId}`, "delete")
}

export const getFoodsOfUserService = (userId) => {
    return httpService(`/api/foods/user/${userId}`, "get");
}