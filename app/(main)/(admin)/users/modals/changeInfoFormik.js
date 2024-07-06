import { logoutAction } from "@/app/actions/actions";
import { changeUserInfoByAdminService } from "@/services/userServices";
import { Alert } from "@/utils/popupWindows";
import * as Yup from "yup";

export const initialValues = {
    username: "",
    first_name: "",
    last_name: "",
}

export const onSubmit = async (values, actions, setIsLogin, setIsAdmin, notFound, rowData, setIsOpen, setForceRequest) => {
    try {
        const response = await changeUserInfoByAdminService(rowData._id, values);
        if (response.status === 200) {
            Alert(null, `اطلاعات کاربر با موفقیت به روز رسانی شد.`, "success");
            setIsOpen(false);
            setForceRequest(prevValue => prevValue + 1);
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
    username: Yup.string().required("این فیلد الزامی می‌باشد")
        .min(5, "نام کاربری باید شامل حداقل 5 کاراکتر باشد")
        .matches(/^[a-zA-Z0-9@_]+$/, "نام کاربری نباید شامل کاراکترهای غیرمجاز باشد")
        .matches(/^[a-zA-Z]+[a-zA-Z0-9@_]+$/, "نام کاربری نباید با عدد یا کاراکترهای خاص شروع شود"),
    first_name: Yup.string().required("این فیلد الزامی می‌باشد")
        .matches(/^(\s)*([\u0600-\u06FF]+(\s)*)+$/, "لطفاً فقط از حروف فارسی استفاده کنید"),
    last_name: Yup.string().required("این فیلد الزامی می‌باشد")
        .matches(/^(\s)*([\u0600-\u06FF]+(\s)*)+$/, "لطفاً فقط از حروف فارسی استفاده کنید"),
});
