const Store = require('electron-store')
const { DateTime } = require('luxon')

class DataStore extends Store {
  constructor(settings) {
    super(settings)
    // console.log(this.path) to see where .json is stored
    // init with lists or empty arrays
    this.title = this.get('title') || ""
    this.todos = this.get('todos') || []
    this.created_at = this.get('created_at') || DateTime.now()
    this.sessions = this.get('sessions') || 0
  }

  saveTodos(){
    this.set('todos', this.todos)
    //allows method chaining
    return this
  }

  getTodos(){
    this.todos = this.get('todos') || []
    return this
  }

  addTodo(todo){
    this.todos = [...this.todos, todo ]
    return this.saveTodos()
  }

  deleteTodo(todo){
    this.todos = this.todos.filter(t => t !== todo)
    return this.saveTodos()
  }

  deleteAll(){
    this.todos = []
    this.created_at = DateTime.now()
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
}

module.exports = DataStore
