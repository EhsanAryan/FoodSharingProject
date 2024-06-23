import { registerAction } from "@/app/actions/authActions";
import { Alert } from "@/utils/popupWindows";
import * as Yup from "yup";

export const initialValues = {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
}

export const onSubmit = async (values, actions) => {
    const response = await registerAction(values);
    if (response.status === 200) {
        actions.resetForm();
    } else {
        Alert("خطا!", response.message, "error");
    }
}

export const validationSchema = Yup.object({
    first_name: Yup.string().required("این فیلد الزامی می‌باشد")
        .matches(/^(\s)*([\u0600-\u06FF]+(\s)*)+$/, "لطفاً فقط از حروف فارسی استفاده کنید"),
    last_name: Yup.string().required("این فیلد الزامی می‌باشد")
        .matches(/^(\s)*([\u0600-\u06FF]+(\s)*)+$/, "لطفاً فقط از حروف فارسی استفاده کنید"),
    username: Yup.string().required("این فیلد الزامی می‌باشد")
        .min(5, "نام کاربری باید شامل حداقل 5 کاراکتر باشد")
        .matches(/^[a-zA-Z0-9@_]+$/, "نام کاربری نباید شامل کاراکترهای غیرمجاز باشد")
        .matches(/^[a-zA-Z]+[a-zA-Z0-9@_]+$/, "نام کاربری نباید با عدد یا کاراکترهای خاص شروع شود"),
    email: Yup.string().required("این فیلد الزامی می‌باشد")
        .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z]+(\.[a-zA-Z]{2,})+$/, "لطفاً یک ایمیل معتبر وارد کنید"),
    password: Yup.string().required("این فیلد الزامی می‌باشد")
        .min(6, "کلمه عبور باید شامل حداقل 6 کاراکتر باشد")
        .matches(/^[a-zA-Z0-9@_]+$/, "کلمه عبور نباید شامل کاراکترهای غیرمجاز باشد")
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9@_]+$/, "کلمه عبور حتماً باید شامل حروف انگلیسی و عدد باشد"),
    confirm_password: Yup.string().required("این فیلد الزامی می‌باشد")
        .oneOf([Yup.ref("password")], "رمز عبور با تکرار آن مطابقت ندارد")
        .min(6, "کلمه عبور باید شامل حداقل 6 کاراکتر باشد")
        .matches(/^[a-zA-Z0-9@_]+$/, "کلمه عبور نباید شامل کاراکترهای غیرمجاز باشد")
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9@_]+$/, "کلمه عبور حتماً باید شامل حروف انگلیسی و عدد باشد"),
});
