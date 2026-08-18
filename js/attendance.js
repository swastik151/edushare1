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
const attendanceRef = ref(db, `attendance/${todayKey}`);

let students = {};
let attendance = {};

// -------------------------
// ADD STUDENT
// -------------------------

addStudent.addEventListener("click", addNewStudent);

studentName.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addNewStudent();
    }
});

function addNewStudent() {

    const name = studentName.value.trim();

    if (name === "") {
        alert("Enter a student name first!");
        return;
    }

    const newStudent = push(studentsRef);

    set(newStudent, {
        name: name
    })
    .then(() => {
        studentName.value = "";
    })
    .catch((error) => {
        alert("Could not add student: " + error.message);
    });
}

// -------------------------
// LOAD STUDENTS
// -------------------------

onValue(studentsRef, (snapshot) => {

    students = {};

    if (snapshot.exists()) {
        snapshot.forEach((child) => {
            students[child.key] = child.val();
        });
    }

    renderStudents();
});

// -------------------------
// LOAD TODAY'S ATTENDANCE
// -------------------------

onValue(attendanceRef, (snapshot) => {

    attendance = {};

    if (snapshot.exists()) {
        snapshot.forEach((child) => {
            attendance[child.key] = child.val();
        });
    }

    renderStudents();
});

// -------------------------
// DISPLAY STUDENTS
// -------------------------

function renderStudents() {

    studentList.innerHTML = "";

    const studentIds = Object.keys(students);

    if (studentIds.length === 0) {

        studentList.innerHTML = `
            <div class="empty">
                No students added yet.
            </div>
        `;

        return;
    }

    studentIds.forEach((studentId) => {

        const student = students[studentId];
        const record = attendance[studentId];

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

        const presentButton =
            studentDiv.querySelector(".present");

        const absentButton =
            studentDiv.querySelector(".absent");

        // Show saved status
        if (record?.status === "Present") {
            presentButton.classList.add("selected");
        }

        if (record?.status === "Absent") {
            absentButton.classList.add("selected");
        }

        // PRESENT
        presentButton.addEventListener("click", () => {

            presentButton.classList.add("selected");
            absentButton.classList.remove("selected");

            saveAttendance(
                studentId,
                student.name,
                "Present"
            );

        });

        // ABSENT
        absentButton.addEventListener("click", () => {

            absentButton.classList.add("selected");
            presentButton.classList.remove("selected");

            saveAttendance(
                studentId,
                student.name,
                "Absent"
            );

        });

        studentList.appendChild(studentDiv);

    });
}

// -------------------------
// SAVE ATTENDANCE
// -------------------------

function saveAttendance(studentId, name, status) {

    const recordRef =
        ref(db, `attendance/${todayKey}/${studentId}`);

    set(recordRef, {
        name: name,
        status: status,
        date: todayKey
    })
    .catch((error) => {

        alert(
            "Attendance could not be saved: " +
            error.message
        );

    });
}
