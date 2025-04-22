document.querySelector("#task").focus();

function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (!Array.isArray(tasks)) {
    tasks = [];
  }

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTask(task) {
  let addedTask = document.createElement("li");
  addedTask.className = "task-item";
  addedTask.setAttribute("date-id", task.id);

  const taskText = document.createElement("span");
  taskText.className = "task-text";
  taskText.textContent = task.text;

  const actionContainer = document.createElement("div");
  actionContainer.className = "task-actions";
  if (task.completed) {
    addedTask.classList.add("completed");
  }
  taskBtn(actionContainer, addedTask, task);

  addedTask.appendChild(taskText);
  addedTask.appendChild(actionContainer);

  document.getElementById("taskList").appendChild(addedTask);
}

function taskBtn(container, addedTask, task) {
  const completeBtn = document.createElement("button");
  completeBtn.className = "task-btn complete";
  completeBtn.innerHTML = "✔";
  completeBtn.title = "Mark as completed";
  completeBtn.addEventListener("click", function () {
    addedTask.classList.toggle("completed");

    // 🧠 Update the completed status in localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map((t) =>
      t.id === task.id ? { ...t, completed: !t.completed } : t
    );
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-btn delete";
  deleteBtn.innerHTML = "X";
  deleteBtn.title = "Move to trash";
  deleteBtn.addEventListener("click", function () {
    moveToTrash(task.id);
  });

  container.appendChild(completeBtn);
  container.appendChild(deleteBtn);
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (!Array.isArray(tasks)) {
    tasks = [];
  }
  tasks.forEach((task) => {
    displayTask(task);
  });

  TaskMessage();
}

function addTask(taskText) {
  const task = {
    id: Date.now(),
    text: taskText,
    completed: false, // 💾 store completed state
  };
  saveTask(task);
  displayTask(task);
  TaskMessage();
}

document.querySelector("#add").addEventListener("click", function () {
  let taskInput = document.getElementById("task");
  let taskText = taskInput.value.trim();
  if (taskText !== "") {
    addTask(taskText);
    taskInput.value = "";
  }
});

// window.onload = loadTasks;
window.onload = () => {
  loadTasks();
  refreshTaskList();
  refreshTrashList();
};

window.addEventListener("DOMContentLoaded", () => {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  toggleThemeBtn.textContent = currentTheme === "dark" ? "☀️" : "🌙";
});

const filterBtn = document.getElementById("filterBtn");
const filter = document.getElementById("filterMenu");

function toggleMenu() {
  filter.classList.toggle("hidden");
}

filterBtn.addEventListener("click", toggleMenu);

document.body.addEventListener("click", (e) => {
  if (!filterBtn.contains(e.target) || filter.contains(e.target))
    filter.classList.remove("hidden");
});

filter.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.querySelectorAll(".hid input").forEach((input) => {
  input.addEventListener("click", toggleMenu);
});

function showAllTasks() {
  let tasks = document.querySelectorAll("#taskList li");
  tasks.forEach((task) => {
    task.style.display = "block";
  });
}

function showPendingTasks() {
  let tasks = document.querySelectorAll("#taskList li");
  tasks.forEach((task) => {
    if (!task.classList.contains("completed")) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  });
}

function showCompletedTasks() {
  let tasks = document.querySelectorAll("#taskList li");
  tasks.forEach((task) => {
    if (task.classList.contains("completed")) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  });
}

document.querySelector("#all").addEventListener("click", () => {
  showAllTasks();
});
document.querySelector("#pend").addEventListener("click", () => {
  showPendingTasks();
});
document.querySelector("#complete").addEventListener("click", () => {
  showCompletedTasks();
});


function showTrash() {
  const taskList = document.getElementById("taskList");
  const trashList = document.getElementById("trashList");
  const emptyTrashMessage = document.getElementById("empty");
  const emptyTaskMessage = document.getElementById("emptyTask");
  const button = document.getElementById("trash");

  const isTrashVisible = trashList.style.display === "block";

  if (!isTrashVisible) {
    // Show Trash
    trashList.style.display = "block";
    taskList.style.display = "none";
    emptyTrashMessage.style.display = "block";
    emptyTaskMessage.style.display = "none";

    button.value = "Back";
    refreshTrashList(); // Refresh trash items
    TrashMessage(); // Show "No Trash" message if needed
  } else {
    // Show Tasks
    trashList.style.display = "none";
    taskList.style.display = "block";
    emptyTrashMessage.style.display = "none";

    button.value = "Trash";
    refreshTaskList(); // Refresh main task list
    TaskMessage(); // Show "No Tasks" message if needed
  }
}




document.querySelector("#trash").addEventListener("click", () => {
  showTrash();
});

function TrashMessage() {
  let trashList = document.getElementById("trashList");
  let empty = document.getElementById("empty");
  if (trashList.children.length === 0) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
  }
}

function deleteVisibleTasks() {
  let taskElements = document.querySelectorAll("#taskList li");
  taskElements.forEach((taskElement) => {
    if (taskElement.style.display !== "none") {
      const taskId = parseInt(taskElement.getAttribute("date-id"));
      moveToTrash(taskId);
    }
  });
}
document.querySelector("#clear").addEventListener("click", () => {
  deleteVisibleTasks();
});

function refreshTaskList() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(displayTask);
  TaskMessage();
}

// function refreshTrashList() {
//   const trashList = document.getElementById("trashList");
//   trashList.innerHTML = "";

//   let trash = JSON.parse(localStorage.getItem("trash")) || [];

//   trash.forEach((task) => {
//     let trashItem = document.createElement("li");
//     trashItem.textContent = task.text;
//     trashItem.setAttribute("data-id", task.id);
//     trashBtn(trashItem);
//     trashList.appendChild(trashItem);
//   });

//   // check if trash is empty
// }


function refreshTrashList() {
  const trashList = document.getElementById("trashList");
  trashList.innerHTML = "";

  let trash = JSON.parse(localStorage.getItem("trash")) || [];

  trash.forEach((task) => {
    let trashItem = document.createElement("li");
    trashItem.className = "task-item";
    trashItem.setAttribute("data-id", task.id);

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    const actionContainer = document.createElement("div");
    actionContainer.className = "task-actions";

    trashBtn(actionContainer, task);

    trashItem.appendChild(taskText);
    trashItem.appendChild(actionContainer);
    trashList.appendChild(trashItem);
  });
}


function TaskMessage() {
  let task = document.getElementById("taskList");
  let empty = document.getElementById("emptyTask");
  if (task.children.length === 0) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
  }
}

function moveToTrash(taskId) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let trash = JSON.parse(localStorage.getItem("trash")) || [];

  const taskToMove = tasks.find((task) => task.id === taskId);
  if (!taskToMove) return;

  tasks = tasks.filter((task) => task.id !== taskId);
  trash.push(taskToMove);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("trash", JSON.stringify(trash));

  refreshTaskList(); // reload visible task list
  refreshTrashList();
  TaskMessage(); // reload trash UI
}


function trashBtn(container, task) {
  const restoreBtn = document.createElement("button");
  restoreBtn.textContent = "Restore";
  restoreBtn.className = "task-btn restore";
  restoreBtn.title = "Restore Task";

  restoreBtn.addEventListener("click", () => {
    restoreTaskById(task.id);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "task-btn delete";
  deleteBtn.title = "Delete Permanently";

  deleteBtn.addEventListener("click", () => {
    deleteTaskPermanentlyById(task.id);
  });

  container.appendChild(restoreBtn);
  container.appendChild(deleteBtn);
}


function restoreTaskById(taskId) {
  let trash = JSON.parse(localStorage.getItem("trash")) || [];
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const taskToRestore = trash.find((task) => task.id === taskId);
  if (!taskToRestore) return;

  trash = trash.filter((task) => task.id !== taskId);
  tasks.push(taskToRestore);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("trash", JSON.stringify(trash));

  refreshTrashList();
  refreshTaskList();
  TrashMessage();
}

function deleteTaskPermanentlyById(taskId) {
  let trash = JSON.parse(localStorage.getItem("trash")) || [];
  trash = trash.filter((task) => task.id !== taskId);

  localStorage.setItem("trash", JSON.stringify(trash));
  refreshTrashList();
  TrashMessage();
}

const toggleThemeBtn = document.getElementById("toggle-theme");

toggleThemeBtn.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);

  // Update icon based on new theme
  toggleThemeBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
});

