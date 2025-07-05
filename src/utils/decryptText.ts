import CryptoJS from "crypto-js";
import phraseStore from "@/store/savePhrase";

export function decryptText(ciphertext: string): string {
      const dePhrase = phraseStore.getState().dePhrase;


  const bytes = CryptoJS.AES.decrypt(ciphertext, dePhrase);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
}
