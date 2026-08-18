import { db } from "./firebase.js";

import {
    ref,
    push,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebasejs/12.1.0/firebase-database.js";

const studentName = document.getElementById("studentName");
const addStudent = document.getElementById("addStudent");
const studentList = document.getElementById("studentList");
const today = document.getElementById("today");

const todayKey = new Date().toLocaleDateString("en-CA");

today.textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
});

const studentsRef = ref(db, "students");
const todayAttendanceRef = ref(db, `attendance/${todayKey}`);

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

    onValue(todayAttendanceRef, (attendanceSnapshot) => {

        studentList.innerHTML = "";

        snapshot.forEach((child) => {

            const student = child.val();
            const attendance = attendanceSnapshot.child(child.key).val();

            const studentDiv = document.createElement("div");
            studentDiv.className = "student";

            studentDiv.innerHTML = `
                <div class="student-name">
                    ${student.name}
                </div>

                <div class="status-buttons">

                    <button class="present ${
                        attendance?.status === "Present" ? "selected" : ""
                    }">
                        ✓ Present
                    </button>

                    <button class="absent ${
                        attendance?.status === "Absent" ? "selected" : ""
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
                    child.key,
                    student.name,
                    "Present"
                );
            });

            absentButton.addEventListener("click", () => {
                markAttendance(
                    child.key,
                    student.name,
                    "Absent"
                );
            });

            studentList.appendChild(studentDiv);
        });

    });

});

function markAttendance(studentId, name, status) {

    const attendanceRef = ref(
        db,
        `attendance/${todayKey}/${studentId}`
    );

    set(attendanceRef, {
        name: name,
        status: status,
        date: todayKey
    });
}
