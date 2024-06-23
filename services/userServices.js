import httpService from "./httpService"

export const getUserInfoService = () => {
    return httpService("/api/user/info", "get");
}