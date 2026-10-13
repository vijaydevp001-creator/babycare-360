import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBix3WXYaeFxdvi5COB6aViRKWA2aVWzRc",
  authDomain: "baby-care-360.firebaseapp.com",
  projectId: "baby-care-360",
  storageBucket: "baby-care-360.firebasestorage.app",
  messagingSenderId: "704852671704",
  appId: "1:704852671704:web:219ccb9d793dfe1744abad",
  measurementId: "G-S2NV3SYMKH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
