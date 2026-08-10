import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const announcement = document.getElementById("announcement");
const postBtn = document.getElementById("postBtn");
const status = document.getElementById("status");

postBtn.addEventListener("click", async () => {
    const text = announcement.value.trim();

    if (!text) {
        status.textContent = "Please write an announcement first.";
        return;
    }

    try {
        await push(ref(db, "announcements"), {
            text: text,
            postedAt: Date.now()
        });

        announcement.value = "";
        status.textContent = "✅ Announcement posted successfully!";
    } catch (error) {
        console.error(error);
        status.textContent = "❌ Failed to post announcement.";
    }
});
