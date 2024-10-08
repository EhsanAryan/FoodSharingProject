import { logoutAction } from "@/app/actions/actions";
import { changeUserPasswordByAdminService } from "@/services/userServices";
import { Alert } from "@/utils/popupWindows";
import * as Yup from "yup";

export const initialValues = {
    new_password: "",
    confirm_password: "",
}

export const onSubmit = async (values, actions, setIsLogin, setIsAdmin, notFound, rowData, setIsOpen) => {
    try {
        const response = await changeUserPasswordByAdminService(rowData._id, values);
        if (response.status === 200) {
            Alert(null, `رمز عبور کاربر "${rowData.username}" با موفقیت به روز رسانی شد.`, "success");
            setIsOpen(false);
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
    new_password: Yup.string().required("این فیلد الزامی می‌باشد")
        .min(6, "کلمه عبور باید شامل حداقل 6 کاراکتر باشد")
        .matches(/^[a-zA-Z0-9@_]+$/, "کلمه عبور نباید شامل کاراکترهای غیرمجاز باشد")
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9@_]+$/, "کلمه عبور حتماً باید شامل حروف انگلیسی و عدد باشد"),
    confirm_password: Yup.string().required("این فیلد الزامی می‌باشد")
        .oneOf([Yup.ref("new_password")], "رمز عبور با تکرار آن مطابقت ندارد")
        .min(6, "کلمه عبور باید شامل حداقل 6 کاراکتر باشد")
        .matches(/^[a-zA-Z0-9@_]+$/, "کلمه عبور نباید شامل کاراکترهای غیرمجاز باشد")
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9@_]+$/, "کلمه عبور حتماً باید شامل حروف انگلیسی و عدد باشد"),
});
