const { ipcRenderer } = require('electron')
const DataStore = require('../DataStore') 
const { Interval, DateTime } = require('luxon')


class ToDoList {
  constructor(type){
    this.validateType(type)
    this.type = type // options: 'main' 'secondary' 'dumpster'
    this.store = new DataStore({ name: type})
    this.tag = document.querySelector(`#list_${type}`)
    this.input = document.querySelector(`#input_${type}`)
    this.submit = document.querySelector(`#submit_${type}`)
    this.titleTag = document.querySelector(`#title_${type}`)

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
    if(this.tag && this.input && this.submit && this.titleTag){ return }
    else {
      throw new Error("invalid tags, can't initialise class like this")
    }
  }

  render(){
    this.tag.innerHTML = ""
    this.store.todos.map(x => this.tag.innerHTML = `<li class="todo-item">${x}</li>` + this.tag.innerHTML)
    this.clickHandlerOnItems()
  }

  setTitle(title){
    this.store.setTitle(title)
  }

  renderTitle(){
    if(this.store.title === 'secondary'){
      this.titleTag.innerHTML = "Dumpster Fire"
    } else {
      this.titleTag.innerHTML = this.store.title
    }
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
      ipcRenderer.send('TodoSubmitted', this.type)
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

  getAge(){
    let now = DateTime.now()
    var i = Interval.fromDateTimes(this.store.created_at, now)
    const m = Math.floor(i.length('minutes'))
    const h = Math.floor(i.length('hours'))
    const d = Math.floor(i.length('days'))
    const age = `${d} days : ${h} hours : ${m} mins`
    return age
  }

  //add 1 to sess count on store
  incSessions(){
    this.store.incSessions()
  }

  getSessions(){
    console.log(this.store)

    return this.store.sessions
  }
}
module.exports = ToDoList
