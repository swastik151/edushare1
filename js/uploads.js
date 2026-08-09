```javascript
import { db } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const uploadsContainer = document.getElementById("uploadsContainer");

const uploadsRef = ref(db, "uploads");

onValue(uploadsRef, (snapshot) => {

    uploadsContainer.innerHTML = "";

    if (!snapshot.exists()) {
        uploadsContainer.innerHTML = "<p>No uploads found.</p>";
        return;
    }

    const uploads = Object.values(snapshot.val()).reverse();

    // Create subject groups
    const subjects = {};

    uploads.forEach((upload) => {

        const subject = upload.subject || "General";

        if (!subjects[subject]) {
            subjects[subject] = [];
        }

        subjects[subject].push(upload);
    });

    // Display each subject
    Object.keys(subjects).forEach((subject) => {

        const section = document.createElement("section");
        section.className = "subject-section";

        section.innerHTML = `
            <h2 class="subject-title">📚 ${subject}</h2>
            <div class="uploads-grid"></div>
        `;

        const grid = section.querySelector(".uploads-grid");

        subjects[subject].forEach((upload) => {

            const card = document.createElement("div");

            card.className = "upload-card";

            card.innerHTML = `
                <h3>${upload.name || "Uploaded material"}</h3>

                <img
                    src="${upload.url}"
                    alt="${upload.name || "Uploaded image"}"
                >

                <br>

                <a href="${upload.url}" target="_blank">
                    Open Full Image
                </a>
            `;

            grid.appendChild(card);
        });

        uploadsContainer.appendChild(section);
    });
});
```
