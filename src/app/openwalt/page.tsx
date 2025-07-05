"use client";
import { ArrowBigRight, Lock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { auth, db } from "@/lib/firebase";
import bcrypt from "bcryptjs";
import { useRouter } from "next/dist/client/components/navigation";
import phraseStore from "@/store/savePhrase";
import { onAuthStateChanged, User } from "firebase/auth";
import GridWarp from "@/components/GridWarp";

function Page() {
  const [phrase, setPhrase] = useState("");
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const { dePhrase } = phraseStore();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("No user found, redirecting to login");
        router.push("/");
        return;
      } else if (dePhrase) {
        router.push("/dashboard");
        console.log("dePhrase found, redirecting to dashboard");
      } else {
        setUser(user);
        console.log(user);
      }
    });

    return () => unsubscribe(); // cleanup
  }, [user, router, dePhrase]);

  const { setDePhrase } = phraseStore();

  const handleSave = async () => {
    if (!phrase) {
      alert("Please enter a phrase.");
      return;
    }

    const q = query(
      collection(db, "userpass"),
      where("email", "==", user?.email)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("User not found");
      return false;
    }

    const docData = querySnapshot.docs[0].data();
    if (!docData.isPhraseSaved) {
      alert("Phrase is not saved.");
      return;
    }

    const isMatch = bcrypt.compareSync(phrase, docData.phrase);

    if (!isMatch) {
      alert("Incorrect phrase.");
      return;
    }

    setDePhrase(phrase);

    router.push("/dashboard");
  };

  return (
    <div className="bg-black flex flex-col gap-4 justify-center overflow-hidden items-center min-h-screen p-4">
      <GridWarp />
         <div className="text-white  leading-20 font-black opacity-5 pointer-events-none text-[10vh] w p-4 md:p-8 fixed z-0">
        So basically, when you call the encryptText function — BAM 💥 — it takes
        your precious little text (maybe your Netflix password:
        iloveGayBaconAHHH123) and a secret passphrase (hopefully not
        password123, you absolute menace 😭), and then does some crypto wizardry
        using crypto-js. It uses AES encryption, which is like the vault in a
        bank — but instead of gold, you are storing stuff like your OnlyFans
        login. The function doesnt do black magic — it just turns your readable
        text into a bunch of encrypted gobbledygook that looks like alien
        language 🤖. And no, Karen, you cant just Google decrypt and expect
        it to work without the exact secret, okay? So if you try to sneak a peek
        at someone is encrypted data without the right secret, it is just: “AHHH
        🔐 NOPE!” — like trying to unlock a chastity belt with a spoon. You are
        welcome. 😎
      </div>
      <h1 className="text-4xl bg-gradient-to-br from-gray-900 to-gray-800 py-3 px-6 rounded-lg text-white flex justify-center items-center gap-2 font-bold">
        <Lock strokeWidth={3} />
        Word <span className="text-green-400">PASS</span>
      </h1>
      <h1 className="text-white text-center text-4xl font-bold z-20">
        Open the walt with your{" "}
        <span className="text-green-400">SECRET PHRASE</span>
      </h1>
      <p className="text-gray-400 z-20 text-center">
        <b>Important:</b> Save it somewhere as we also dont store it.
      </p>

      <div className="flex  w-full justify-center items-center mt-6 gap-4 ">
        <input
          type="password"
          placeholder="Enter your phrase here..."
          className="border-b-1 w-full border-l-1 p-2 rounded-lg text-white focus:outline-none md:w-[30%] py-5 bg-gradient-to-br from-gray-900 to-gray-800 "
          onChange={(e) => setPhrase(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
        />

        <button
          className="bg-green-400 cursor-pointer text-black px-5 py-5 rounded-lg border-b-2  border-l-2  hover:bg-green-500 transition-colors"
          onClick={handleSave}
        >
          <ArrowBigRight className="scale-120 " />
        </button>
      </div>
    </div>
  );
}

export default Page;
