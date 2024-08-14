const input = document.querySelector(
  "body > div > div.form > input[type=text]"
);
const addButton = document.querySelector("body > div > div.form > button");
const listContainer = document.querySelector(".content > ul");
const alertText = document.querySelector(".alert");
const folders = document.querySelector(".folders");
const blurBlock = document.querySelector(".blur");
const addNewFolderButton = document.querySelector("button.folder.newFolder");
const createFolderButton = document.querySelector(".blur >.modal>button");
const createFolderInput = document.querySelector(".blur >.modal>input");
let currentFolder = "_general";

addButton.addEventListener("click", handleClick);
input.addEventListener("keyup", function (event) {
  if (event.key === "Enter" || event.keyCode === 13 || event.key === "Go") {
    handleClick();
  }
});

function handleClick() {
  if (input.value.length === 0) {
    alertText.textContent = "Empty";
    alertText.classList.remove("hidden");
  } else if (input.value.length > 300) {
    alertText.textContent = ">300 symbols";
    alertText.classList.remove("hidden");
  } else {
    alertText.classList.add("hidden");
    createTask(true);
  }
}

folders.addEventListener("click", (evt) => {
  if (evt.target.closest("button.folder.newFolder")) {
    blurBlock.classList.toggle("none");
    blurBlock.animate(
      [{ backdropFilter: "blur(0px)" }, { backdropFilter: "blur(4px)" }],
      {
        duration: 200,
        iterations: 1,
      }
    );
    blurBlock.firstElementChild.animate(
      [
        { transform: "scale(0.9)", opacity: "0" },
        { transform: "scale(1)", opacity: "1" },
      ],
      {
        duration: 100,
        iterations: 1,
      }
    );
  }

  if (evt.target.closest(".folders button:not(:last-child)")) {
    Array.from(folders.children).forEach((elem) => {
      elem != evt.target
        ? elem.classList.remove("active")
        : evt.target.classList.toggle("active");
    });

    currentFolder = folders.querySelector(".active")
      ? folders.querySelector(".active").textContent
      : "_general";
    render();
  }
});

createFolderButton.addEventListener("click", () => {
  if (createFolderInput.value.length === 0) {
    blurBlock.firstElementChild.animate(
      [
        { transform: "scale(1)", opacity: "1" },
        { transform: "scale(0.9)", opacity: "0" },
      ],
      {
        duration: 100,
        iterations: 1,
      }
    ).onfinish = () => {
      blurBlock.classList.toggle("none");
    };
  } else {
    const newFolderName = createFolderInput.value;
    createFolderInput.value = "";
    blurBlock.animate(
      [{ backdropFilter: "blur(4px)" }, { backdropFilter: "blur(0px)" }],
      {
        duration: 200,
        iterations: 1,
      }
    );
    blurBlock.firstElementChild.animate(
      [
        { transform: "scale(1)", opacity: "1" },
        { transform: "scale(0.9)", opacity: "0" },
      ],
      {
        duration: 100,
        iterations: 1,
      }
    ).onfinish = () => {
      blurBlock.classList.toggle("none");
      addNewFolder(newFolderName, true, true);
      if (currentFolder === "_general") {
        window.localStorage.setItem(
          newFolderName,
          localStorage.getItem("_general")
        );
        window.localStorage.setItem("_general", JSON.stringify([]));
      } else {
        window.localStorage.setItem(newFolderName, JSON.stringify([]));
        listContainer.innerHTML = "";
      }
      currentFolder = newFolderName;
      Array.from(folders.children).forEach((elem) => {
        elem.textContent === currentFolder
          ? elem.classList.add("active")
          : elem.classList.remove("active");
      });
      
    };
  }
});

listContainer.addEventListener("click", (evt) => {
  const tasksJSON = window.localStorage.getItem(currentFolder);
  let tasks = tasksJSON ? JSON.parse(tasksJSON) : [];

  if (evt.target.closest("input[type=checkbox]")) {
    evt.target.nextElementSibling.classList.toggle("checked");
    tasks.find((elem) => {
      if (elem.id === evt.target.parentElement.dataset.taskId) {
        elem.isChecked = !elem.isChecked;
        if (evt.target.checked) {
          evt.target.classList.remove("animate-off");
          evt.target.classList.add("animate-on");
        } else {
          evt.target.classList.remove("animate-on");
          evt.target.classList.add("animate-off");
        }
      }
    });
    window.localStorage.setItem(currentFolder, JSON.stringify(tasks));
  }

  if (evt.target.closest("i")) {
    tasks = tasks.filter((elem) => {
      if (elem.id === evt.target.parentElement.dataset.taskId) {
        evt.target.parentElement.animate(
          [
            { transform: " translateX(0px)", opacity: 1 },
            { transform: " translateX(100px)", opacity: 0 },
          ],
          {
            duration: 200,
            iterations: 1,
          }
        ).onfinish = () => {
          render();
        };
        return false;
      } else {
        return true;
      }
    });
    window.localStorage.setItem(currentFolder, JSON.stringify(tasks));
  }
});

function createTask(isAnimate = false) {
  const tasksJSON = window.localStorage.getItem(currentFolder);
  const tasks = tasksJSON ? JSON.parse(tasksJSON) : [];
  const newTask = { text: input.value, isChecked: false, id: generateID() };
  tasks.push(newTask);
  window.localStorage.setItem(currentFolder, JSON.stringify(tasks));
  addTask(newTask, isAnimate);
}

function generateID() {
  return "_" + Math.random().toString().substr(2, 9);
}

function addTask(task, isAnimate = false) {
  const newTask = document.createElement("li");
  newTask.classList.add("list-item");
  newTask.dataset.taskId = task.id;
  newTask.innerHTML = `<input type="checkbox" ${
    task.isChecked ? "checked" : ""
  }>
                       <p class="${task.isChecked ? "checked" : ""}">${
    task.text
  }</p>
                       <i class="fa-solid fa-trash-can"></i>
              `;
  input.value = "";
  listContainer.prepend(newTask);
  isAnimate
    ? newTask.animate(
        [
          { transform: " scale(0.95)", opacity: 0 },
          { transform: " scale(1)", opacity: 1 },
        ],
        {
          duration: 200,
          iterations: 1,
        }
      )
    : false;
}

function addNewFolder(newFolderName, isAnimate = false, isActive = false) {
  const newFolder = document.createElement("button");
  newFolder.classList.add("folder");
  isActive ? newFolder.classList.add("active") : false;
  newFolder.textContent = newFolderName;
  document.querySelector(".folders").prepend(newFolder);

  isAnimate
    ? newFolder.animate(
        [
          { transform: " scale(0.95)", opacity: 0 },
          { transform: " scale(1)", opacity: 1 },
        ],
        {
          duration: 200,
          iterations: 1,
        }
      )
    : false;
}

function render() {
  listContainer.innerHTML = "";
  folders.innerHTML = `<button class="folder newFolder"><i class="fa-solid fa-folder"></i></button>`;
  let removeItems = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const folderName = window.localStorage.key(i);
    const tasks = JSON.parse(window.localStorage.getItem(folderName));
    if (currentFolder === folderName) {
      tasks.forEach((task) => {
        addTask(task, true);
      });
    }
    if (tasks.length !== 0 && folderName != "_general") {
      addNewFolder(folderName, false, currentFolder === folderName);
    } else if (folderName != "_general") {
      folderName === currentFolder ? (currentFolder = "_general") : false;
      removeItems.push(folderName);
    }
  }

  removeItems.forEach((item) => {
    localStorage.removeItem(item);
  });
}

render();
