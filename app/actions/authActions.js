"use server";

export const loginAction = async (data) => {
    console.log(data);
    if(data) {
        return {
            status: 200,
            data: data
        };
    } else {
        return {
            status: 400,
            message: "ایراد داشت"
        };
    }
}

export const registerAction = async (data) => {
    console.log(data);
    if(data) {
        return {
            status: 200,
            data: data
        };
    } else {
        return {
            status: 400,
            message: "ایراد داشت"
        };
    }
}