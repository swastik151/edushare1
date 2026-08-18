const students = document.querySelectorAll(".student");

students.forEach(student => {

    const buttons = student.querySelectorAll("button");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn => {
                btn.style.opacity = "0.4";
            });

            button.style.opacity = "1";

            student.dataset.status = button.textContent.trim();

        });

    });

});


document.getElementById("saveAttendance").addEventListener("click", () => {

    const subject = document.getElementById("subject").value;
    const date = document.getElementById("date").value;

    if (!subject || !date) {
        alert("Please select a subject and date.");
        return;
    }

    students.forEach(student => {

        const name = student.querySelector(".student-name").textContent;
        const status = student.dataset.status || "Not Marked";

        console.log(name, status);

    });

    alert("Attendance saved successfully!");

});
