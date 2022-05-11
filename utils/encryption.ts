import CryptoJS from "crypto-js";


const key = "5uP3rS3cR37";

export const encryptData = (data: string) => CryptoJS.AES.encrypt(data, key).toString();
export const decryptData = (data: string) => CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
