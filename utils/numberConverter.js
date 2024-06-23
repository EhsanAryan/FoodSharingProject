export const convertPersianNumberToGeorgianNumber = (number) => {
    let num = number.toString().replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
    return Number.isNaN(Number(num)) ? num : Number(num);
}

export const convertArabicNumberToGeorgianNumber = (number) => {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

    return number
        .toString()
        .replace(/[٠-٩]/g, x => arabicNumbers.findIndex(item => item === x));
}

export const convertGeorgianNumberToPersianNumber = (number) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    return number
        .toString()
        .replace(/\d/g, x => persianDigits[Number(x)]);
}
