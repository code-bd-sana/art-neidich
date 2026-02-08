import { initializeApp, getApps } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize once
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize messaging (browser only)
let messaging = null;
if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export { messaging };

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCcw0FBpk3ZfPo8vSHRGA4s_i0DOJYENe8",
//   authDomain: "new-proj-c9fba.firebaseapp.com",
//   projectId: "new-proj-c9fba",
//   storageBucket: "new-proj-c9fba.firebasestorage.app",
//   messagingSenderId: "607103947682",
//   appId: "1:607103947682:web:54dc058e3399d8197918fb"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
