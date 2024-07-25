import { logoutAction } from "@/app/actions/actions";
import { updateFoodService } from "@/services/foodServices";
import { Alert } from "@/utils/popupWindows";
import * as Yup from "yup";

export const initialValues = {
    title: "",
    summary: "",
    instruction: "",
    category: "",
    images: [],
}

export const onSubmit = async (values, actions, foodId, router, setIsLogin, setIsAdmin, notFound) => {
    try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("summary", values.summary);
        formData.append("instruction", values.instruction);
        formData.append("category", values.category);
        for (let item of values.images) {
            formData.append("images", item);
        }

        const response = await updateFoodService(foodId, formData);
        if (response.status === 201) {
            Alert(null, "غذای شما با موفقیت به روز رسانی شد.", "success");
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
    summary: Yup.string().required("این فیلد الزامی می‌باشد")
        .max(80, "چکیده باید شامل حداکثر 80 کاراکتر باشد"),
    instruction: Yup.string().required("این فیلد الزامی می‌باشد"),
    category: Yup.string().required("این فیلد الزامی می‌باشد")
        .oneOf(["B", "M", "A"], "فقط از مقادیر مجاز برای این فیلد استفاده کنید"),
    images: Yup.array().of(
        Yup.mixed().required("این فیلد الزامی می‌باشد")
            .test("filesize", "حداکثر سایز تصویر باید 2 مگابایت باشد", value => {
                return (value && value?.size <= 2 * 1024 * 1024);
            })
            .test("format", "لطفاً یک تصویر بارگذاری کنید", value => {
                return (value && value?.type?.includes("image/"));
            })
    )
        .min(1, "باید حداقل یک تصویر از غذا بارگذاری کنید.")
        .max(4, "حداکثر میتوانید 4 تصویر را بارگذاری کنید."),
});
