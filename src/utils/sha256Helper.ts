import * as CryptoJS from "crypto-js";

class sha256Helper {
  public static encrypt(input: string): string {
    // Convierte el string de entrada a bytes
    const inputBytes = CryptoJS.enc.Utf8.parse(input);

    // Calcula el hash SHA-256
    const sha256Hash = CryptoJS.SHA256(inputBytes);

    // Convierte el hash a una representación hexadecimal
    const sha256Hex = sha256Hash.toString(CryptoJS.enc.Hex);

    return sha256Hex;
  }
}

export default sha256Helper;
