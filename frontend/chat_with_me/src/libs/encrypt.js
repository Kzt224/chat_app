import CryptoJS from "crypto-js";

const secretKey = "poekaung_myLove";

export const encodedData = (user) => {
   return CryptoJS.AES.encrypt(JSON.stringify(user),secretKey).toString();
}

export const decodeData = (encodedData) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encodedData,secretKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        return null;
    }
} 