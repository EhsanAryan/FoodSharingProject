import httpService from "./httpService"

export const getUsersService = (page, pageSize = 20, searchChar = "") => {
    return httpService(`/api/admin/users/${page}?page_size=${pageSize}&search=${searchChar}`, "get");
}

export const changeUserPasswordByAdminService = (userId, data) => {
    return httpService(`/api/admin/users/password/${userId}`, "put", data);
}

export const getUserInfoService = () => {
    return httpService("/api/user/info", "get");
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

export const getUserFoodsService = (searchChar = "") => {
    return httpService(`/api/user/foods?search=${searchChar}`, "get");
}