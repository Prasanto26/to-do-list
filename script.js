const form = document.getElementById("form");
const input = document.getElementById("input");
const dateInput = document.getElementById("date");
const startHour = document.getElementById("startHour");
const startMinute = document.getElementById("startMinute");
const startAmPm = document.getElementById("startAmPm");
const endHour = document.getElementById("endHour");
const endMinute = document.getElementById("endMinute");
const endAmPm = document.getElementById("endAmPm");
const list = document.getElementById("list");
const empty = document.getElementById("empty");
const count = document.getElementById("count");
const filterButtons = document.querySelectorAll(".filters button");
const clearCompletedBtn = document.getElementById("clearCompleted");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Populate dropdowns
function populateDropdowns() {
  for (let i = 1; i <= 12; i++) {
    startHour.add(new Option(i, i));
    endHour.add(new Option(i, i));
  }
  for (let i = 0; i < 60; i++) {
    let formatted = i < 10 ? "0" + i : i;
    startMinute.add(new Option(formatted, formatted));
    endMinute.add(new Option(formatted, formatted));
  }
}
populateDropdowns();

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add task
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  const date = dateInput.value;
  const start = `${startHour.value}:${startMinute.value} ${startAmPm.value}`;
  const end = `${endHour.value}:${endMinute.value} ${endAmPm.value}`;

  if (text && date) {
    const task = {
      id: Date.now(),
      text,
      date,
      start,
      end,
      completed: false
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    form.reset();
  }
});

// Render tasks with filter
function renderTasks() {
  list.innerHTML = "";
  let filtered = tasks.filter(t =>
    currentFilter === "active" ? !t.completed :
    currentFilter === "completed" ? t.completed :
    true
  );

  if (filtered.length === 0) {
    empty.hidden = false;
  } else {
    empty.hidden = true;
  }

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const info = document.createElement("div");
    info.className = "task-info";

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = task.text;

    const deadline = document.createElement("span");
    deadline.className = "deadline";
    deadline.textContent = `📅 ${task.date} | ${task.start} → ${task.end}`;

    info.appendChild(span);
    info.appendChild(deadline);

    const actions = document.createElement("div");
    actions.className = "actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = task.completed ? "Undo" : "Done";
    toggleBtn.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    actions.appendChild(toggleBtn);
    actions.appendChild(delBtn);

    li.appendChild(info);
    li.appendChild(actions);
    list.appendChild(li);
  });

  // ✅ Always show total task count
  count.textContent = `${tasks.length} total task(s)`;
}

// Filters
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Clear completed tasks
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
});

// Initial render
window.addEventListener("load", renderTasks);
