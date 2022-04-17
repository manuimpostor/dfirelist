const Store = require('electron-store')
class DataStore extends Store {
  constructor(settings) {
    super(settings)
    // console.log(this.path) to see where .json is stored
    // "/Users/:username/Library/Preferences/electron-store-nodejs/main.json" on mac
    this.title = this.get('title') || ""
    this.todos = this.get('todos') || []
    this.completed = this.get('completed') || []
    this.created_at = this.get('created_at') || parseInt(Date.now())
    this.saveCreatedAt()
    this.sessions = this.get('sessions') || 0
  }

  saveTodos(){
    this.set('todos', this.todos)
    this.set('completed', this.completed)
    return this
  }

  getTodos(){
    this.todos = this.get('todos') || []
    return this
  }

  addTodo(todo){
    // TODO: Add limit here
    this.todos = [...this.todos, todo ]
    return this.saveTodos()
  }

  deleteOrComplete(todo){
    if(this.completed.includes(todo)){
      this.deleteTodo(todo)
    } else {
      this.completeTodo(todo)
    }
  }


  // TODO for https://github.com/manuimpostor/dfirelist/issues/2
  completeTodo(todo){
    this.todos = this.todos.filter(t => t !== todo)
    this.completed = [...this.completed, todo ]
    return this.saveTodos()
  }

  deleteTodo(todo){
    this.todos = this.todos.filter(t => t !== todo)
    this.completed = this.completed.filter(t => t !== todo)
    return this.saveTodos()
  }

  deleteAll(){
    this.todos = []
    this.completed = []
    this.created_at = parseInt(Date.now())
    this.sessions = 0
    this.set('sessions', this.sessions)
    this.set('created_at', this.created_at)
    return this.saveTodos()
  }

  incSessions(){
    this.sessions = this.sessions + 1
    this.set('sessions', this.sessions)
  }

  setTitle(title){
    this.title = title
    this.set('title', this.title)
  }

  saveCreatedAt(){
    this.set('created_at', this.created_at)
  }

  getCreatedAt(){
    return this.get('created_at')
  }
}

module.exports = DataStore
