// TODO: abstract todo CRUD behaviour here

const { ipcRenderer } = require('electron')
const DataStore = require('../DataStore') 
const anchors = {
  'main': '#mainList',
  'secondary': '#secList',
  'dumpster': 'dumpList'
}

class ToDoList {
  constructor(type){
    this.validateType(type)
    this.type = type // options: 'main' 'secondary' 'dumpster'
    this.store = new DataStore({ name: type})
    this.tag = document.querySelector(anchors[`${type}`])
    this.input = document.querySelector(`#input_${type}`)
    this.submit = document.querySelector(`#submit_${type}`)

    this.clickHandlerOnSubmit()
  }

  validateType(type){
    if(type === 'main' || type === 'secondary' || type === 'dumpster'){
      return
    } else {
      throw new Error("invalid type for todolist, can't initialise class like this")
    }
  }

  render(){
    this.tag.innerHTML = ""
    this.store.todos.map(x => this.tag.innerHTML += `<li class="todo-item">${x}</li>`)
    this.clickHandlerOnItems()
  }

  // takes html collection, add event listeners, returns void
  clickHandlerOnItems(){
    const c = this.tag.children
    for(let i=0; i < c.length; i++ ){
      c[i].addEventListener('click', (e)=>{
        ipcRenderer.send('TodoDeleted', e.target.textContent, this.type)
      })
    }
  }
  clickHandlerOnSubmit() {
    console.log('adding click handler on submit btns')
    this.submit.addEventListener('click',() => {
      ipcRenderer.send('TodoSubmited', this.type)
    })
  }

  handleSubmit(){
    console.log(this.input.value)
    this.addToDo(this.input.value)
  }

  addToDo(todo){
    this.store.addTodo(todo)
    this.input.value = ""
    this.render()
    // document.querySelector("#mainList").innerHTML += `<li class="todo-item" >${newToDo}</li>`
  }
  // Removed given todo from store and html; passed msg through main.js;
  deleteToDo(todo){
    console.log("deleting from class, updated state:")
    console.log(this.store.todos)
    const updatedToDos = this.store.deleteTodo(todo).todos
    console.log(this.store.todos)
    this.render()
  }
  // save to disk
}
module.exports = ToDoList
