import { Alert } from "@/utils/popupWindows";
import * as Yup from "yup";

export const initialValues = {
    old_password: "",
    password: "",
    confirm_password: "",
}

export const onSubmit = async (values, actions, router) => {
    // const response = await registerAction(values);
    // if (response.status === 200) {
    //     await Alert(null, "حساب کاربری شما با موفقیت ایجاد شد", "success");
    //     router.push("/login");
    // } else {
    //     Alert("خطا!", response.message, "error");
    // }
}

export const validationSchema = Yup.object({
    old_password: Yup.string().required("این فیلد الزامی می‌باشد")
        .min(6, "کلمه عبور باید شامل حداقل 6 کاراکتر باشد")
        .matches(/^[a-zA-Z0-9@_]+$/, "کلمه عبور نباید شامل کاراکترهای غیرمجاز باشد")
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9@_]+$/, "کلمه عبور حتماً باید شامل حروف انگلیسی و عدد باشد"),
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
