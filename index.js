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
    console.log(this.state.currentInput);
    this.state.tasks.push(this.state.currentInput);
    console.log(this.state.tasks);
  };

  onAddInputChange = () => {
    this.state.currentInput = document.getElementById("new-todo").value;
  };

  render() {
    let elements = [];
    for(let str of this.state.tasks){
      const elem = createElement("li", {}, [
          createElement("input", { type: "checkbox" }),
          createElement("label", {}, str),
          createElement("button", {}, "🗑️")
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
