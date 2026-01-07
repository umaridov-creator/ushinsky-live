import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJNXXJkoMJn9cCurrrHVlM80rK8Fu67ao",
  authDomain: "ushinskiy-live-1-0.firebaseapp.com",
  projectId: "ushinskiy-live-1-0",
  storageBucket: "ushinskiy-live-1-0.firebasestorage.app",
  messagingSenderId: "917564634884",
  appId: "1:917564634884:web:0db78a9217a617030bc251"
};

// Инициализируем Firebase
const app = initializeApp(firebaseConfig);

// Экспортируем функции, чтобы использовать их в других файлах
export const auth = getAuth(app);
export const db = getFirestore(app);