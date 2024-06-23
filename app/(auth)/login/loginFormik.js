import { loginAction } from "@/app/actions/authActions";
import { Alert } from "@/utils/popupWindows";
import * as Yup from "yup";

export const initialValues = {
    username: "",
    password: ""
}

export const onSubmit = async (values, actions) => {
    const response = await loginAction(values);
    if (response.status === 200) {
        actions.resetForm();
    } else {
        Alert("خطا!", response.message, "error");
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