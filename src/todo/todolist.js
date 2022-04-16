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
      throw new Error(`invalid tags, can't initialise class like this: ${this.tag},${this.input},${this.titleTag}`)
    }
  }

  render(){
    this.tag.innerHTML = ""
    this.store.todos.map(x => this.tag.innerHTML = `<li class="todo-item">${x}</li>` + this.tag.innerHTML)
    this.store.completed.map(x => this.tag.innerHTML +=`<li class="todo-item completed">${x}</li>`)
    this.clickHandlerOnItems()
  }

  setTitle(title){
    this.store.setTitle(title)
  }

  renderTitle(){
    if(this.store.title === 'secondary'){
      this.titleTag.style.display = 'inline'
      this.titleTag.innerHTML = "Dumpster Fire"
    } else if (this.store.title === 'Main Fire') {
      this.titleTag.style.display = 'none'
    }
    else{
      this.titleTag.style.display = 'inline'
      this.titleTag.innerHTML = this.store.title
    }
  }

  // takes html collection, add event listeners, returns void
  clickHandlerOnItems(){
    const c = this.tag.children
    for(let i=0; i < c.length; i++ ){
      c[i].addEventListener('click', (e)=>{
        ipcRenderer.send('TodoClicked', e.target.textContent, this.type)
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

  deleteOrComplete(todo){
    this.store.deleteOrComplete(todo)
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
    let now = parseInt(Date.now())
    const created = this.store.getCreatedAt() 
    const m = Math.floor((now - created)/(60*1000)) // time elapsed in minutes
    const h = Math.floor((now - created)/(60*1000*60)) // time elapsed in hours
    const d = Math.floor((now - created)/(60*1000*60*24)) // time elapsed in days
    const age = `${d} days : ${h%24} hours : ${m%60} mins`
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
