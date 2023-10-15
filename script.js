const remBtn = document.querySelector(".remove-btn");
const addBtn = document.querySelector(".add-btn");
const inputField = document.querySelector(".input");
const ulEl = document.querySelector(".todo-container");
const radioContainer = document.querySelector(".radio-container");

const filterOptions = ["all", "done", "open"];

const toDoAppState = {
  filter: "all",
  todos: [
    { id: 1, description: "Learn HTML", done: false },
    { id: 2, description: "Learn CSS", done: false },
    { id: 3, description: "Learn JS", done: false },
  ],
};

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

// render();

addBtn.addEventListener("click", () => {
  addInput();
  inputField.value = "";
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

    const newLiElement = document.createElement("li");
    const newInputElement = document.createElement("input");
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
  } else {
    alert("unzulässige Eingabe!");
    inputField.value = "";
  }
}

remBtn.addEventListener("click", () => {
  const checkboxesChecked = ulEl.querySelectorAll(
    "input[type='checkbox']:checked"
  );

  checkboxesChecked.forEach((checkbox) => {
    const li = checkbox.parentElement;
    li.remove();
  });
});

//aktualisieren des Filters im toDoAppState und Neuzeichnen der Liste
radioContainer.addEventListener("change", (e) => {
  const selectedFilter = e.target.value;
  toDoAppState.filter = selectedFilter;
  render(); /* wenn der Filter sich ändert, wird render() erneut 
  aufgerufen, um die ToDoListe zu aktualisieren! */
});
