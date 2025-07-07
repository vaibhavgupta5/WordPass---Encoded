# 🔐 WordPass

> A super secure and funny password wallet that screams **AHHH** while keeping your secrets safe. 😎

## 🧠 How It Works

WordPass asks you for a **passphrase** (which we call *The Holy Phrase* 🧙‍♂️) during onboarding.

- This phrase is **hashed using `bcrypt`** and stored safely in the database.
- Whenever you log in, your phrase is **compared using bcrypt** (since bcrypt hashes can't be decrypted).
- We temporarily keep the raw phrase in client memory using **Zustand** (shhh... it's just for encoding/decoding).
- Each password you save is **encrypted using `crypto-js` AES** with your phrase as the key.
- This means your actual passwords are NEVER stored in raw form, even on the backend — not even for fun. 🏳️‍🌈 **Gay-approved security**.
- To decrypt, you need to enter the same passphrase — or the wallet goes **AHHH 💥**.

So in short:  
**bcrypt = for passphrase check**  
**crypto-js AES = for actual password encryption/decryption**

No raw data touches the server. It's clean, lean, and meme-friendly. 🔐💅

## ⚙️ Tech Stack Used

| Tech         | Purpose                         |
|--------------|----------------------------------|
| **Next.js**  | Full-stack React framework       |
| **TypeScript** | Strong typing & safety         |
| **Zustand**  | Lightweight state management for holding the raw phrase (temporarily!) |
| **bcryptjs** | Hashing the phrase               |
| **crypto-js** | AES encryption of passwords     |
| **Tailwind CSS** | UI styling                   |
| **Firebase** | Database for storing encrypted passwords & phrase hashes |

## 🛠️ Setup Instructions

1. Clone the repo

```bash
git clone https://github.com/yourusername/passwallet.git
cd passwallet

>Yaa this readme is GPT written..
