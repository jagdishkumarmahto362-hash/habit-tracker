// =====================================
// DATE FUNCTIONS
// =====================================

function getDateKey(date) {

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


const todayDate =
  new Date();

const todayKey =
  getDateKey(todayDate);


// =====================================
// TODAY
// =====================================

document.getElementById(
  "today"
).textContent =
  todayDate.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long"
    }
  );


// =====================================
// HABITS
// =====================================

let habits =
  JSON.parse(
    localStorage.getItem(
      "dailyHabits"
    )
  ) || [];


// =====================================
// FIX OLD HABITS
// =====================================

habits.forEach(
  habit => {

    if (!Array.isArray(
      habit.completedDates
    )) {

      habit.completedDates = [];

    }


    if (!habit.createdDate) {

      habit.createdDate =
        todayKey;

    }


    if (!habit.category) {

      habit.category =
        "Other";

    }

  }
);


// =====================================
// SAVE
// =====================================

function saveHabits() {

  localStorage.setItem(
    "dailyHabits",
    JSON.stringify(habits)
  );

}


// =====================================
// ADD HABIT
// =====================================

function addHabit() {

  const input =
    document.getElementById(
      "habitInput"
    );

  const category =
    document.getElementById(
      "categoryInput"
    );


  const name =
    input.value.trim();


  if (name === "") {

    alert(
      "Please enter a habit."
    );

    return;

  }


  habits.push({

    id: Date.now(),

    name: name,

    category:
      category.value,

    createdDate:
      todayKey,

    completedDates: []

  });


  input.value = "";


  saveHabits();

  renderAll();

}


// =====================================
// TOGGLE HABIT
// =====================================

function toggleHabit(index) {

  const habit =
    habits[index];


  const position =
    habit.completedDates.indexOf(
      todayKey
    );


  if (position === -1) {

    habit.completedDates.push(
      todayKey
    );

  } else {

    habit.completedDates.splice(
      position,
      1
    );

  }


  saveHabits();

  renderAll();

}


// =====================================
// DELETE
// =====================================

function deleteHabit(index) {

  const answer =
    confirm(
      "Delete this habit?"
    );


  if (!answer) return;


  habits.splice(
    index,
    1
  );


  saveHabits();

  renderAll();

}


// =====================================
// CHECK COMPLETED
// =====================================

function isCompleted(
  habit,
  dateKey
) {

  return habit.completedDates.includes(
    dateKey
  );

}


// =====================================
// STREAK
// =====================================

function getStreak(habit) {

  let streak = 0;

  let date =
    new Date();


  while (true) {

    const key =
      getDateKey(date);


    if (
      habit.completedDates.includes(
        key
      )
    ) {

      streak++;


      date.setDate(
        date.getDate() - 1
      );

    } else {

      break;

    }

  }


  return streak;

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHTML(text) {

  const div =
    document.createElement(
      "div"
    );

  div.textContent =
    text;

  return div.innerHTML;

}


// =====================================
// RENDER HABITS
// =====================================

function renderHabits() {

  const list =
    document.getElementById(
      "habitList"
    );


  list.innerHTML = "";


  if (
    habits.length === 0
  ) {

    list.innerHTML = `

      <div class="empty">

        No habits yet.<br>

        Add your first daily habit! 🔥

      </div>

    `;

    return;

  }


  habits.forEach(
    (habit, index) => {

      const completed =
        isCompleted(
          habit,
          todayKey
        );


      const streak =
        getStreak(
          habit
        );


      const div =
        document.createElement(
          "div"
        );


      div.className =
        completed
          ? "habit done"
          : "habit";


      div.innerHTML = `

        <input

          class="habit-check"

          type="checkbox"

          ${
            completed
              ? "checked"
              : ""
          }

          onchange="
            toggleHabit(${index})
          "

        >


        <div class="habit-info">

          <div class="habit-name">

            ${escapeHTML(
              habit.name
            )}

          </div>


          <span
            class="habit-category"
          >

            ${getCategoryEmoji(
              habit.category
            )}

            ${escapeHTML(
              habit.category
            )}

          </span>


          <small
            class="habit-streak"
          >

            🔥 Streak:
            ${streak}
            days

          </small>

        </div>


        <button

          class="delete-button"

          onclick="
            deleteHabit(${index})
          "

        >

          🗑️

        </button>

      `;


      list.appendChild(
        div
      );

    }
  );

}


// =====================================
// CATEGORY EMOJI
// =====================================

function getCategoryEmoji(
  category
) {

  const emojis = {

    Study: "📚",

    Health: "💪",

    Fitness: "🏃",

    Reading: "📖",

    Personal: "🌱",

    Other: "⭐"

  };


  return emojis[
    category
  ] || "⭐";

}


// =====================================
// DAILY PROGRESS
// =====================================

function updateDailyProgress() {

  const total =
    habits.length;


  const completed =
    habits.filter(
      habit =>
        isCompleted(
          habit,
          todayKey
        )
    ).length;


  const percentage =
    total === 0
      ? 0
      : Math.round(
          completed /
          total *
          100
        );


  document.getElementById(
    "progress"
  ).textContent =
    percentage + "%";


  document.getElementById(
    "circleText"
  ).textContent =
    percentage + "%";


  document.getElementById(
    "completedCount"
  ).textContent =
    completed;


  document.getElementById(
    "totalCount"
  ).textContent =
    total;


  document.getElementById(
    "habitCount"
  ).textContent =
    total;

}


// =====================================
// LAST 7 DAYS
// =====================================

function getLastSevenDays() {

  const days = [];

  for (
    let i = 6;
    i >= 0;
    i--
  ) {

    const date =
      new Date();


    date.setDate(
      date.getDate() - i
    );


    days.push(date);

  }


  return days;

}


// =====================================
// WEEK CALENDAR
// =====================================

function renderWeekCalendar() {

  const container =
    document.getElementById(
      "weekCalendar"
    );


  container.innerHTML = "";


  const days =
    getLastSevenDays();


  days.forEach(
    date => {

      const key =
        getDateKey(
          date
        );


      const completed =
        habits.length > 0 &&
        habits.some(
          habit =>
            isCompleted(
              habit,
              key
            )
        );


      const isToday =
        key === todayKey;


      const box =
        document.createElement(
          "div"
        );


      box.className =
        "day-box";


      if (completed) {

        box.classList.add(
          "completed"
        );

      }


      if (isToday) {

        box.classList.add(
          "today"
        );

      }


      box.innerHTML = `

        <span class="day-name">

          ${date.toLocaleDateString(
            "en-IN",
            {
              weekday: "short"
            }
          )}

        </span>


        <span class="day-number">

          ${date.getDate()}

        </span>

      `;


      container.appendChild(
        box
      );

    }
  );

}


// =====================================
// WEEKLY PROGRESS
// =====================================

function updateWeeklyProgress() {

  if (
    habits.length === 0
  ) {

    setWeeklyProgress(
      0
    );

    return;

  }


  const days =
    getLastSevenDays();


  let possible = 0;

  let completed = 0;


  days.forEach(
    date => {

      const key =
        getDateKey(
          date
        );


      habits.forEach(
        habit => {

          const created =
            habit.createdDate ||
            todayKey;


          if (
            key >= created
          ) {

            possible++;


            if (
              isCompleted(
                habit,
                key
              )
            ) {

              completed++;

            }

          }

        }
      );

    }
  );


  const percentage =
    possible === 0
      ? 0
      : Math.round(
          completed /
          possible *
          100
        );


  setWeeklyProgress(
    percentage
  );

}


// =====================================
// SET WEEKLY PROGRESS
// =====================================

function setWeeklyProgress(
  percentage
) {

  document.getElementById(
    "weeklyPercent"
  ).textContent =
    percentage + "%";


  document.getElementById(
    "weekPercent"
  ).textContent =
    percentage + "%";


  document.getElementById(
    "weeklyBar"
  ).style.width =
    percentage + "%";


  const text =
    document.getElementById(
      "weeklyText"
    );


  if (percentage === 0) {

    text.textContent =
      "Start today. You can do it! 💪";

  }

  else if (
    percentage < 50
  ) {

    text.textContent =
      "Good start. Keep building consistency! 🔥";

  }

  else if (
    percentage < 80
  ) {

    text.textContent =
      "You're doing great! Keep going! 🚀";

  }

  else if (
    percentage < 100
  ) {

    text.textContent =
      "Excellent consistency! Almost there! 🏆";

  }

  else {

    text.textContent =
      "Amazing! Perfect week! 🔥🏆";

  }

}


// =====================================
// CATEGORY SUMMARY
// =====================================

function updateCategorySummary() {

  const container =
    document.getElementById(
      "categorySummary"
    );


  container.innerHTML = "";


  const categories = {

    Study: 0,

    Health: 0,

    Fitness: 0,

    Reading: 0,

    Personal: 0,

    Other: 0

  };


  habits.forEach(
    habit => {

      const category =
        habit.category ||
        "Other";


      if (
        categories[
          category
        ] !== undefined
      ) {

        categories[
          category
        ]++;

      } else {

        categories.Other++;

      }

    }
  );


  Object.keys(
    categories
  ).forEach(
    category => {

      const box =
        document.createElement(
          "div"
        );


      box.className =
        "category-box";


      box.innerHTML = `

        <strong>

          ${getCategoryEmoji(
            category
          )}

          ${category}

        </strong>


        <span>

          ${categories[
            category
          ]}

          habit${
            categories[
              category
            ] === 1
              ? ""
              : "s"
          }

        </span>

      `;


      container.appendChild(
        box
      );

    }
  );

}


// =====================================
// OVERALL STREAK
// =====================================

function updateStreak() {

  let best =
    0;


  habits.forEach(
    habit => {

      const streak =
        getStreak(
          habit
        );


      if (
        streak > best
      ) {

        best =
          streak;

      }

    }
  );


  document.getElementById(
    "streak"
  ).textContent =
    best;

}


// =====================================
// MOTIVATIONAL MESSAGE
// =====================================

function updateMotivation() {

  const completed =
    habits.filter(
      habit =>
        isCompleted(
          habit,
          todayKey
        )
    ).length;


  const total =
    habits.length;


  const messages = [

    "Start small. Stay consistent. 🌱",

    "One good habit can change your day. 💪",

    "Discipline beats motivation. 🔥",

    "Keep going. Your future self will thank you. 🚀",

    "Small progress is still progress. 📈",

    "You don't need to be perfect. Just be consistent. 🏆",

    "Make today count! ⚡"

  ];


  let message;


  if (
    total === 0
  ) {

    message =
      "Add your first habit and start your journey! 🚀";

  }

  else if (
    completed === total
  ) {

    message =
      "Amazing! You completed every habit today! 🏆🔥";

  }

  else if (
    completed > 0
  ) {

    message =
      "Great start! Keep going and finish strong! 💪";

  }

  else {

    const index =
      todayDate.getDate() %
      messages.length;


    message =
      messages[index];

  }


  document.getElementById(
    "motivation"
  ).textContent =
    message;

}


// =====================================
// DARK MODE
// =====================================

function toggleDarkMode() {

  document.body.classList.toggle(
    "dark"
  );


  const enabled =
    document.body.classList.contains(
      "dark"
    );


  localStorage.setItem(
    "darkMode",
    enabled
      ? "on"
      : "off"
  );


  updateDarkButton();

}


// =====================================
// DARK MODE BUTTON
// =====================================

function updateDarkButton() {

  const button =
    document.getElementById(
      "darkButton"
    );


  const enabled =
    document.body.classList.contains(
      "dark"
    );


  button.textContent =
    enabled
      ? "ON"
      : "OFF";

}


// =====================================
// LOAD DARK MODE
// =====================================

if (
  localStorage.getItem(
    "darkMode"
  ) === "on"
) {

  document.body.classList.add(
    "dark"
  );

}


// =====================================
// RENDER EVERYTHING
// =====================================

function renderAll() {

  renderHabits();

  updateDailyProgress();

  renderWeekCalendar();

  updateWeeklyProgress();

  updateCategorySummary();

  updateStreak();

  updateMotivation();

  updateDarkButton();

}


// =====================================
// INITIAL LOAD
// =====================================

saveHabits();

renderAll();