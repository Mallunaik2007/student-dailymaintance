/* =====================================================
   STUDYFLOW - MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   HELPER FUNCTIONS
===================================================== */

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getData(key, defaultValue) {
    const data = localStorage.getItem(key);

    if (data) {
        return JSON.parse(data);
    }

    return defaultValue;
}


/* =====================================================
   CURRENT DATE
===================================================== */

function showCurrentDate() {
    const date = new Date();

    const options = {
        weekday: "long",
        month: "long",
        day: "numeric"
    };

    const element = document.getElementById("currentDate");

    if (element) {
        element.textContent =
            date.toLocaleDateString("en-US", options);
    }
}

showCurrentDate();


/* =====================================================
   INITIAL DATA
===================================================== */

let activities = getData("activities", [
    {
        id: 1,
        name: "Breakfast",
        start: "08:00",
        end: "08:30",
        category: "Personal",
        priority: "Low",
        completed: true
    },
    {
        id: 2,
        name: "Data Structures",
        start: "09:00",
        end: "10:00",
        category: "Class",
        priority: "High",
        completed: true
    },
    {
        id: 3,
        name: "Operating Systems",
        start: "10:00",
        end: "11:00",
        category: "Class",
        priority: "High",
        completed: false
    },
    {
        id: 4,
        name: "Break",
        start: "11:00",
        end: "11:30",
        category: "Break",
        priority: "Low",
        completed: false
    },
    {
        id: 5,
        name: "DBMS",
        start: "11:30",
        end: "12:30",
        category: "Class",
        priority: "High",
        completed: false
    },
    {
        id: 6,
        name: "DSA Practice",
        start: "14:00",
        end: "15:00",
        category: "Study",
        priority: "High",
        completed: false
    },
    {
        id: 7,
        name: "AI/ML Learning",
        start: "16:00",
        end: "17:00",
        category: "Study",
        priority: "Medium",
        completed: false
    },
    {
        id: 8,
        name: "Gym",
        start: "18:00",
        end: "19:00",
        category: "Exercise",
        priority: "Medium",
        completed: false
    }
]);


let tasks = getData("tasks", [
    {
        id: 1,
        name: "Complete DBMS Assignment",
        subject: "DBMS",
        due: "2026-09-26",
        priority: "High",
        completed: false
    },
    {
        id: 2,
        name: "Solve 2 DSA Problems",
        subject: "DSA",
        due: "2026-09-25",
        priority: "Medium",
        completed: false
    },
    {
        id: 3,
        name: "OS Mini Project",
        subject: "Operating Systems",
        due: "2026-09-28",
        priority: "High",
        completed: false
    }
]);


let goals = getData("goals", [
    {
        id: 1,
        name: "Solve 2 DSA Problems",
        subject: "DSA",
        time: "45 min",
        completed: false
    },
    {
        id: 2,
        name: "Learn SQL Window Functions",
        subject: "DBMS",
        time: "1 hour",
        completed: false
    },
    {
        id: 3,
        name: "Revise Process Synchronization",
        subject: "Operating Systems",
        time: "45 min",
        completed: false
    },
    {
        id: 4,
        name: "Complete ML Lecture",
        subject: "AI/ML",
        time: "30 min",
        completed: false
    }
]);


/* =====================================================
   TOAST MESSAGE
===================================================== */

function showToast(message) {

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =====================================================
   FORMAT TIME
===================================================== */

function formatTime(time) {

    if (!time) return "";

    let [hour, minute] = time.split(":");

    hour = Number(hour);

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {
        hour = 12;
    }

    return `${hour}:${minute} ${ampm}`;
}


/* =====================================================
   ACTIVITIES
===================================================== */

function renderActivities() {

    const timeline = document.getElementById("timeline");

    if (!timeline) return;

    timeline.innerHTML = "";

    activities.sort((a, b) =>
        a.start.localeCompare(b.start)
    );

    activities.forEach(activity => {

        const item = document.createElement("div");

        item.className = "timeline-item";

        item.draggable = true;

        item.dataset.id = activity.id;

        item.innerHTML = `

            <div class="timeline-time">
                ${formatTime(activity.start)}
            </div>

            <div class="timeline-dot"></div>

            <div class="timeline-content
                ${activity.completed ? "completed" : ""}">

                <div class="activity-top">

                    <h3>${activity.name}</h3>

                    <div class="activity-actions">

                        <button
                            class="small-action complete-activity"
                            data-id="${activity.id}">
                            ✓
                        </button>

                        <button
                            class="small-action delete-activity"
                            data-id="${activity.id}">
                            ×
                        </button>

                    </div>

                </div>

                <div class="activity-bottom">

                    <span class="badge">
                        ${activity.category}
                    </span>

                    <span class="badge priority-${activity.priority.toLowerCase()}">
                        ${activity.priority}
                    </span>

                    <span class="badge">
                        ${formatTime(activity.start)}
                        -
                        ${formatTime(activity.end)}
                    </span>

                </div>

            </div>
        `;

        timeline.appendChild(item);
    });

    updateNextActivity();

    updateStats();

    saveData("activities", activities);
}


/* =====================================================
   ACTIVITY BUTTONS
===================================================== */

document.addEventListener("click", function (event) {

    /* Complete activity */

    if (event.target.classList.contains("complete-activity")) {

        const id = Number(event.target.dataset.id);

        const activity = activities.find(
            item => item.id === id
        );

        if (activity) {

            activity.completed = !activity.completed;

            saveData("activities", activities);

            renderActivities();

            showToast(
                activity.completed
                    ? "Activity completed 🎉"
                    : "Activity marked incomplete"
            );
        }
    }


    /* Delete activity */

    if (event.target.classList.contains("delete-activity")) {

        const id = Number(event.target.dataset.id);

        activities = activities.filter(
            item => item.id !== id
        );

        saveData("activities", activities);

        renderActivities();

        showToast("Activity deleted");
    }

});


/* =====================================================
   CLEAR COMPLETED
===================================================== */

const clearCompletedBtn =
    document.getElementById("clearCompletedBtn");

if (clearCompletedBtn) {

    clearCompletedBtn.addEventListener("click", () => {

        activities = activities.filter(
            activity => !activity.completed
        );

        saveData("activities", activities);

        renderActivities();

        showToast("Completed activities cleared");

    });

}


/* =====================================================
   NEXT ACTIVITY
===================================================== */

function updateNextActivity() {

    const next = activities.find(
        activity => !activity.completed
    );

    const nextActivity =
        document.getElementById("nextActivity");

    const nextTime =
        document.getElementById("nextTime");

    const nextCategory =
        document.getElementById("nextCategory");

    if (!next) {

        if (nextActivity)
            nextActivity.textContent = "All done! 🎉";

        if (nextTime)
            nextTime.textContent = "--";

        if (nextCategory)
            nextCategory.textContent = "Great work today";

        return;
    }

    if (nextActivity)
        nextActivity.textContent = next.name;

    if (nextTime)
        nextTime.textContent = formatTime(next.start);

    if (nextCategory)
        nextCategory.textContent = next.category;
}


/* =====================================================
   ADD ACTIVITY
===================================================== */

const addActivityBtn =
    document.getElementById("addActivityBtn");

const activityModal =
    document.getElementById("activityModal");

const activityForm =
    document.getElementById("activityForm");


if (addActivityBtn && activityModal) {

    addActivityBtn.addEventListener("click", () => {
        activityModal.classList.add("show");
    });

}


if (activityForm) {

    activityForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const activity = {

            id: Date.now(),

            name:
                document.getElementById("activityName").value,

            start:
                document.getElementById("activityStart").value,

            end:
                document.getElementById("activityEnd").value,

            category:
                document.getElementById("activityCategory").value,

            priority:
                document.getElementById("activityPriority").value,

            notes:
                document.getElementById("activityNotes").value,

            completed: false
        };


        activities.push(activity);

        saveData("activities", activities);

        renderActivities();

        this.reset();

        activityModal.classList.remove("show");

        showToast("Activity added successfully");

    });

}


/* =====================================================
   LEARNING GOALS
===================================================== */

function renderGoals() {

    const container =
        document.getElementById("goalsContainer");

    if (!container) return;

    container.innerHTML = "";

    goals.forEach(goal => {

        const card =
            document.createElement("div");

        card.className =
            `goal-card ${goal.completed ? "completed" : ""}`;

        card.innerHTML = `

            <button
                class="goal-check
                ${goal.completed ? "checked" : ""}"
                data-goal="${goal.id}">
                ✓
            </button>

            <h3>${goal.name}</h3>

            <p>
                ${goal.subject || "General"}
                ·
                ${goal.time}
            </p>

        `;

        container.appendChild(card);

    });

}


document.addEventListener("click", function (event) {

    if (event.target.classList.contains("goal-check")) {

        const id =
            Number(event.target.dataset.goal);

        const goal =
            goals.find(item => item.id === id);

        if (goal) {

            goal.completed = !goal.completed;

            saveData("goals", goals);

            renderGoals();

            updateStats();

            showToast(
                goal.completed
                    ? "Learning goal completed 🎯"
                    : "Goal reopened"
            );
        }
    }

});


const addGoalBtn =
    document.getElementById("addGoalBtn");

if (addGoalBtn) {

    addGoalBtn.addEventListener("click", () => {

        document
            .getElementById("goalModal")
            .classList.add("show");

    });

}


const goalForm =
    document.getElementById("goalForm");

if (goalForm) {

    goalForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const goal = {

            id: Date.now(),

            name:
                document.getElementById("goalName").value,

            subject:
                document.getElementById("goalSubject").value,

            time:
                document.getElementById("goalTime").value,

            completed: false
        };

        goals.push(goal);

        saveData("goals", goals);

        renderGoals();

        updateStats();

        this.reset();

        document
            .getElementById("goalModal")
            .classList.remove("show");

        showToast("Learning goal added");

    });

}


/* =====================================================
   TASKS
===================================================== */

function renderTasks() {

    const container =
        document.getElementById("tasksContainer");

    if (!container) return;

    container.innerHTML = "";

    tasks.forEach(task => {

        const item =
            document.createElement("div");

        item.className =
            `task-item ${task.completed ? "completed" : ""}`;

        item.innerHTML = `

            <button
                class="task-checkbox
                ${task.completed ? "checked" : ""}"
                data-task="${task.id}">
                ✓
            </button>

            <div class="task-info">

                <h3>${task.name}</h3>

                <p>
                    ${task.subject || "General"}
                    ·
                    Due ${task.due}
                </p>

            </div>

            <span class="badge priority-${task.priority.toLowerCase()}">
                ${task.priority}
            </span>

            <button
                class="delete-task"
                data-delete-task="${task.id}">
                ×
            </button>

        `;

        container.appendChild(item);

    });

    updateStats();
}


document.addEventListener("click", function (event) {

    /* Complete task */

    if (event.target.classList.contains("task-checkbox")) {

        const id =
            Number(event.target.dataset.task);

        const task =
            tasks.find(item => item.id === id);

        if (task) {

            task.completed = !task.completed;

            saveData("tasks", tasks);

            renderTasks();

            showToast(
                task.completed
                    ? "Task completed 🎉"
                    : "Task reopened"
            );

        }
    }


    /* Delete task */

    if (event.target.classList.contains("delete-task")) {

        const id =
            Number(event.target.dataset.deleteTask);

        tasks = tasks.filter(
            task => task.id !== id
        );

        saveData("tasks", tasks);

        renderTasks();

        showToast("Task deleted");
    }

});


const addTaskBtn =
    document.getElementById("addTaskBtn");

if (addTaskBtn) {

    addTaskBtn.addEventListener("click", () => {

        document
            .getElementById("taskModal")
            .classList.add("show");

    });

}


const taskForm =
    document.getElementById("taskForm");

if (taskForm) {

    taskForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const task = {

            id: Date.now(),

            name:
                document.getElementById("taskName").value,

            subject:
                document.getElementById("taskSubject").value,

            due:
                document.getElementById("taskDate").value,

            priority:
                document.getElementById("taskPriority").value,

            completed: false
        };

        tasks.push(task);

        saveData("tasks", tasks);

        renderTasks();

        this.reset();

        document
            .getElementById("taskModal")
            .classList.remove("show");

        showToast("Task added");

    });

}


/* =====================================================
   WEEKLY TIMETABLE
===================================================== */

/*
   IMPORTANT:
   This is the part that allows you to ADD CLASSES.
*/

let timetableClasses = getData(
    "timetableClasses",
    [
        {
            id: 1,
            subject: "DSA",
            day: "Monday",
            start: "09:00",
            end: "10:00",
            teacher: "",
            room: "Room 204",
            color: "purple-box"
        },

        {
            id: 2,
            subject: "DBMS",
            day: "Tuesday",
            start: "09:00",
            end: "10:00",
            teacher: "",
            room: "Room 301",
            color: "blue-box"
        },

        {
            id: 3,
            subject: "OS",
            day: "Wednesday",
            start: "09:00",
            end: "10:00",
            teacher: "",
            room: "Room 204",
            color: "green-box"
        },

        {
            id: 4,
            subject: "AI",
            day: "Thursday",
            start: "09:00",
            end: "10:00",
            teacher: "",
            room: "Lab 2",
            color: "orange-box"
        },

        {
            id: 5,
            subject: "Networks",
            day: "Friday",
            start: "09:00",
            end: "10:00",
            teacher: "",
            room: "Room 105",
            color: "purple-box"
        },

        {
            id: 6,
            subject: "OS",
            day: "Monday",
            start: "10:00",
            end: "11:00",
            teacher: "",
            room: "Room 204",
            color: "green-box"
        },

        {
            id: 7,
            subject: "Maths",
            day: "Tuesday",
            start: "10:00",
            end: "11:00",
            teacher: "",
            room: "Room 105",
            color: "orange-box"
        },

        {
            id: 8,
            subject: "DBMS",
            day: "Wednesday",
            start: "10:00",
            end: "11:00",
            teacher: "",
            room: "Room 301",
            color: "blue-box"
        },

        {
            id: 9,
            subject: "DSA",
            day: "Thursday",
            start: "10:00",
            end: "11:00",
            teacher: "",
            room: "Room 204",
            color: "purple-box"
        },

        {
            id: 10,
            subject: "AI",
            day: "Friday",
            start: "10:00",
            end: "11:00",
            teacher: "",
            room: "Lab 2",
            color: "green-box"
        },

        {
            id: 11,
            subject: "Networks",
            day: "Wednesday",
            start: "11:00",
            end: "12:00",
            teacher: "",
            room: "Room 105",
            color: "orange-box"
        },

        {
            id: 12,
            subject: "DBMS",
            day: "Friday",
            start: "11:00",
            end: "12:00",
            teacher: "",
            room: "Room 301",
            color: "blue-box"
        }
    ]
);


const timetableDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];


/* =====================================================
   RENDER TIMETABLE
===================================================== */

function renderTimetable() {

    const body =
        document.getElementById("timetableBody");

    if (!body) return;

    body.innerHTML = "";


    /*
       Get all unique time slots.
    */

    const timeSlots = [
        ...new Set(
            timetableClasses.map(
                item => `${item.start}|${item.end}`
            )
        )
    ].sort();


    /* No classes */

    if (timeSlots.length === 0) {

        body.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-cell">

                    No classes added yet.
                    Click + Add Class.

                </td>

            </tr>

        `;

    }


    /* Create rows */

    timeSlots.forEach(slot => {

        const [start, end] =
            slot.split("|");

        const row =
            document.createElement("tr");


        /* Time column */

        row.innerHTML = `

            <td>
                ${formatTime(start)}
                -
                ${formatTime(end)}
            </td>

        `;


        /* Monday-Friday */

        timetableDays.forEach(day => {

            const cell =
                document.createElement("td");


            const classItem =
                timetableClasses.find(
                    item =>
                        item.day === day &&
                        item.start === start &&
                        item.end === end
                );


            if (classItem) {

                cell.innerHTML = `

                    <div
                        class="class-box ${classItem.color}"
                        style="
                            position:relative;
                            padding-right:32px;
                        "
                    >

                        <strong>
                            ${classItem.subject}
                        </strong>

                        <small>

                            ${classItem.room || "Room not set"}

                            ${
                                classItem.teacher
                                    ? " · " + classItem.teacher
                                    : ""
                            }

                        </small>


                        <button
                            class="delete-class"
                            data-class-id="${classItem.id}"
                            title="Delete class"
                            style="
                                position:absolute;
                                top:6px;
                                right:6px;
                                border:0;
                                background:rgba(0,0,0,.08);
                                border-radius:6px;
                                width:22px;
                                height:22px;
                                cursor:pointer;
                                font-size:14px;
                            "
                        >
                            ×
                        </button>

                    </div>

                `;

            } else {

                cell.className = "empty-cell";

                cell.textContent = "Free";

            }


            row.appendChild(cell);

        });


        body.appendChild(row);

    });


    /* Update class count */

    const classCount =
        document.getElementById("classCount");

    if (classCount) {

        classCount.textContent =
            timetableClasses.length;

    }


    saveData(
        "timetableClasses",
        timetableClasses
    );
}


/* =====================================================
   OPEN ADD CLASS MODAL
===================================================== */

const addClassBtn =
    document.getElementById("addClassBtn");


if (addClassBtn) {

    addClassBtn.addEventListener("click", () => {

        document
            .getElementById("classModal")
            .classList.add("show");

    });

}


/* =====================================================
   ADD CLASS
===================================================== */

const classForm =
    document.getElementById("classForm");


if (classForm) {

    classForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const subject =
                document
                    .getElementById("classSubject")
                    .value
                    .trim();


            const day =
                document
                    .getElementById("classDay")
                    .value;


            const start =
                document
                    .getElementById("classStart")
                    .value;


            const end =
                document
                    .getElementById("classEnd")
                    .value;


            const teacher =
                document
                    .getElementById("classTeacher")
                    .value
                    .trim();


            const room =
                document
                    .getElementById("classRoom")
                    .value
                    .trim();


            const color =
                document
                    .getElementById("classColor")
                    .value;


            /* Check required fields */

            if (
                !subject ||
                !day ||
                !start ||
                !end
            ) {

                showToast(
                    "Please fill all required fields"
                );

                return;
            }


            /* Check time */

            if (start >= end) {

                showToast(
                    "End time must be after start time"
                );

                return;
            }


            /* Check duplicate */

            const duplicate =
                timetableClasses.some(
                    item =>
                        item.day === day &&
                        item.start === start &&
                        item.end === end
                );


            if (duplicate) {

                showToast(
                    "A class already exists at this time"
                );

                return;
            }


            /* Create class */

            const newClass = {

                id: Date.now(),

                subject: subject,

                day: day,

                start: start,

                end: end,

                teacher: teacher,

                room: room,

                color: color

            };


            timetableClasses.push(newClass);


            saveData(
                "timetableClasses",
                timetableClasses
            );


            renderTimetable();


            this.reset();


            document
                .getElementById("classModal")
                .classList.remove("show");


            showToast(
                "Class added to timetable 🎉"
            );

        }
    );

}


/* =====================================================
   DELETE CLASS
===================================================== */

document.addEventListener("click", function (event) {

    if (
        event.target.classList.contains("delete-class")
    ) {

        const id =
            Number(
                event.target.dataset.classId
            );


        timetableClasses =
            timetableClasses.filter(
                item => item.id !== id
            );


        saveData(
            "timetableClasses",
            timetableClasses
        );


        renderTimetable();


        showToast(
            "Class deleted"
        );

    }

});


/* =====================================================
   STATS
===================================================== */

function updateStats() {

    const totalTasks =
        tasks.length;

    const completedTasks =
        tasks.filter(
            task => task.completed
        ).length;


    const tasksDone =
        document.getElementById("tasksDone");

    if (tasksDone) {

        tasksDone.textContent =
            `${completedTasks} / ${totalTasks}`;

    }


    const totalActivities =
        activities.length;

    const completedActivities =
        activities.filter(
            activity => activity.completed
        ).length;


    const completedGoals =
        goals.filter(
            goal => goal.completed
        ).length;


    const totalGoals =
        goals.length;


    const totalItems =
        totalActivities +
        totalTasks +
        totalGoals;


    const completedItems =
        completedActivities +
        completedTasks +
        completedGoals;


    let percentage = 0;


    if (totalItems > 0) {

        percentage =
            Math.round(
                (completedItems / totalItems) * 100
            );

    }


    const percentageElement =
        document.getElementById(
            "progressPercentage"
        );

    const progressBar =
        document.getElementById(
            "progressBar"
        );


    if (percentageElement) {

        percentageElement.textContent =
            `${percentage}%`;

    }


    if (progressBar) {

        progressBar.style.width =
            `${percentage}%`;

    }

}


/* =====================================================
   STUDY TIMER
===================================================== */

let timerMinutes = 25;

let timerSeconds = 0;

let timerInterval = null;

let timerRunning = false;


const timerDisplay =
    document.getElementById("timerDisplay");


function updateTimerDisplay() {

    if (!timerDisplay) return;

    const minutes =
        String(timerMinutes).padStart(2, "0");

    const seconds =
        String(timerSeconds).padStart(2, "0");

    timerDisplay.textContent =
        `${minutes}:${seconds}`;

}


function startTimerFunction() {

    if (timerRunning) {

        clearInterval(timerInterval);

        timerRunning = false;

        document.getElementById(
            "startTimer"
        ).textContent = "Start Focus";

        return;

    }


    timerRunning = true;

    document.getElementById(
        "startTimer"
    ).textContent = "Pause";


    timerInterval = setInterval(() => {

        if (
            timerMinutes === 0 &&
            timerSeconds === 0
        ) {

            clearInterval(timerInterval);

            timerRunning = false;

            document.getElementById(
                "startTimer"
            ).textContent = "Start Focus";

            showToast(
                "Focus session completed! 🎉"
            );

            return;

        }


        if (timerSeconds === 0) {

            timerMinutes--;

            timerSeconds = 59;

        } else {

            timerSeconds--;

        }


        updateTimerDisplay();

    }, 1000);

}


const startTimer =
    document.getElementById("startTimer");


if (startTimer) {

    startTimer.addEventListener(
        "click",
        startTimerFunction
    );

}


const resetTimer =
    document.getElementById("resetTimer");


if (resetTimer) {

    resetTimer.addEventListener(
        "click",
        () => {

            clearInterval(timerInterval);

            timerRunning = false;

            timerMinutes = 25;

            timerSeconds = 0;

            updateTimerDisplay();

            document.getElementById(
                "startTimer"
            ).textContent = "Start Focus";

        }
    );

}


document
    .querySelectorAll(".timer-option")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".timer-option")
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                button.classList.add("active");


                timerMinutes =
                    Number(
                        button.dataset.minutes
                    );


                timerSeconds = 0;


                updateTimerDisplay();

            }
        );

    });


/* =====================================================
   CALENDAR
===================================================== */

let calendarDate = new Date();


function renderCalendar() {

    const monthElement =
        document.getElementById(
            "calendarMonth"
        );

    const container =
        document.getElementById(
            "calendarDays"
        );


    if (!monthElement || !container) {
        return;
    }


    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    monthElement.textContent =
        calendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    container.innerHTML = "";


    /* Empty days */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "calendar-day other-month";

        container.appendChild(empty);

    }


    const today =
        new Date();


    /* Days */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const element =
            document.createElement("div");

        element.className =
            "calendar-day";


        element.textContent =
            day;


        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            element.classList.add("today");

        }


        container.appendChild(element);

    }

}


const prevMonth =
    document.getElementById("prevMonth");


if (prevMonth) {

    prevMonth.addEventListener(
        "click",
        () => {

            calendarDate.setMonth(
                calendarDate.getMonth() - 1
            );

            renderCalendar();

        }
    );

}


const nextMonth =
    document.getElementById("nextMonth");


if (nextMonth) {

    nextMonth.addEventListener(
        "click",
        () => {

            calendarDate.setMonth(
                calendarDate.getMonth() + 1
            );

            renderCalendar();

        }
    );

}


/* =====================================================
   NOTES
===================================================== */

const notesArea =
    document.getElementById("notesArea");


if (notesArea) {

    notesArea.value =
        localStorage.getItem(
            "studentNotes"
        ) || "";

}


const saveNoteBtn =
    document.getElementById("saveNoteBtn");


if (saveNoteBtn) {

    saveNoteBtn.addEventListener(
        "click",
        () => {

            localStorage.setItem(
                "studentNotes",
                notesArea.value
            );

            showToast(
                "Note saved successfully"
            );

        }
    );

}


/* =====================================================
   DARK MODE
===================================================== */

const themeBtn =
    document.getElementById("themeBtn");


const savedTheme =
    localStorage.getItem("theme");


if (
    savedTheme === "dark" &&
    themeBtn
) {

    document.body.classList.add("dark");

    themeBtn.innerHTML =
        "<span>☀</span> Light Mode";

}


if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            const dark =
                document.body.classList.contains(
                    "dark"
                );


            if (dark) {

                localStorage.setItem(
                    "theme",
                    "dark"
                );

                themeBtn.innerHTML =
                    "<span>☀</span> Light Mode";

            } else {

                localStorage.setItem(
                    "theme",
                    "light"
                );

                themeBtn.innerHTML =
                    "<span>◐</span> Dark Mode";

            }

        }
    );

}


/* =====================================================
   CLOSE MODALS
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        const closeButton =
            event.target.closest(
                "[data-close]"
            );


        if (closeButton) {

            const modalId =
                closeButton.dataset.close;


            const modal =
                document.getElementById(
                    modalId
                );


            if (modal) {

                modal.classList.remove(
                    "show"
                );

            }

        }

    }
);


/* =====================================================
   CLICK OUTSIDE MODAL
===================================================== */

document
    .querySelectorAll(".modal-overlay")
    .forEach(overlay => {

        overlay.addEventListener(
            "click",
            event => {

                if (
                    event.target === overlay
                ) {

                    overlay.classList.remove(
                        "show"
                    );

                }

            }
        );

    });


/* =====================================================
   RESCHEDULE
===================================================== */

const rescheduleBtn =
    document.getElementById(
        "rescheduleBtn"
    );


if (rescheduleBtn) {

    rescheduleBtn.addEventListener(
        "click",
        () => {

            const next =
                activities.find(
                    activity =>
                        !activity.completed
                );


            if (!next) {

                showToast(
                    "No pending activity"
                );

                return;

            }


            const newTime =
                prompt(
                    "Enter new start time (HH:MM):",
                    next.start
                );


            if (
                newTime &&
                /^\d{2}:\d{2}$/.test(newTime)
            ) {

                next.start = newTime;

                saveData(
                    "activities",
                    activities
                );

                renderActivities();

                showToast(
                    "Activity rescheduled"
                );

            }

        }
    );

}


/* =====================================================
   COMPLETE NEXT
===================================================== */

const completeNextBtn =
    document.getElementById(
        "completeNextBtn"
    );


if (completeNextBtn) {

    completeNextBtn.addEventListener(
        "click",
        () => {

            const next =
                activities.find(
                    activity =>
                        !activity.completed
                );


            if (next) {

                next.completed = true;

                saveData(
                    "activities",
                    activities
                );

                renderActivities();

                showToast(
                    "Activity completed 🎉"
                );

            }

        }
    );

}


/* =====================================================
   NAVIGATION
===================================================== */

document
    .querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".nav-link")
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                link.classList.add("active");

            }
        );

    });


/* =====================================================
   NOTIFICATION
===================================================== */

const notificationBtn =
    document.getElementById(
        "notificationBtn"
    );


if (notificationBtn) {

    notificationBtn.addEventListener(
        "click",
        () => {

            const pendingTasks =
                tasks.filter(
                    task =>
                        !task.completed
                ).length;


            showToast(
                `You have ${pendingTasks} pending tasks 🔔`
            );

        }
    );

}


/* =====================================================
   INITIAL RENDER
===================================================== */

renderActivities();

renderGoals();

renderTasks();

renderTimetable();

renderCalendar();

updateTimerDisplay();

updateStats();