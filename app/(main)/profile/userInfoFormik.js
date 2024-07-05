import { logoutAction } from "@/app/actions/actions";
import { changeUserInfoService } from "@/services/userServices";
import { Alert } from "@/utils/popupWindows";
import * as Yup from "yup";

export const initialValues = {
    first_name: "",
    last_name: "",
}

export const onSubmit = async (values, actions, setUser, setIsLogin, setIsAdmin, notFound) => {
    try {
        const response = await changeUserInfoService(values);
        if (response.status === 200) {
            setUser(response.data);
            Alert(null, "اطلاعات شما با موفقیت به روز رسانی شد.", "success");
        }
    } catch (error) {
        if (error?.response?.status && error?.response?.data?.message) {
            Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
            if (error.response.status === 401) {
                await logoutAction();
                setIsLogin(false);
                setIsAdmin(0);
                notFound();
            }
        } else {
            Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
        }
    }
}

export const validationSchema = Yup.object({
    first_name: Yup.string().required("این فیلد الزامی می‌باشد")
        .matches(/^(\s)*([\u0600-\u06FF]+(\s)*)+$/, "لطفاً فقط از حروف فارسی استفاده کنید"),
    last_name: Yup.string().required("این فیلد الزامی می‌باشد")
        .matches(/^(\s)*([\u0600-\u06FF]+(\s)*)+$/, "لطفاً فقط از حروف فارسی استفاده کنید"),
});
