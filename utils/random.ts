export const randomEnum = <T>(anEnum: T): T[keyof T] => {
    const enumValues = Object.keys(anEnum) as unknown as T[keyof T][];
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
};