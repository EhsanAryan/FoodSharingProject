const convertToFormdata = (obj) => {
    const formdata = new FormData();
    if(!obj) return;
    for(let fieldName in obj) {
        formdata.append(fieldName, obj[fieldName]);
    }
    return formdata;
}

export default convertToFormdata;