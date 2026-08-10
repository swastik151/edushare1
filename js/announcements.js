import { db } from "./firebase.js";
import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const announcementBox = document.getElementById("announcementBox");

const announcementsRef = ref(db, "announcements");

onValue(announcementsRef, (snapshot) => {
    announcementBox.innerHTML = "";

    if (!snapshot.exists()) {
        announcementBox.innerHTML = `
            <h3>📢 No announcements yet</h3>
            <p>Check back later for school updates.</p>
        `;
        return;
    }

    const announcements = [];

    snapshot.forEach((child) => {
        announcements.push(child.val());
    });

    announcements.reverse();

    announcements.slice(0, 5).forEach((announcement) => {
        const date = new Date(announcement.postedAt);

        const card = document.createElement("div");
        card.className = "announcement-card";

        card.innerHTML = `
            <h3>📢 School Announcement</h3>
            <p>${announcement.text}</p>
            <small>Posted ${date.toLocaleString()}</small>
        `;

        announcementBox.appendChild(card);
    });
});
