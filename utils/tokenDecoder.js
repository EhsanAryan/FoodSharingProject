const tokenDecoder = (token) => {
    if(!token) {
        return;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const decodedToken = JSON.parse(window.atob(base64));
    return decodedToken;
}

export default tokenDecoder;