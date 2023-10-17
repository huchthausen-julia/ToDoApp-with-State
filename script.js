const remBtn = document.querySelector(".remove-btn");
const addBtn = document.querySelector(".add-btn");
const inputField = document.querySelector(".input");
const ulEl = document.querySelector(".todo-container");
const radioContainer = document.querySelector(".radio-container");
let newLiElement;
let newInputElement;
let newToDo;

const filterOptions = ["all", "done", "open"];

let toDoAppState = {
  filter: "all",
  todos: [
    { id: 1, description: "neue Sprache lernen", done: false },
    { id: 2, description: "Movement", done: false },
    { id: 3, description: "ein tolles Buch lesen", done: false },
  ],
};

function toDoAppStateDataFromLocalStorage() {
  const toDoAppStateJSON = localStorage.getItem("toDoAppState");
  if (toDoAppStateJSON) {
    toDoAppState = JSON.parse(toDoAppStateJSON);
  }
}

toDoAppStateDataFromLocalStorage();

function render() {
  ulEl.innerHTML = "";
  const filter = toDoAppState.filter;

  for (let todo of toDoAppState.todos) {
    const isDone = todo.done;

    if (
      filter === "all" ||
      (filter === "done" && isDone) ||
      (filter === "open" && !isDone)
    ) {
      const newLi = document.createElement("li");
      const newInput = document.createElement("input");

      newLi.setAttribute("data-id", todo.id);

      newInput.addEventListener("change", () => {
        todo.done = newInput.checked; // synchronisation vom state und nutzeroberfläche
        render();
      });
      newInput.setAttribute("type", "checkbox");
      newInput.checked = todo.done;
      updateStyling(newLi, newInput, todo.done);

      const liText = document.createTextNode(todo.description);

      newLi.appendChild(newInput);
      newLi.appendChild(liText);
      ulEl.appendChild(newLi);
    }
  }
}

toDoAppStateDataFromLocalStorage();
render();

function updateStyling(liElement, checkbox, isDone) {
  if (isDone) {
    liElement.style.textDecoration = "line-through";
    checkbox.checked = true;
  } else {
    liElement.style.textDecoration = "none";
    checkbox.checked = false;
  }
}

addBtn.addEventListener("click", () => {
  addInput();
  inputField.value = "";

  updateStyling(newLiElement, newInputElement, newToDo.done);
  saveToDoAppStateToLocalStorage();
});

inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addInput();
    inputField.value = "";
  }
});

function addInput() {
  const inputValue = inputField.value.trim(); // entfernt Leerschritte vor und nach der Eingabe im inputFeld!
  console.log(inputValue);
  if (inputValue !== "" && inputValue.length >= 5) {
    const newToDo = {
      id: new Date().getTime(),
      description: inputValue,
      done: false,
    };
    console.log("Generierte ID:", newToDo.id);
    toDoAppState.todos.push(newToDo);

    newLiElement = document.createElement("li");
    newInputElement = document.createElement("input");
    const liText = document.createTextNode(newToDo.description);

    newInputElement.setAttribute("type", "checkbox");
    newInputElement.addEventListener("change", () => {
      newToDo.done = newInputElement.checked;
      updateStyling(newLiElement, newInputElement, newToDo.done);
    });

    newLiElement.appendChild(newInputElement);
    newLiElement.appendChild(liText);
    ulEl.appendChild(newLiElement);

    inputField.value = "";

    updateStyling(newLiElement, newInputElement, newToDo.done);
    saveToDoAppStateToLocalStorage(); // aktuellen Stand speichern, wenn ein neues Todo hinzugefügt wird
  } else {
    alert("unzulässige Eingabe!");
    inputField.value = "";
  }
}

function saveToDoAppStateToLocalStorage() {
  const toDoAppStateJSON = JSON.stringify(toDoAppState);
  localStorage.setItem("toDoAppState", toDoAppStateJSON);
}

saveToDoAppStateToLocalStorage();

remBtn.addEventListener("click", () => {
  const checkboxesChecked = ulEl.querySelectorAll(
    "input[type='checkbox']:checked"
  );

  checkboxesChecked.forEach((checkbox) => {
    const li = checkbox.parentElement;
    const todoId = parseInt(li.getAttribute("data-id"), 10);

    // entfernt ToDo aus dem state anhand der id
    toDoAppState.todos = toDoAppState.todos.filter(
      (todo) => todo.id !== todoId
    );
    li.remove();
  });
  saveToDoAppStateToLocalStorage();
});

//aktualisieren des Filters im toDoAppState und Neuzeichnen der Liste
radioContainer.addEventListener("change", (e) => {
  const selectedFilter = e.target.value;
  toDoAppState.filter = selectedFilter;
  render(); /* wenn der Filter sich ändert, wird render() erneut 
  aufgerufen, um die ToDoListe zu aktualisieren! */
});
