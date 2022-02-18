const { ipcRenderer } = require('electron')
const DataStore = require('../DataStore') 


class ToDoList {
  constructor(type){
    this.validateType(type)
    this.type = type // options: 'main' 'secondary' 'dumpster'
    this.store = new DataStore({ name: type})
    this.tag = document.querySelector(`#list_${type}`)
    this.input = document.querySelector(`#input_${type}`)
    this.submit = document.querySelector(`#submit_${type}`)

    this.validateTags()
    this.clickHandlerOnSubmit()
  }

  validateType(type){
    if(type === 'main' || type === 'secondary' || type === 'dumpster'){
      return
    } else {
      throw new Error("invalid type for todolist, can't initialise class like this")
    }
  }

  validateTags(){
    if(this.tag && this.input && this.submit){ return }
    else {
      throw new Error("invalid tags, can't initialise class like this")
    }
  }

  render(){
    this.tag.innerHTML = ""
    this.store.todos.map(x => this.tag.innerHTML = `<li class="todo-item">${x}</li>` + this.tag.innerHTML)
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
    this.submit.addEventListener('click',() => {
      ipcRenderer.send('TodoSubmited', this.type)
    })
  }

  handleSubmit(){
    this.addToDo(this.input.value)
    this.input.value = ""
  }

  addToDo(todo){
    this.store.addTodo(todo)
    this.render()
  }

  deleteToDo(todo){
    this.store.deleteTodo(todo)
    this.render()
  }
  deleteList(){
    this.store.deleteAll()
    this.render()
  }

}
module.exports = ToDoList
