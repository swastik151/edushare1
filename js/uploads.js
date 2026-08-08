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

    const uploads = snapshot.val();

    Object.values(uploads).reverse().forEach((upload) => {

        const card = document.createElement("div");

        card.className = "upload-card";

        card.innerHTML = `
            <h3>${upload.subject || "General"}</h3>

            <p>${upload.name || "Uploaded material"}</p>

            <img
                src="${upload.url}"
                alt="${upload.name || "Uploaded image"}"
            >

            <br>

            <a href="${upload.url}" target="_blank">
                Open Full Image
            </a>
        `;

        uploadsContainer.appendChild(card);
    });

});
