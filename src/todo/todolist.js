// TODO: abstract todo CRUD behaviour here

const { ipcRenderer } = require('electron')
const DataStore = require('../DataStore') 

const cssAnchors =[
  { name: 'main', tag: '#mainList' },
  { name: 'secondary', tag: '#secList' },
  { name: 'dumpster', tag: '#3'}
]

class ToDoList {
  // constrcutor
  constructor(type){
    this.validateType(type)
    this.type = type // options: 'main' 'secondary' 'dumpster'
    this.store = new DataStore({ name: type})
    this.html = cssAnchors.type
    this.store.addTodo('task from class')
    this.store.todos.forEach(this.addListHtml)
  }

  validateType(type){
    if(cssAnchors.find(el => { return el.name === type }))
      return
      else {
        console.log(type)
        throw new Error("invalid type for todolist, can't initialise class like this")
      }
  }

  addListHtml(item, index, arr){
    document.querySelector("#secList").innerHTML += `<li class="todo-item">${arr[index]}</li>`
  }


  // get all list items
  // add list item
  // remove list item
  // save to disk
}
module.exports = ToDoList
