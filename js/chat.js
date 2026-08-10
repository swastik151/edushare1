import { db } from "./firebase.js";

import {
    ref,
    push,
    onChildAdded
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const chatBox = document.getElementById("chatBox");
const message = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

const chatRef = ref(db, "chat");

const teachers = ["SUNEHA MAM"];

// Get saved name
let savedName = localStorage.getItem("edushareName");

// Ask only once
if (!savedName) {
    savedName = prompt(
        "👋 Welcome to EduShare Chat!\n\nEnter your name:"
    );

    if (savedName) {
        savedName = savedName.trim();
        localStorage.setItem("edushareName", savedName);
    }
}

// Send message
async function sendMessage() {

    const text = message.value.trim();

    if (!savedName) {
        alert("Please enter your name.");
        return;
    }

    if (!text) return;

    await push(chatRef, {
        user: savedName,
        text: text,
        time: Date.now()
    });

    message.value = "";
    message.focus();
}

sendBtn.addEventListener("click", sendMessage);

message.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }

});

// Display messages
onChildAdded(chatRef, (snapshot) => {

    const msg = snapshot.val();

    const div = document.createElement("div");
    div.className = "message";

    if (msg.user === savedName) {
        div.classList.add("my-message");
    }

    const name = document.createElement("strong");

    const badge = teachers.includes(msg.user)
        ? " 👑"
        : "";

    name.textContent = msg.user + badge;

    const text = document.createElement("p");
    text.textContent = msg.text;

    div.appendChild(name);
    div.appendChild(text);

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
});
