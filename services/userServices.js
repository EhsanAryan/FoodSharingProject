import httpService from "./httpService"

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

export const getUserFoodsService = (searchChar="") => {
    return httpService(`/api/user/foods?search=${searchChar}`, "get");
}