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

    Object.entries(uploads).reverse().forEach(([id, upload]) => {

        const card = document.createElement("div");

        card.innerHTML = `
            <div style="
                background: white;
                padding: 20px;
                margin: 20px 0;
                border-radius: 15px;
            ">

                <h3>${upload.name || "EduShare Image"}</h3>

                <img
                    src="${upload.url}"
                    alt="${upload.name || "Uploaded image"}"
                    style="
                        max-width: 500px;
                        width: 100%;
                        border-radius: 12px;
                    "
                >

                <br><br>

                <a href="${upload.url}" target="_blank">
                    Open Full Image
                </a>

            </div>
        `;

        uploadsContainer.appendChild(card);
    });

});