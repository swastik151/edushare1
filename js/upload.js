import { db } from "./firebase.js";

import {
    ref,
    push
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


const uploadBtn = document.getElementById("uploadBtn");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const status = document.getElementById("status");


uploadBtn.addEventListener("click", async () => {

    const file = imageInput.files[0];

    if (!file) {
        status.textContent = "Please choose a picture first!";
        return;
    }


    const formData = new FormData();

    formData.append("file", file);

    formData.append(
        "upload_preset",
        "edushare_upload"
    );


    try {

        uploadBtn.disabled = true;
        uploadBtn.textContent = "Uploading...";
        status.textContent = "Uploading picture...";


        // Upload to Cloudinary
        const response = await fetch(
            "https://api.cloudinary.com/v1_1/pnzbxjfn/image/upload",
            {
                method: "POST",
                body: formData
            }
        );


        const data = await response.json();


        if (!data.secure_url) {

            console.error(data);

            status.textContent = "Upload failed!";
            return;
        }


        // Save Cloudinary URL to Firebase
        const uploadsRef = ref(db, "uploads");

        await push(uploadsRef, {

            url: data.secure_url,

            uploadedAt: Date.now()

        });


        // Show preview
        preview.src = data.secure_url;

        preview.style.display = "block";


        status.textContent =
            "Picture uploaded successfully! 🎉";


    } catch (error) {

        console.error(error);

        status.textContent =
            "Something went wrong!";

    }


    uploadBtn.disabled = false;

    uploadBtn.textContent = "Upload Picture";

});