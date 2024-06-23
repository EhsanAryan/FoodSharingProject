import moment from "moment-jalaali";

export const convertDateToJalaali = (date, outputFormat="jYYYY/jMM/jDD") => {
    const jalaaliDate = moment(date);
    return jalaaliDate.format(outputFormat);
}

export const convertDateToGregorian = (date, inputFormat="jYYYY/jMM/jDD", outputFormat="YYYY-MM-DD") => {
    const gregorianDate = moment(date, inputFormat);
    return gregorianDate.format(outputFormat);
}
