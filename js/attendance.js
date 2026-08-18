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

// Get today's date
const todayKey = new Date().toISOString().split("T")[0];

today.textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
});

// Firebase locations
const studentsRef = ref(db, "students");
const attendanceRef = ref(db, `attendance/${todayKey}`);

// ADD STUDENT
addStudent.addEventListener("click", () => {

    const name = studentName.value.trim();

    if (name === "") {
        alert("Please enter a student name.");
        return;
    }

    const newStudent = push(studentsRef);

    set(newStudent, {
        name: name
    });

    studentName.value = "";
});

// Press Enter to add student
studentName.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        addStudent.click();
    }

});

// LOAD STUDENTS
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

    // Get today's attendance
    onValue(attendanceRef, (attendanceSnapshot) => {

        studentList.innerHTML = "";

        snapshot.forEach((child) => {

            const student = child.val();
            const studentId = child.key;

            const attendance = attendanceSnapshot.child(studentId).val();

            const studentDiv = document.createElement("div");

            studentDiv.className = "student";

            studentDiv.innerHTML = `
                <div class="student-name">
                    ${student.name}
                </div>

                <div class="status-buttons">

                    <button class="present ${
                        attendance?.status === "Present"
                            ? "selected"
                            : ""
                    }">
                        ✓ Present
                    </button>

                    <button class="absent ${
                        attendance?.status === "Absent"
                            ? "selected"
                            : ""
                    }">
                        ✕ Absent
                    </button>

                </div>
            `;

            const presentButton =
                studentDiv.querySelector(".present");

            const absentButton =
                studentDiv.querySelector(".absent");

            presentButton.addEventListener("click", () => {

                markAttendance(
                    studentId,
                    student.name,
                    "Present"
                );

            });

            absentButton.addEventListener("click", () => {

                markAttendance(
                    studentId,
                    student.name,
                    "Absent"
                );

            });

            studentList.appendChild(studentDiv);

        });

    });

});

// SAVE ATTENDANCE
function markAttendance(studentId, name, status) {

    const studentAttendanceRef =
        ref(db, `attendance/${todayKey}/${studentId}`);

    set(studentAttendanceRef, {

        name: name,
        status: status,
        date: todayKey

    });

}
