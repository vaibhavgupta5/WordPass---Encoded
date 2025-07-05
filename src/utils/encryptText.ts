import CryptoJS from "crypto-js";
import phraseStore from "@/store/savePhrase";

export function encryptText(text: string): string {

    const dePhrase = phraseStore.getState().dePhrase;

  const ciphertext = CryptoJS.AES.encrypt(text, dePhrase).toString();
  return ciphertext;
}
