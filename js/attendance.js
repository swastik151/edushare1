import { db } from "./firebase.js";

import {
    ref,
    push,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const studentName = document.getElementById("studentName");
const addStudent = document.getElementById("addStudent");
const studentList = document.getElementById("studentList");
const today = document.getElementById("today");

const todayKey = new Date().toISOString().split("T")[0];

today.textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
});

const studentsRef = ref(db, "students");

addStudent.addEventListener("click", () => {
    const name = studentName.value.trim();

    if (!name) {
        alert("Please enter a student name.");
        return;
    }

    const newStudent = push(studentsRef);

    set(newStudent, {
        name: name
    });

    studentName.value = "";
});

studentName.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addStudent.click();
    }
});

onValue(studentsRef, (snapshot) => {

    studentList.innerHTML = "";

    if (!snapshot.exists()) {
        studentList.innerHTML = `
            <div class="empty">
                No students added yet.
            </div>
        `;
        return;
    }

    snapshot.forEach((child) => {

        const student = child.val();

        const studentDiv = document.createElement("div");
        studentDiv.className = "student";

        studentDiv.innerHTML = `
            <div class="student-name">
                ${student.name}
            </div>

            <div class="status-buttons">

                <button class="present">
                    ✓ Present
                </button>

                <button class="absent">
                    ✕ Absent
                </button>

            </div>
        `;

        const presentButton = studentDiv.querySelector(".present");
        const absentButton = studentDiv.querySelector(".absent");

        presentButton.addEventListener("click", () => {
            markAttendance(child.key, student.name, "Present", presentButton, absentButton);
        });

        absentButton.addEventListener("click", () => {
            markAttendance(child.key, student.name, "Absent", presentButton, absentButton);
        });

        studentList.appendChild(studentDiv);
    });
});

function markAttendance(studentId, name, status, presentButton, absentButton) {

    const attendanceRef = ref(
        db,
        `attendance/${todayKey}/${studentId}`
    );

    set(attendanceRef, {
        name: name,
        status: status,
        date: todayKey
    });

    presentButton.classList.remove("selected");
    absentButton.classList.remove("selected");

    if (status === "Present") {
        presentButton.classList.add("selected");
    } else {
        absentButton.classList.add("selected");
    }
}
