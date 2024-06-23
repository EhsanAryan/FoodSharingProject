const addZeroToNumber = (num) => {
    if(num % 10 === num) {
        return `0${num}`;
    }
    return num;
}

export default addZeroToNumber;