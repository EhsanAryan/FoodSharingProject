import httpService from "./httpService"

export const getUserInfoService = () => {
    return httpService("/api/user/info", "get");
}

export const getSingleUserService = (userId) => {
    return httpService(`/api/user/info/${userId}`, "get");
}

export const changeUserInfoService = (data) => {
    return httpService("/api/user/info", "put", data);
}

export const changeUserPasswordService = (data) => {
    return httpService("/api/user/password", "put", data);
}

export const changeUserAvatarService = (formData) => {
    return httpService("/api/user/avatar", "post", formData, "multipart/form-data");
}

export const getUserFoodsService = (page = 1, pageSize = 20, searchChar = "", category = "") => {
    return httpService(`/api/user/foods/${page}?page_size=${pageSize}&search=${searchChar}&category=${category}`, "get");
}

export const addFoodToFavoritesService = (foodId) => {
    return httpService(`/api/user/favorite/${foodId}`, "put")
}

export const removeFoodFromFavoritesService = (foodId) => {
    return httpService(`/api/user/favorite/${foodId}`, "delete")
}


// Only admin APIs
export const getUsersService = (page = 1, pageSize = 20, searchChar = "") => {
    return httpService(`/api/admin/users/${page}?page_size=${pageSize}&search=${searchChar}`, "get");
}

export const changeUserPasswordByAdminService = (userId, data) => {
    return httpService(`/api/admin/users/password/${userId}`, "put", data);
}

export const changeUserInfoByAdminService = (userId, data) => {
    return httpService(`/api/admin/users/info/${userId}`, "put", data);
}