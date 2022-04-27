import create from "zustand";
import { signOut } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDocFromServer } from "firebase/firestore";

interface UserData {
  uid: string;
  name: string | null;
  email: string | null;
  role: "country" | "desk" | "admin" | "airline" | "";
  country: string;
}

type success = boolean;

interface AuthStore {
  user: UserData;
  logOut: () => Promise<success>;
  setUser: (uid: string) => void;
  defaultState: () => void;
}

const initialUser: UserData = {
  uid: "",
  name: "",
  email: "",
  role: "",
  country: "",
};

const useAuth = create<AuthStore>((set) => ({
  user: { ...initialUser },
  logOut: async () => {
    try {
      await signOut(auth);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  setUser: async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const response = await getDocFromServer(docRef);
      if (response.exists()) {
        const data = response.data() as UserData;
        set((state) => {
          state.user = {
            ...data,
          };
          console.log(state.user);
        });
      } else {
        console.log("No firestore record");
        set({
          user: {
            ...initialUser,
          },
        });
        await signOut(auth);
      }
    } catch (err) {
      console.log(err);
    }
  },
  defaultState: () => set({ user: { ...initialUser } }),
}));

export default useAuth;
