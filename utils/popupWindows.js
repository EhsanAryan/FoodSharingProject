import swal from "sweetalert";

export const Alert = (title, text, icon, buttonText) => {
    return swal({
        title,
        text,
        icon,
        button: buttonText || "متوجه شدم"
    });
}

export const Confirm = (title, text, icon, dangerMode, cancelButton, okButton) => {
    return swal({
        title,
        text,
        icon,
        dangerMode,
        buttons: [cancelButton || "لغو", okButton || "تایید"]
    });
}