import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3ALe8LE94xdJ7RNhfqZpZVJHFedI4v0Q",
  authDomain: "blockchain-41579.firebaseapp.com",
  databaseURL: "https://blockchain-41579-default-rtdb.firebaseio.com",
  projectId: "blockchain-41579",
  storageBucket: "blockchain-41579.firebasestorage.app",
  messagingSenderId: "811384239911",
  appId: "1:811384239911:web:31eb7cd6ff84a36b27db02"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;