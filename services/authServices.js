import httpService from "./httpService"

export const registerService = (data) => {
    return httpService("/api/auth/register", "post", data);
}

export const loginService = (data) => {
    return httpService("/api/auth/login", "post", data);
}