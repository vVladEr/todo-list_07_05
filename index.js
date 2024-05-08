function createElement(tag, attributes, children, callback) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if(callback){
      element.addEventListener(callback.event, callback.callback)
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  return element;
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    const newDomNode = this.render();
    this._domNode.parentNode.replaceChild(newDomNode, this._domNode);
    this._domNode = newDomNode;
  }
}

class addTask extends Component{
  constructor(onAddTask){
    super();
    this.onAddTask = onAddTask;
    this.state = {
      currentInput: ""
    }
  }

  onAddInputChange = () => {
    this.state.currentInput = document.getElementById("new-todo").value;
  };

  render() {
    return createElement("div", { class: "add-todo" }, [
        createElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
        }, undefined, {event:"change", callback:this.onAddInputChange}),
        createElement("button", { id: "add-btn" }, "+", {event:"click", callback: () => this.onAddTask(this.state.currentInput)}),
      ]);
  }
}


class Task extends Component{
  constructor(taskText, onDeleteTask){
    super();
    this.onDeleteTask = onDeleteTask;
    this.taskText = taskText;
    this.state = {deleteClicks: 0};
  }
  createCheckBox = function(){
    let doneBox = createElement("input", { type: "checkbox" });
    doneBox.addEventListener("change", () => {
      const elem = doneBox.nextElementSibling;
      if (doneBox.checked) {
        elem.style.color = "gray";
      } else {
        elem.style.color = "black";
      }
    });
    return doneBox;
  }

  createDeleteBtn = function(){
    const btn = createElement("button", {}, "🗑️");
    btn.addEventListener("click", () => {
      if(this.state.deleteClicks > 0){
        const task = btn.parentNode;
        const index = Array.prototype.indexOf.call(task.parentNode.children, task);
        this.onDeleteTask(index);
      }
      else{
        btn.style.background = "red";
        this.state.deleteClicks++;
      }

    });
    return btn;
  }

  render() {
    return createElement("li", {}, [
      this.createCheckBox(),
      createElement("label", {}, this.taskText),
      this.createDeleteBtn()
    ]);
  }
}

class TodoList extends Component {
  constructor(){
    super();
    this.state = {
      tasks:["Сделать домашку", "Сделать практику", "Пойти домой"],
      currentInput:""
    }
  }

  onAddTask = (taskText) => {
    this.state.tasks.push(taskText);
    this.update();
  };

  onDeleteTask = (index) => {
    if(index !== -1){
      this.state.tasks.splice(index, 1);
      this.update();
    }
  }

  render() {
    let elements = [];
    for(let str of this.state.tasks){
      elements.push( new Task(str, this.onDeleteTask).render());
    }
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      new addTask(this.onAddTask).render(),
      createElement("ul", { id: "todos" }, elements),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
