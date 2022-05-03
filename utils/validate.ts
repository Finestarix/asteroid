export const checkMultipleUndefined = (...data: unknown[]) => {
    for (let i = data.length; i--;) {
        if (data[i] === undefined || data[i] === null) {
            return true;
        }
    }
    return data.length <= 0;
};
