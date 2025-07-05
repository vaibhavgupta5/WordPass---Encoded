"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Globe,
  Search,
  Eye,
  EyeOff,
  Copy,
  Lock,
} from "lucide-react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore/lite";
import { auth, db } from "@/lib/firebase";
import { encryptText } from "@/utils/encryptText";
import { decryptText } from "@/utils/decryptText";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
// import firebase from "firebase/compat/app";
import type { User } from "firebase/auth";
import usePhraseStore from "@/store/savePhrase";
import { useRouter } from "next/navigation";
import GridWarp from "@/components/GridWarp";

type PassEntry = {
  id: string;
  site: string;
  password: string;
};

function getFaviconUrl(site: string) {
  try {
    const url = new URL(site.startsWith("http") ? site : `https://${site}`);
    return `https://icon.horse/icon/${url.hostname}`;
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<PassEntry[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [site, setSite] = useState("");
  const [password, setPassword] = useState("");
  const [visiblePasswordId, setVisiblePasswordId] = useState<string | null>(
    null
  );
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { dePhrase } = usePhraseStore.getState();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log(user);
    });

    if (!dePhrase) {
      console.log("No dePhrase found");
      router.push("/openwalt");
    }

    return () => unsubscribe();
  }, [dePhrase, router]);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;
      const q = query(
        collection(db, "userpass"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs[0]?.data()?.entries || [];
      setEntries(docs);
    };
    fetchEntries();
  }, [user]);

  const updatePass = async (password: string) => {
    if (!user) return "";
    const encryptedPassword = encryptText(password);
    setPassword(encryptedPassword);
    return encryptedPassword;
  };

  // Add new entry
  const handleAdd = async () => {
    if (!site || !password) return;
    const user = auth.currentUser;
    if (!user) return;

    // updatePass(password);

    const q = query(
      collection(db, "userpass"),
      where("email", "==", user.email)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const prev = querySnapshot.docs[0].data().entries || [];
      const newEntry = {
        id: Date.now().toString(),
        site,
        password: await updatePass(password),
      };
      await updateDoc(docRef, { entries: [...prev, newEntry] });
      setEntries([...prev, newEntry]);
    }
    setShowModal(false);
    setSite("");
    setPassword("");
  };

  // Filtered entries
  const filtered = entries.filter((e) =>
    e.site.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <GridWarp />

       <div className="text-white  leading-20 font-black opacity-7 text-[10vh] z-0 pointer-events-none w p-4 md:p-8 fixed ">
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
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-8 py-6 border-b border-gray-800 z-10 bg-black">
        <h1 className="text-2xl flex justify-center items-center gap-2 font-bold">
          <Lock strokeWidth={3} />
          Word <span className="text-green-400">PASS</span>
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-900 pl-10 pr-4 md:w-[30vw] w-full py-2 rounded-lg border border-gray-700 focus:outline-none  border-b-2 border-l-2 border-b-white border-l-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="bg-green-400 w-[90%] md:w-full hover:bg-green-500 text-black px-4 md:py-2
            py-4 cursor-pointer border-b-2 border-l-2 border-white
            rounded-lg flex items-center gap-2 font-semibold transition fixed md:static bottom-4 md:bottom-auto mx-auto md:right-auto z-50 shadow-lg hover:shadow-xl"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} /> Save New Password
          </button>
        </div>
      </div>

      {/* Password Grid */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No passwords found.
          </div>
        )}
        {filtered.map((entry) => (
          <div
            key={entry.id}
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-600 rounded-2xl md:p-6 p-4 flex flex-col items-center gap-4 shadow-2xl hover:shadow-3xl transition-all duration-300  backdrop-blur-sm border-b-2 border-l-2 border-b-white border-l-white "
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-800 mb-2 shadow-inner border border-gray-600">
              {getFaviconUrl(entry.site) ? (
                <Image
                  width={40}
                  height={40}
                  src={getFaviconUrl(entry.site) as string}
                  alt="favicon"
                  className="w-10 h-10 rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/vercel.svg";
                  }}
                />
              ) : (
                <Globe className="text-emerald-400 w-10 h-10 drop-shadow-lg" />
              )}
            </div>
            <div className="text-xl font-bold truncate w-full text-center text-gray-100 tracking-wide">
              {entry.site}
            </div>
            <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3 border border-gray-700 backdrop-blur-sm">
              <input
                type={visiblePasswordId === entry.id ? "text" : "password"}
                value={decryptText(entry.password)}
                readOnly
                className="bg-gray-900/80 px-4 py-2 rounded-lg text-gray-100 w-36 text-center font-mono text-sm border border-gray-600 focus:border-emerald-500 focus:outline-none shadow-inner"
              />
              <button
                onClick={() =>
                  setVisiblePasswordId((prev) =>
                    prev === entry.id ? null : entry.id
                  )
                }
                className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-700/50 cursor-pointer"
              >
                {visiblePasswordId === entry.id ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(decryptText(entry.password))
                }
                className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-700/50 cursor-pointer"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0  bg-black/60  flex items-center justify-center  z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md flex flex-col gap-6 border-b-2 border-l-2 border-b-white border-l-white">
            <h2 className="text-2xl font-bold text-center">
              Save New Password
            </h2>
            <input
              type="text"
              placeholder="Site URL (e.g. github.com)"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              value={site}
              onChange={(e) => setSite(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div className="flex gap-4">
              <button
                className="flex-1 cursor-pointer bg-green-400 hover:bg-green-500 text-black py-3 rounded-lg font-semibold border-b-2 border-l-2 border-white"
                onClick={handleAdd}
              >
                Save
              </button>
              <button
                className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg border-b-2 border-l-2 border-white"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
