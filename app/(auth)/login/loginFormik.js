import { loginService } from "@/services/authServices";
import { Alert } from "@/utils/popupWindows";
import * as Yup from "yup";

export const initialValues = {
    username: "",
    password: ""
}

export const onSubmit = async (values, actions, router, setIsLogin) => {
    try {
        const response = await loginService(values);
        if (response.status === 200) {
            Alert(null, "ورود موفقیت آمیز بود", "success");
            setIsLogin(true);
            router.push("/");
        }
    } catch (error) {
        if (error?.response?.status && error?.response?.data?.message) {
            Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
        } else {
            Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
        }
    }
}

export const validationSchema = Yup.object({
    username: Yup.string().required("این فیلد الزامی می‌باشد")
        .min(5, "نام کاربری باید شامل حداقل 5 کاراکتر باشد")
        .matches(/^[a-zA-Z0-9@_]+$/, "نام کاربری نباید شامل کاراکترهای غیرمجاز باشد")
        .matches(/^[a-zA-Z]+[a-zA-Z0-9@_]+$/, "نام کاربری نباید با عدد یا کاراکترهای خاص شروع شود"),
    password: Yup.string().required("این فیلد الزامی می‌باشد")
        .min(6, "کلمه عبور باید شامل حداقل 6 کاراکتر باشد")
        .matches(/^[a-zA-Z0-9@_]+$/, "کلمه عبور نباید شامل کاراکترهای غیرمجاز باشد")
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9@_]+$/, "کلمه عبور حتماً باید شامل حروف انگلیسی و عدد باشد"),
});