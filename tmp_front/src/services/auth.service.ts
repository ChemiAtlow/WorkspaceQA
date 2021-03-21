import axios from "axios";

let cookieValidatedViaBackend = false;

export const authToBackend = async (code: string) => {
    try {
        const result = await axios.post(
            `${process.env?.VUE_APP_BASE_URL}auth/git`,
            { code }
        );
        document.cookie = result.data;
        return;
    } catch (err) {
        console.log({ ...err });
        return err?.response?.data?.message as string;
    }
};

export const validatedCookieViaBackend = async (token: string) => {
    const result = await axios.post<boolean>(
        `${process.env?.VUE_APP_BASE_URL}auth/cookie-validate`,
        { token }
    );
    return result.data;
};

export const getJWTCookie = () => {
    const decodedCookie = decodeURIComponent(document.cookie).split("; ");
    const jwtToken = decodedCookie
        .find(row => /^Authorization/.test(row))
        ?.split("=")[1];
    const isValid = /jwt [a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)/g.test(
        jwtToken || ""
    );
    return isValid && `${jwtToken}`;
};

export const validateJWTCookie = async () => {
    const isValid = getJWTCookie();
    let isBackendValid = false;
    if (isValid && !cookieValidatedViaBackend) {
        isBackendValid = await validatedCookieViaBackend(
            `${isValid.split(" ")[1]}`
        );
        cookieValidatedViaBackend = isBackendValid;
    }
    return isValid && cookieValidatedViaBackend;
};

let callbackRoute = "";
export const setCallbackRoute = (route: string) => {
    callbackRoute = route;
};
export const getCallbackRoute = () => {
    const route = callbackRoute;
    setCallbackRoute("");
    return route;
};
