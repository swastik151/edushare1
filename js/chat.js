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

const teachers = ["SUNEHA MAM"];

// Get saved name
let savedName = localStorage.getItem("edushareName");

// Ask for name only if there isn't one saved
if (!savedName) {
    savedName = prompt("👋 Welcome to EduShare Chat!\n\nPlease enter your name:");

    if (savedName) {
        savedName = savedName.trim();

        if (savedName) {
            localStorage.setItem("edushareName", savedName);
        }
    }
}

// Hide the name box because the name is now remembered
if (savedName) {
    username.value = savedName;
    username.style.display = "none";
}


// Send message
async function sendMessage() {

    const user = savedName;
    const text = message.value.trim();

    if (!user) {
        alert("Please enter your name.");
        return;
    }

    if (!text) return;

    await push(chatRef, {
        user: user,
        text: text,
        time: Date.now()
    });

    message.value = "";
    message.focus();
}


// Send button
sendBtn.addEventListener("click", sendMessage);


// Send with Enter
message.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey) {
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

    const badge = teachers.includes(msg.user) ? " 👑" : "";

    name.textContent = msg.user + badge;

    const text = document.createElement("p");
    text.textContent = msg.text;

    div.appendChild(name);
    div.appendChild(text);

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
});
