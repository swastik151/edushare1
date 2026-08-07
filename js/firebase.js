import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB7S1WXsIoHxsPG107iPcnkSNXqC40rz7M",
  authDomain: "edushare-cfb57.firebaseapp.com",
  projectId: "edushare-cfb57",
  storageBucket: "edushare-cfb57.firebasestorage.app",
  messagingSenderId: "471725180671",
  appId: "1:471725180671:web:ddb16f02f5a9b7e0296eca",
  measurementId: "G-PPKVKSWV1H"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };