import axios from "axios";

export const createBlobURL = async (url, type, token) => {
    let blob;
    try {
        const response = await axios.get(url, {
            responseType: "blob",
            headers: {
                "Authorization": token ? `Bearer ${token}` : null,
            }
        });
        if (response.status === 200) {
            if (type) {
                blob = new Blob([response.data], { type });
            } else {
                blob = response.data;
            }
        }
    } catch (error) {

    }

    return {
        blob: blob || null,
        url: blob ? URL.createObjectURL(blob) : ""
    };
}


export const createFileURL = async (url, fileName, type, token) => {
    let file;
    try {
        const response = await axios.get(url, {
            responseType: "blob",
            headers: {
                "Authorization": token ? `Bearer ${token}` : null,
            }
        });
        if (response.status === 200) {
            file = new File([response.data], fileName, { type: type || response.data.type });
        }
    } catch (error) {

    }

    return {
        file: file || null,
        url: file ? URL.createObjectURL(file) : ""
    };
}