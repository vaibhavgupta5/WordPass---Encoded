"use client";
import React, { useEffect, useState } from "react";
import { auth, db, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/dist/client/components/navigation";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore/lite";
import GridWarp from "@/components/GridWarp";
import { Lock } from "lucide-react";

export default function AuthPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if user exists and phrase is saved
  const checkUserAndPhrase = async (
    email: string
  ): Promise<"dashboard" | "onboarding" | "new"> => {
    const q = query(collection(db, "userpass"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data();
      if (docData.isPhraseSaved) {
        return "dashboard";
      }
      return "onboarding";
    }
    return "new";
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const redirect = async (email: string) => {
        const page = await checkUserAndPhrase(email);
        router.push(page === "dashboard" ? "/openwalt" : "/onboarding");
      };
      if (user) {
        redirect(user.email as string).catch((err) => {
          console.error("Error checking user and phrase:", err);
        });
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogle = async () => {
    setError("");
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;

      const userStatus = await checkUserAndPhrase(userEmail as string);

      if (userStatus === "new") {
        // Only add to db if user does not exist
        await addDoc(collection(db, "userpass"), {
          email: userEmail,
          isPhraseSaved: false,
        });
        router.push("/onboarding");
      } else if (userStatus === "dashboard") {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } catch (err) {
      setError((err as Error)?.message || "Google sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden">
      <GridWarp />
      <div className="text-white  leading-20 font-black opacity-10 text-[10vh] w p-4 pointer-events-none z-0  md:p-8 fixed ">
        So basically, when you call the encryptText function — BAM 💥 — it takes
        your precious little text (maybe your Netflix password:
        iloveGayBaconAHHH123) and a secret passphrase (hopefully not
        password123, you absolute menace 😭), and then does some crypto wizardry
        using crypto-js. It uses AES encryption, which is like the vault in a
        bank — but instead of gold, you are storing stuff like your OnlyFans
        login. The function doesnt do black magic — it just turns your readable
        text into a bunch of encrypted gobbledygook that looks like alien
        language 🤖. And no, Karen, you cant just Google decrypt and expect it
        to work without the exact secret, okay? So if you try to sneak a peek at
        someone is encrypted data without the right secret, it is just: “AHHH 🔐
        NOPE!” — like trying to unlock a chastity belt with a spoon. You are
        welcome. 😎
      </div>
      <div className="md:fixed top-10 right-10 p-4">
        <h1 className="text-4xl bg-gradient-to-br from-gray-900 to-gray-800 py-3 px-6 rounded-lg text-white flex justify-center items-center gap-2 font-bold">
          <Lock strokeWidth={3} />
          Word <span className="text-green-400">PASS</span>
        </h1>
      </div>
      <div>
        <div className=" md:fixed w-full bottom-10 left-10 p-4">
          <div className="w-full max-w-md relative">
            <div>
              <div className="  w-full h-full">
                <div className="backdrop-blur-xl flex flex-col justify-center bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800/50 rounded-lg border-b-2 border-l-2 border-b-white border-l-white p-8 shadow-2xl  w-full ">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 mb-4">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Welcome
                    </h2>
                    <p className="text-gray-400">
                      Sign in with Google to continue
                    </p>
                  </div>
                  {error && (
                    <div className="bg-red-900/20 border border-red-700/50 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">
                      {error}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-100 border border-gray-200 cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <path
                          d="M44.5 20H24V28.5H36.5C35.1 32.6 31.1 35.5 26.5 35.5C20.7 35.5 16 30.8 16 25C16 19.2 20.7 14.5 26.5 14.5C29.1 14.5 31.4 15.4 33.2 16.9L38.1 12C34.7 9.1 30.1 7.5 25.5 7.5C15.8 7.5 8 15.3 8 25C8 34.7 15.8 42.5 25.5 42.5C34.2 42.5 42 34.7 42 25C42 23.7 41.9 22.4 41.7 21.1L44.5 20Z"
                          fill="#FFC107"
                        />
                        <path
                          d="M6.3 14.1L12.1 18.6C13.9 15.2 17.8 12.5 22.5 12.5C25.1 12.5 27.4 13.4 29.2 14.9L34.1 10C30.7 7.1 26.1 5.5 21.5 5.5C13.8 5.5 7.1 11.2 6.3 14.1Z"
                          fill="#FF3D00"
                        />
                        <path
                          d="M25.5 42.5C30.1 42.5 34.7 40.9 38.1 38L33.2 33.1C31.4 34.6 29.1 35.5 26.5 35.5C21.9 35.5 17.9 32.6 16.5 28.5H8V33.9C11.7 39.1 18.1 42.5 25.5 42.5Z"
                          fill="#4CAF50"
                        />
                        <path
                          d="M44.5 20H42V20H24V28.5H36.5C35.8 30.5 34.5 32.2 33.2 33.1L38.1 38C41.1 35.3 43.1 31.5 44.5 27.5C44.9 26.1 45.1 24.6 45.1 23C45.1 21.4 44.9 19.9 44.5 20Z"
                          fill="#1976D2"
                        />
                      </g>
                    </svg>
                    {isLoading ? "Signing in..." : "Continue with Google"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right side - Earth Animation */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
            `,
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>
          {/* You can add your Earth animation here */}
        </div>
      </div>
    </div>
  );
}
