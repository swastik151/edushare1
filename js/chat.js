import { db } from "./firebase.js";

import {
  ref,
  push,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const chatBox = document.getElementById("chatBox");
const username = document.getElementById("username");
const message = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

const chatRef = ref(db, "chat");

// Send a message
sendBtn.addEventListener("click", async () => {
    const user = username.value.trim();
    const text = message.value.trim();

    if (!user || !text) return;

    await push(chatRef, {
        user: user,
        text: text,
        time: Date.now()
    });

    message.value = "";
});

// Send on Enter
message.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendBtn.click();
    }
});

// Display messages
onChildAdded(chatRef, (snapshot) => {
    const msg = snapshot.val();

    const div = document.createElement("div");
    div.className = "message";

    const teachers = ["SUNEHA MAM"];

    const badge = teachers.includes(msg.user) ? " 👑" : "";

    div.innerHTML = `<strong>${msg.user}${badge}</strong>: ${msg.text}`;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
});