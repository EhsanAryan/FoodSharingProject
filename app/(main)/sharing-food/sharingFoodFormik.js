import { logoutAction } from "@/app/actions/actions";
import { createNewFoodService } from "@/services/foodServices";
import { convertObjectToFormData } from "@/utils/convertObjectToFormData";
import { Alert } from "@/utils/popupWindows";
import * as Yup from "yup";

export const initialValues = {
    title: "",
    summary: "",
    instruction: "",
    image: null,
}

export const onSubmit = async (values, actions, router, setIsLogin, setIsAdmin, notFound) => {
    try {
        const formData = convertObjectToFormData(values);

        const response = await createNewFoodService(formData);
        if (response.status === 200) {
            Alert(null, "غذای شما با موفقیت افزوده شد.", "success");
            router.push("/");
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
    title: Yup.string().required("این فیلد الزامی می‌باشد"),
    summary: Yup.string().required("این فیلد الزامی می‌باشد"),
    instruction: Yup.string().required("این فیلد الزامی می‌باشد"),
    image: Yup.mixed().required("این فیلد الزامی می‌باشد")
        .test("filesize", "حداکثر سایز تصویر باید 3 مگابایت باشد", value => {
            return (value && value?.size <= 3 * 1024 * 1024);
        })
        .test("format", "لطفاً یک تصویر بارگذاری کنید", value => {
            return (value && value?.type?.includes("image/"));
        })
    ,
});
