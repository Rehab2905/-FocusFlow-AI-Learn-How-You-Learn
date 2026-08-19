/* =====================================================
   FOCUSFLOW AI
   Personalized Learning Platform
   JavaScript
   ===================================================== */


/* =====================================================
   STATE
   ===================================================== */

const defaultState = {

    mood: "😐",

    energy: "medium",

    level: "school",

    studyTime: 30,

    subject: "",

    darkMode: false,

    accessibility: {

        largeText: false,

        highContrast: false,

        reduceMotion: false,

        readingMode: false

    },

    focusMinutes: 45,

    focusSessions: 2,

    tasks: [

        {
            id: 1,

            title:
                "Practice JavaScript Functions",

            priority:
                "high",

            completed:
                false

        },

        {
            id: 2,

            title:
                "Review today's notes",

            priority:
                "medium",

            completed:
                true

        },

        {
            id: 3,

            title:
                "Read 10 pages",

            priority:
                "low",

            completed:
                true

        }

    ]

};


let state =
    JSON.parse(
        localStorage.getItem(
            "focusflowState"
        )
    ) ||
    defaultState;


/* =====================================================
   SAVE STATE
   ===================================================== */

function saveState() {

    localStorage.setItem(
        "focusflowState",
        JSON.stringify(state)
    );

}


/* =====================================================
   SELECT ELEMENTS
   ===================================================== */

const navItems =
    document.querySelectorAll(
        ".nav-item[data-section]"
    );


const sections =
    document.querySelectorAll(
        ".page-section"
    );


const pageTitle =
    document.getElementById(
        "pageTitle"
    );


const pageTitles = {

    dashboard:
        "Your flow, your way.",

    study:
        "Build a study session that fits you.",

    tasks:
        "Make the task smaller.",

    learning:
        "Discover what works for you.",

    mindgym:
        "Train skills, not perfection.",

    accessibility:
        "Make FocusFlow work for you."

};


/* =====================================================
   NAVIGATION
   ===================================================== */

function showSection(sectionId) {

    sections.forEach(
        function(section) {

            section.classList.remove(
                "active"
            );

        }
    );


    navItems.forEach(
        function(item) {

            item.classList.remove(
                "active"
            );

        }
    );


    const target =
        document.getElementById(
            sectionId
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }


    navItems.forEach(
        function(item) {

            if (
                item.dataset.section ===
                sectionId
            ) {

                item.classList.add(
                    "active"
                );

            }

        }
    );


    pageTitle.textContent =
        pageTitles[sectionId] ||
        "FocusFlow AI";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


navItems.forEach(
    function(item) {

        item.addEventListener(
            "click",
            function() {

                showSection(
                    item.dataset.section
                );

            }
        );

    }
);


document.querySelectorAll(
    "[data-section]"
).forEach(
    function(item) {

        if (
            !item.classList.contains(
                "nav-item"
            )
        ) {

            item.addEventListener(
                "click",
                function() {

                    showSection(
                        item.dataset.section
                    );

                }
            );

        }

    }
);


/* =====================================================
   GREETING
   ===================================================== */

function updateGreeting() {

    const hour =
        new Date().getHours();


    let greeting =
        "Good morning 👋";


    if (hour >= 12 && hour < 18) {

        greeting =
            "Good afternoon 👋";

    }


    if (hour >= 18) {

        greeting =
            "Good evening 👋";

    }


    document.getElementById(
        "greeting"
    ).textContent =
        greeting;

}


updateGreeting();


/* =====================================================
   MOOD
   ===================================================== */

const moodButtons =
    document.querySelectorAll(
        ".mood-choice"
    );


function updateMoodUI() {

    moodButtons.forEach(
        function(button) {

            button.classList.toggle(
                "selected",
                button.dataset.mood ===
                state.mood
            );

        }
    );

}


moodButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                state.mood =
                    button.dataset.mood;

                saveState();

                updateMoodUI();

                updateAdaptivePlan();

                showToast(
                    "Mood saved"
                );

            }
        );

    }
);


updateMoodUI();


/* =====================================================
   ENERGY
   ===================================================== */

const energyButtons =
    document.querySelectorAll(
        ".energy-option"
    );


function updateEnergyUI() {

    energyButtons.forEach(
        function(button) {

            button.classList.toggle(
                "selected",
                button.dataset.energy ===
                state.energy
            );

        }
    );

}


energyButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                state.energy =
                    button.dataset.energy;

                saveState();

                updateEnergyUI();

                updateAdaptivePlan();

                showToast(
                    "Energy level updated"
                );

            }
        );

    }
);


updateEnergyUI();


/* =====================================================
   ADAPTIVE ENGINE
   ===================================================== */

function getRecommendation() {

    const energy =
        state.energy;


    const mood =
        state.mood;


    if (
        energy === "low" ||
        mood === "😫" ||
        mood === "😔"
    ) {

        return {

            title:
                "Let's make today lighter.",

            text:
                "Start with a 10–15 minute micro-session, one small task, and a short reset.",

            task:
                "Review one small concept",

            reason:
                "When your energy feels low, reducing the size of the first step can make starting easier.",

            minutes:
                15

        };

    }


    if (
        energy === "high" &&
        mood === "😄"
    ) {

        return {

            title:
                "You have momentum — use it.",

            text:
                "This is a good moment for a deeper 30–45 minute session on a meaningful task.",

            task:
                "Work on your highest-priority task",

            reason:
                "Your current check-in suggests you may have enough energy for a deeper work block.",

            minutes:
                30

        };

    }


    return {

        title:
            "Start small. Build momentum.",

        text:
            "Try a focused 20-minute session followed by a short break.",

        task:
            "Practice one important concept",

        reason:
            "A clear, manageable session gives you one concrete target without overwhelming your day.",

        minutes:
            20

    };

}


function updateAdaptivePlan() {

    const recommendation =
        getRecommendation();


    document.getElementById(
        "adaptiveTitle"
    ).textContent =
        recommendation.title;


    document.getElementById(
        "adaptiveText"
    ).textContent =
        recommendation.text;


    document.getElementById(
        "recommendedTask"
    ).textContent =
        recommendation.task;


    document.getElementById(
        "whyRecommendation"
    ).textContent =
        recommendation.reason;

}


updateAdaptivePlan();


/* =====================================================
   APPLY RECOMMENDATION
   ===================================================== */

document.getElementById(
    "applyRecommendation"
).addEventListener(
    "click",
    function() {

        showSection(
            "study"
        );

        showToast(
            "Personalized plan applied"
        );

    }
);


/* =====================================================
   STUDY BUILDER
   ===================================================== */

const levelButtons =
    document.querySelectorAll(
        ".level-button"
    );


const timeButtons =
    document.querySelectorAll(
        ".time-options button"
    );


levelButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                levelButtons.forEach(
                    function(item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                button.classList.add(
                    "selected"
                );


                state.level =
                    button.dataset.level;


                saveState();

            }
        );

    }
);


timeButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                timeButtons.forEach(
                    function(item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                button.classList.add(
                    "selected"
                );


                state.studyTime =
                    Number(
                        button.dataset.time
                    );


                saveState();

            }
        );

    }
);


/* =====================================================
   GENERATE STUDY PLAN
   ===================================================== */

document.getElementById(
    "generatePlan"
).addEventListener(
    "click",
    generateStudyPlan
);


function generateStudyPlan() {

    const subject =
        document.getElementById(
            "subjectInput"
        ).value.trim();


    const difficulty =
        document.getElementById(
            "difficultyInput"
        ).value;


    state.subject =
        subject ||
        "your subject";


    saveState();


    let steps = [];


    if (
        difficulty ===
        "overwhelmed"
    ) {

        steps = [

            [
                "Choose",
                "Pick one tiny part of the subject."
            ],

            [
                "Start",
                "Work for 5 minutes without worrying about finishing."
            ],

            [
                "Focus",
                "Continue with one 10–15 minute focused block."
            ],

            [
                "Reset",
                "Take a short break and decide the next step."
            ]

        ];

    } else if (
        difficulty ===
        "understand"
    ) {

        steps = [

            [
                "Preview",
                "Look at the topic and identify what you already know."
            ],

            [
                "Learn",
                "Study one concept using an explanation or example."
            ],

            [
                "Explain",
                "Explain the idea in your own words."
            ],

            [
                "Check",
                "Answer 3–5 questions without looking at your notes."
            ]

        ];

    } else if (
        difficulty ===
        "remember"
    ) {

        steps = [

            [
                "Learn",
                "Study one small concept."
            ],

            [
                "Recall",
                "Close your notes and write what you remember."
            ],

            [
                "Review",
                "Compare your answer with your notes."
            ],

            [
                "Test",
                "Finish with a short self-quiz."
            ]

        ];

    } else if (
        difficulty ===
        "focus"
    ) {

        steps = [

            [
                "Prepare",
                "Remove one major distraction."
            ],

            [
                "Focus",
                "Start a short focused timer."
            ],

            [
                "Break",
                "Take a 3–5 minute movement break."
            ],

            [
                "Continue",
                "Return for one more focused block."
            ]

        ];

    } else {

        steps = [

            [
                "Open",
                "Open your study material."
            ],

            [
                "Learn",
                "Study one small concept."
            ],

            [
                "Practice",
                "Solve one example or question."
            ],

            [
                "Recall",
                "Close your notes and summarize what you learned."
            ]

        ];

    }


    const plan =
        document.getElementById(
            "generatedPlan"
        );


    plan.innerHTML = `

        <div class="generated-title">

            <div>

                <span class="eyebrow">
                    YOUR PERSONAL PLAN
                </span>

                <h3>
                    ${escapeHTML(
                        state.subject
                    )}
                </h3>

            </div>

            <span class="plan-tag">
                ${state.studyTime} MIN
            </span>

        </div>


        <p class="plan-summary">

            ${getPlanSummary(
                difficulty
            )}

        </p>


        ${steps.map(
            function(step, index) {

                return `

                    <div class="plan-step">

                        <div class="step-number">
                            ${String(
                                index + 1
                            ).padStart(
                                2,
                                "0"
                            )}
                        </div>

                        <div>

                            <strong>
                                ${step[0]}
                            </strong>

                            <span>
                                ${step[1]}
                            </span>

                        </div>

                    </div>

                `;

            }
        ).join("")}


        <button
            class="generate-button"
            id="startGeneratedPlan">

            Start this session →

        </button>

    `;


    document.getElementById(
        "startGeneratedPlan"
    ).addEventListener(
        "click",
        startStudySession
    );


    showToast(
        "Your personalized plan is ready"
    );

}


function getPlanSummary(
    difficulty
) {

    if (
        difficulty ===
        "overwhelmed"
    ) {

        return "Your plan reduces the starting point so you can focus on progress instead of pressure.";

    }


    if (
        difficulty ===
        "remember"
    ) {

        return "Your session uses active recall instead of relying only on rereading.";

    }


    if (
        difficulty ===
        "understand"
    ) {

        return "Your session moves from learning to explaining to testing.";

    }


    return "Your session is structured around small actions, active practice, and a clear finish point.";

}


/* =====================================================
   START STUDY SESSION
   ===================================================== */

function startStudySession() {

    state.focusSessions++;

    saveState();

    showToast(
        "Focus session started"
    );

}


/* =====================================================
   TASKS
   ===================================================== */

const taskInput =
    document.getElementById(
        "taskInput"
    );


const priorityInput =
    document.getElementById(
        "priorityInput"
    );


const addTaskButton =
    document.getElementById(
        "addTask"
    );


function renderTasks() {

    const taskList =
        document.getElementById(
            "taskList"
        );


    const count =
        document.getElementById(
            "taskCount"
        );


    count.textContent =
        `${state.tasks.length} tasks`;


    if (
        state.tasks.length === 0
    ) {

        taskList.innerHTML = `

            <div class="result-empty">

                <span>🌱</span>

                <h3>
                    Nothing here yet.
                </h3>

                <p>
                    Add one small task to get started.
                </p>

            </div>

        `;

        return;

    }


    taskList.innerHTML =
        state.tasks.map(
            function(task) {

                return `

                    <div class="task-row
                        ${
                            task.completed
                                ? "completed"
                                : ""
                        }">

                        <button
                            class="task-check"
                            onclick="
                                toggleTask(
                                    ${task.id}
                                )
                            ">

                            ${
                                task.completed
                                    ? "✓"
                                    : ""
                            }

                        </button>


                        <div class="task-row-info">

                            <strong>
                                ${escapeHTML(
                                    task.title
                                )}
                            </strong>

                            <span
                                class="${task.priority}">

                                ${
                                    task.priority
                                }

                            </span>

                        </div>


                        <button
                            class="delete-task"
                            onclick="
                                deleteTask(
                                    ${task.id}
                                )
                            ">

                            ×

                        </button>

                    </div>

                `;

            }
        ).join("");


    updateStats();

}


function addTask() {

    const title =
        taskInput.value.trim();


    if (!title) {

        showToast(
            "Write one task first"
        );

        taskInput.focus();

        return;

    }


    state.tasks.unshift({

        id:
            Date.now(),

        title:
            title,

        priority:
            priorityInput.value,

        completed:
            false

    });


    taskInput.value = "";


    saveState();

    renderTasks();

    showToast(
        "Task added"
    );

}


addTaskButton.addEventListener(
    "click",
    addTask
);


taskInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            addTask();

        }

    }
);


/* =====================================================
   TOGGLE TASK
   ===================================================== */

function toggleTask(id) {

    state.tasks =
        state.tasks.map(
            function(task) {

                if (
                    task.id === id
                ) {

                    return {

                        ...task,

                        completed:
                            !task.completed

                    };

                }


                return task;

            }
        );


    saveState();

    renderTasks();

}


/* =====================================================
   DELETE TASK
   ===================================================== */

function deleteTask(id) {

    state.tasks =
        state.tasks.filter(
            function(task) {

                return task.id !== id;

            }
        );


    saveState();

    renderTasks();

    showToast(
        "Task removed"
    );

}


/* =====================================================
   TASK BREAKDOWN
   ===================================================== */

document.getElementById(
    "breakdownTask"
).addEventListener(
    "click",
    function() {

        const title =
            taskInput.value.trim();


        if (!title) {

            showToast(
                "Write the big task first"
            );

            taskInput.focus();

            return;

        }


        const breakdown = [

            `Open what you need for "${title}".`,

            "Choose the smallest useful first step.",

            "Work on that step for 10 minutes.",

            "Pause and decide what comes next."

        ];


        alert(
            "Let's break it down:\n\n" +
            breakdown
                .map(
                    function(item, index) {

                        return `${
                            index + 1
                        }. ${item}`;

                    }
                )
                .join("\n")
        );

    }
);


/* =====================================================
   STATS
   ===================================================== */

function updateStats() {

    const completed =
        state.tasks.filter(
            function(task) {

                return task.completed;

            }
        ).length;


    document.getElementById(
        "completedStat"
    ).textContent =
        completed;


    document.getElementById(
        "focusMinutes"
    ).textContent =
        state.focusMinutes;


    const score =
        Math.min(
            100,
            70 +
            completed * 5 +
            state.focusSessions * 3
        );


    document.getElementById(
        "focusScore"
    ).textContent =
        score;

}


/* =====================================================
   MIND GYM
   ===================================================== */

const exerciseCards =
    document.querySelectorAll(
        ".exercise-card"
    );


const exerciseResult =
    document.getElementById(
        "exerciseResult"
    );


exerciseCards.forEach(
    function(card) {

        card.addEventListener(
            "click",
            function() {

                startExercise(
                    card.dataset.exercise
                );

            }
        );

    }
);


function startExercise(type) {

    if (
        type === "attention"
    ) {

        exerciseResult.innerHTML = `

            <div class="exercise-active">

                <span class="eyebrow">
                    ATTENTION RESET
                </span>

                <h3>
                    Look away from the screen for 30 seconds.
                </h3>

                <p>
                    Find three things you can see,
                    two things you can hear,
                    and one thing you can physically feel.
                </p>

                <button
                    class="exercise-action"
                    onclick="
                        finishExercise(
                            'Attention reset completed'
                        )
                    ">

                    I finished →

                </button>

            </div>

        `;

    }


    if (
        type === "memory"
    ) {

        const numbers = [

            Math.floor(
                Math.random() * 9
            ),

            Math.floor(
                Math.random() * 9
            ),

            Math.floor(
                Math.random() * 9
            ),

            Math.floor(
                Math.random() * 9
            )

        ];


        exerciseResult.innerHTML = `

            <div class="exercise-active">

                <span class="eyebrow">
                    WORKING MEMORY
                </span>

                <h3>
                    Remember this sequence:
                </h3>

                <div class="sequence">

                    ${numbers.map(
                        function(number) {

                            return `
                                <span>
                                    ${number}
                                </span>
                            `;

                        }
                    ).join("")}

                </div>

                <p>
                    Look at it for a few seconds,
                    then cover it and try to recall it.
                </p>

                <button
                    class="exercise-action"
                    onclick="
                        finishExercise(
                            'Memory exercise completed'
                        )
                    ">

                    I remembered it →

                </button>

            </div>

        `;

    }


    if (
        type === "organization"
    ) {

        exerciseResult.innerHTML = `

            <div class="exercise-active">

                <span class="eyebrow">
                    ORGANIZATION
                </span>

                <h3>
                    Turn a big task into 3 tiny actions.
                </h3>

                <p>
                    Think of one task you've been avoiding.
                    Write only the first three physical actions
                    needed to begin it.
                </p>

                <button
                    class="exercise-action"
                    onclick="
                        finishExercise(
                            'Organization exercise completed'
                        )
                    ">

                    Done →

                </button>

            </div>

        `;

    }


    if (
        type === "breathing"
    ) {

        exerciseResult.innerHTML = `

            <div class="exercise-active">

                <span class="eyebrow">
                    RESET
                </span>

                <h3>
                    Take three slow breaths.
                </h3>

                <p>
                    Breathe in slowly.
                    Pause comfortably.
                    Breathe out slowly.
                    Repeat three times.
                </p>

                <button
                    class="exercise-action"
                    onclick="
                        finishExercise(
                            'Reset completed'
                        )
                    ">

                    I finished →

                </button>

            </div>

        `;

    }

}


function finishExercise(message) {

    showToast(
        message
    );


    exerciseResult.innerHTML = `

        <div class="result-empty">

            <span>
                🌱
            </span>

            <h3>
                Nice work.
            </h3>

            <p>
                The goal is practice, not perfection.
            </p>

        </div>

    `;

}


/* =====================================================
   ACCESSIBILITY
   ===================================================== */

const accessibilityControls = {

    largeText:
        document.getElementById(
            "largeText"
        ),

    highContrast:
        document.getElementById(
            "highContrast"
        ),

    reduceMotion:
        document.getElementById(
            "reduceMotion"
        ),

    readingMode:
        document.getElementById(
            "readingMode"
        )

};


function applyAccessibility() {

    document.body.classList.toggle(
        "large-text",
        state.accessibility.largeText
    );


    document.body.classList.toggle(
        "high-contrast",
        state.accessibility.highContrast
    );


    document.body.classList.toggle(
        "reduce-motion",
        state.accessibility.reduceMotion
    );


    document.body.classList.toggle(
        "reading-mode",
        state.accessibility.readingMode
    );


    Object.keys(
        accessibilityControls
    ).forEach(
        function(key) {

            accessibilityControls[
                key
            ].checked =
                state.accessibility[
                    key
                ];

        }
    );

}


Object.keys(
    accessibilityControls
).forEach(
    function(key) {

        accessibilityControls[
            key
        ].addEventListener(
            "change",
            function() {

                state.accessibility[
                    key
                ] =
                    this.checked;


                saveState();

                applyAccessibility();

                showToast(
                    "Accessibility setting updated"
                );

            }
        );

    }
);


applyAccessibility();


/* =====================================================
   DARK MODE
   ===================================================== */

const darkModeButton =
    document.getElementById(
        "darkModeButton"
    );


function applyDarkMode() {

    document.body.classList.toggle(
        "dark",
        state.darkMode
    );

}


darkModeButton.addEventListener(
    "click",
    function() {

        state.darkMode =
            !state.darkMode;

        saveState();

        applyDarkMode();

        showToast(
            state.darkMode
                ? "Dark mode enabled"
                : "Light mode enabled"
        );

    }
);


applyDarkMode();


/* =====================================================
   FOCUS MODE
   ===================================================== */

const focusModeButton =
    document.getElementById(
        "focusModeButton"
    );


const accessFocusMode =
    document.getElementById(
        "accessFocusMode"
    );


function toggleFocusMode() {

    document.body.classList.toggle(
        "focus-mode"
    );


    showToast(
        document.body.classList.contains(
            "focus-mode"
        )
            ? "Focus mode enabled"
            : "Focus mode disabled"
    );

}


focusModeButton.addEventListener(
    "click",
    toggleFocusMode
);


accessFocusMode.addEventListener(
    "click",
    toggleFocusMode
);


/* =====================================================
   READ ALOUD
   ===================================================== */

document.getElementById(
    "readPage"
).addEventListener(
    "click",
    function() {

        if (
            !("speechSynthesis" in window)
        ) {

            showToast(
                "Speech support is not available"
            );

            return;

        }


        const text =
            document.body.innerText
                .replace(
                    /\s+/g,
                    " "
                )
                .slice(
                    0,
                    2500
                );


        speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(
                text
            );


        speech.rate =
            0.9;


        speech.pitch =
            1;


        speechSynthesis.speak(
            speech
        );


        showToast(
            "Reading page aloud"
        );

    }
);


/* =====================================================
   OVERWHELMED MODE
   ===================================================== */

const overwhelmedModal =
    document.getElementById(
        "overwhelmedModal"
    );


document.getElementById(
    "closeModal"
).addEventListener(
    "click",
    function() {

        overwhelmedModal.classList.remove(
            "open"
        );

    }
);


document.getElementById(
    "modalStart"
).addEventListener(
    "click",
    function() {

        overwhelmedModal.classList.remove(
            "open"
        );


        showSection(
            "study"
        );


        showToast(
            "5-minute reset started"
        );

    }
);


/* =====================================================
   SMART OVERWHELM DETECTION
   ===================================================== */

document.getElementById(
    "difficultyInput"
).addEventListener(
    "change",
    function() {

        if (
            this.value ===
            "overwhelmed"
        ) {

            overwhelmedModal.classList.add(
                "open"
            );

        }

    }
);


/* =====================================================
   RESET DATA
   ===================================================== */

document.getElementById(
    "resetDataButton"
).addEventListener(
    "click",
    function() {

        const confirmed =
            confirm(
                "Reset your FocusFlow demo data?"
            );


        if (!confirmed) {

            return;

        }


        localStorage.removeItem(
            "focusflowState"
        );


        location.reload();

    }
);


/* =====================================================
   RECOMMENDED TASK
   ===================================================== */

document.getElementById(
    "startRecommended"
).addEventListener(
    "click",
    function() {

        state.focusSessions++;

        state.focusMinutes +=
            getRecommendation().minutes;

        saveState();

        updateStats();

        showToast(
            "Focus session started"
        );

    }
);


/* =====================================================
   TOAST
   ===================================================== */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.querySelector(
        "p"
    ).textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function() {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* =====================================================
   SECURITY / TEXT HELPER
   ===================================================== */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   INITIALIZE
   ===================================================== */

renderTasks();

updateStats();
