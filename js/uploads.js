import { db } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const subjectButtons = document.getElementById("subjectButtons");
const uploadsContainer = document.getElementById("uploadsContainer");

const uploadsRef = ref(db, "uploads");

onValue(uploadsRef, (snapshot) => {

    subjectButtons.innerHTML = "";
    uploadsContainer.innerHTML = "";

    if (!snapshot.exists()) {
        uploadsContainer.innerHTML = "<p>No uploads found.</p>";
        return;
    }

    const uploads = Object.values(snapshot.val()).reverse();

    // Get all subjects
    const subjects = {};

    uploads.forEach((upload) => {

        const subject = upload.subject || "General";

        if (!subjects[subject]) {
            subjects[subject] = [];
        }

        subjects[subject].push(upload);
    });

    // Create a button for every subject
    Object.keys(subjects).forEach((subject) => {

        const button = document.createElement("button");

        button.className = "subject-button";
        button.textContent = subject;

        button.addEventListener("click", () => {

            showSubject(subject, subjects[subject]);

        });

        subjectButtons.appendChild(button);
    });

    // Show the first subject automatically
    const firstSubject = Object.keys(subjects)[0];

    showSubject(firstSubject, subjects[firstSubject]);


    function showSubject(subject, files) {

        uploadsContainer.innerHTML = `
            <div class="subject-heading">
                <h2>📚 ${subject}</h2>
                <p>Study materials for ${subject}</p>
            </div>
        `;

        const grid = document.createElement("div");

        grid.className = "uploads-grid";

        files.forEach((upload) => {

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

        uploadsContainer.appendChild(grid);
    }

});
