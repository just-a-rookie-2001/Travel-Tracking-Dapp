import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Analytics, getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBUFYf-txDHXFN7mayrkGryhcnfC3Jkvoo",
  authDomain: "travel-tracker-dapp.firebaseapp.com",
  projectId: "travel-tracker-dapp",
  storageBucket: "travel-tracker-dapp.appspot.com",
  messagingSenderId: "564914867479",
  appId: "1:564914867479:web:b214e873e45facfe0afb52",
  measurementId: "G-NJLJJD4X19",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

let analytics: Analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { auth, db };
