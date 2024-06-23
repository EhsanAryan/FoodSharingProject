import { Alert } from "@/utils/popupWindows";
import * as Yup from "yup";

export const initialValues = {
    first_name: "",
    last_name: "",
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
    first_name: Yup.string().required("این فیلد الزامی می‌باشد")
        .matches(/^(\s)*([\u0600-\u06FF]+(\s)*)+$/, "لطفاً فقط از حروف فارسی استفاده کنید"),
    last_name: Yup.string().required("این فیلد الزامی می‌باشد")
        .matches(/^(\s)*([\u0600-\u06FF]+(\s)*)+$/, "لطفاً فقط از حروف فارسی استفاده کنید"),
});
