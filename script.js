const remBtn = document.querySelector(".remove-btn");
const addBtn = document.querySelector(".add-btn");
const inputField = document.querySelector(".input");
const ulEl = document.querySelector(".todo-container");
const radioContainer = document.querySelector(".radio-container");


const filterOptions = ["all", "done", "open"];

let toDoAppState = {
  filter: "all",
  todos: [
    { id: 1, description: "neue Sprache lernen", done: false },
    { id: 2, description: "Movement", done: false },
    { id: 3, description: "ein tolles Buch lesen", done: false },
  ],
};

addBtn.addEventListener("click", () => {
  addInput();
  inputField.value = "";

  saveToDoAppStateToLocalStorage();
});

inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addInput();
    inputField.value = "";
  }
});

toDoAppStateDataFromLocalStorage();
render();

function toDoAppStateDataFromLocalStorage() {
  const toDoAppStateJSON = localStorage.getItem("toDoAppState"); // mit .getItem wird der Eintrag ausgelesen
  if (toDoAppStateJSON !== null) {
    toDoAppState = JSON.parse(toDoAppStateJSON);
  } else {
    console.log("Keine Daten im local Storage gefunden!");
  }
}

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

      newInput.addEventListener("input", () => {
        todo.done = newInput.checked; // synchronisation vom state und nutzeroberfläche
        updateStyling(newLi, newInput, todo.done);
        saveToDoAppStateToLocalStorage();
        console.log(todo.done);
      });
      newInput.setAttribute("type", "checkbox");
      newInput.checked = todo.done;
      updateStyling(newLi, newInput, todo.done);

      const liText = document.createTextNode(todo.description);

      newLi.append(newInput);
      newLi.append(liText);
      ulEl.append(newLi);
    }
  }
}

function updateStyling(liElement, checkbox, isDone) {
  if (isDone) {
    liElement.style.textDecoration = "line-through";
    checkbox.checked = true;
  } else {
    liElement.style.textDecoration = "none";
    checkbox.checked = false;
  }
}

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

    inputField.value = "";

    render();
    saveToDoAppStateToLocalStorage(); // aktuellen Stand speichern, wenn ein neues Todo hinzugefügt wird
  } else {
    alert("unzulässige Eingabe!");
    inputField.value = "";
  }
}

function saveToDoAppStateToLocalStorage() {
  /*-> .stringify konvertiert ein Wert o. Objekt in einen String!*/
  const toDoAppStateJSON = JSON.stringify(toDoAppState);
  localStorage.setItem("toDoAppState", toDoAppStateJSON);
  /* 
  -> localStorage: Eigenschaft des window-Objekts!
  Methode localStorage.setItem wird verwendet, um den akt. State von "toDoAppState" in Form einer JSON-Serialisierung
  im Browser zu speichern!*/
}

remBtn.addEventListener("click", removeDoneToDos);

function removeDoneToDos() {
  const checkboxesChecked = ulEl.querySelectorAll(
    "input[type='checkbox']:checked"
  ); //NodeList von allen ausgewählten Checkbox-Elementen wird erstellt!

  checkboxesChecked.forEach((checkbox) => {
    //forEach iteriert durch jedes Checkbox-Element
    const li = checkbox.parentElement; // das ElternEl von CheckboxEl wird unter "li" gespeichert
    const todoId = parseInt(li.getAttribute("data-id"), 10); // Die Methode li.getAttribute("data-id") wird verwendet,
    //um den Wert des data-id-Attributs aus dem li-Element abzurufen. Dieses Attribut enthält die eindeutige ID des ToDo-Elements.
    //Das data-id-Attribut wird als Zeichenkette abgerufen und dann mit parseInt in eine Ganzzahl umgewandelt.
    //parseInt nimmt zwei Argumente entgegen: die Zeichenkette, die in eine Zahl umgewandelt werden soll, und die Basis,
    //die für die Konvertierung verwendet werden soll. Im vorliegenden Fall wird die Basis 10 verwendet, da wir eine dezimale Ganzzahl erwarten.

    // entfernt ToDo aus dem state anhand der id
    toDoAppState.todos = toDoAppState.todos.filter(
      (todo) => todo.id !== todoId
    );
    li.remove();
  });
  saveToDoAppStateToLocalStorage();
}

//aktualisieren des Filters im toDoAppState und Neuzeichnen der Liste
radioContainer.addEventListener("change", updateFilter);

function updateFilter(e) {
  const selectedFilter = e.target.value;
  toDoAppState.filter = selectedFilter;
  render(); /* wenn der Filter sich ändert, wird render() erneut 
  aufgerufen, um die ToDoListe zu aktualisieren! */
}