import httpService from "./httpService"

export const getFoodsService = (page = 1, pageSize = 20, searchChar = "", category = "") => {
    return httpService(`/api/foods/${page}?page_size=${pageSize}&search=${searchChar}&category=${category}`, "get");
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

export const getFoodsOfUserService = (userId, page = 1, pageSize = 20, searchChar = "", category = "") => {
    return httpService(`/api/foods/user/${userId}/${page}?page_size=${pageSize}&search=${searchChar}&category=${category}`, "get");
}