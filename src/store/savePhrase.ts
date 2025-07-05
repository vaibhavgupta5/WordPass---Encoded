import { create } from "zustand";

interface SavePhraseState {
  dePhrase: string;
  setDePhrase: (phrase: string) => void;
}

const usePhraseStore = create<SavePhraseState>((set) => ({
  dePhrase: "",
  setDePhrase: (phrase) => set({ dePhrase: phrase }),
}));

export default usePhraseStore;
