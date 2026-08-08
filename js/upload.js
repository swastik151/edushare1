import { db } from "./firebase.js";

import {
    ref,
    push
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const CLOUD_NAME = "pnzbxjfn";
const UPLOAD_PRESET = "edushare_upload";

const imageInput = document.getElementById("imageInput");
const uploadBtn = document.getElementById("uploadBtn");
const status = document.getElementById("status");
const preview = document.getElementById("preview");
const subject = document.getElementById("subject");

uploadBtn.addEventListener("click", async () => {

    const file = imageInput.files[0];
    const selectedSubject = subject.value;

    if (!selectedSubject) {
        status.textContent = "Please choose a subject.";
        return;
    }

    if (!file) {
        status.textContent = "Please select a picture first.";
        return;
    }

    status.textContent = "Uploading...";

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {

        // Upload to Cloudinary
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (!data.secure_url) {
            status.textContent = "Cloudinary upload failed.";
            console.log(data);
            return;
        }

        // Save to Firebase
        await push(ref(db, "uploads"), {
            url: data.secure_url,
            name: file.name,
            subject: selectedSubject,
            uploadedAt: Date.now()
        });

        status.textContent = "Picture uploaded successfully!";

        preview.src = data.secure_url;
        preview.style.display = "block";

        imageInput.value = "";
        subject.value = "";

    } catch (error) {

        console.error(error);
        status.textContent = "Upload error.";

    }

});
