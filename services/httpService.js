import axios from "axios";

// URLS
export const base_api_url = "http://localhost:3002";

// HTTP SERVICE (AXIOS)
const httpService = (url, method, data=null, contentType="application/json", responseType="json") => {
    const token = localStorage.getItem("foodToken") ? JSON.parse(localStorage.getItem("foodToken")) : null;
    return axios({
        // url: base_api_url + url,
        url: url,
        method,
        data,
        responseType,
        headers: {
            "Content-Type": contentType,
            "Authorization": token ? `Bearer ${token.access_token}` : null,
        },
    });
}

export default httpService;