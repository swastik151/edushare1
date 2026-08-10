import { db } from "./firebase.js";
import {
    ref,
    push
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

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
        console.error("Announcement error:", error);
        status.textContent = "❌ Failed to post announcement.";
    }
});
