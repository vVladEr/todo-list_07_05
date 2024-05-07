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

class TodoList extends Component {
  constructor(){
    super();
    this.state = {
      tasks:["Сделать домашку", "Сделать практику", "Пойти домой"],
      currentInput:""
    }
  }

  onAddTask = () => {
    this.state.tasks.push(this.state.currentInput);
    this.update();
  };

  onAddInputChange = () => {
    this.state.currentInput = document.getElementById("new-todo").value;
  };

  onDeleteBtnClick = (text) => {

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

  createdeleteBtn = function(){
    const btn = createElement("button", {}, "🗑️");
    btn.addEventListener("click", () => {
      const text = btn.previousSibling.innerText;
      const index = this.state.tasks.indexOf(text);
      if(index !== -1){
        this.state.tasks.splice(index, 1);
        this.update();
      }
    });
    return btn;
  }

  render() {
    let elements = [];
    for(let str of this.state.tasks){
      const elem = createElement("li", {}, [
        this.createCheckBox(),
        createElement("label", {}, str),
        this.createdeleteBtn()
      ]);
      elements.push(elem);
    }


    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      createElement("div", { class: "add-todo" }, [
        createElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
        }, undefined, {event:"change", callback:this.onAddInputChange}),
        createElement("button", { id: "add-btn" }, "+", {event:"click", callback:this.onAddTask}),
      ]),
      createElement("ul", { id: "todos" }, elements),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
