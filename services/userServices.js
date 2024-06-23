import httpService from "./httpService"

export const getUserInfoService = () => {
    return httpService("/api/user/info", "get");
}

export const changeAvatarService = (formData) => {
    return httpService("/api/user/avatar", "post", formData, "multipart/form-data");
}