import httpService from "./httpService"

export const getFoodsService = (page, pageSize=20) => {
    return httpService(`/api/foods/${page}?page_size=${pageSize}`, "get");
}