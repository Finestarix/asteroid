const tokenKey = "token";
const modeKey = "mode";

export const setSessionToken = (token: string) => sessionStorage.setItem(tokenKey, token);
export const getSessionToken = () => {
    const sessionToken = sessionStorage.getItem(tokenKey);
    return (sessionToken) ? sessionToken : "";
};
export const removeSessionToken = () => sessionStorage.removeItem(tokenKey);

export const setLocalMode = (newMode: boolean) => localStorage.setItem(modeKey, String(newMode));
export const getLocalMode = () => localStorage.getItem(modeKey);
