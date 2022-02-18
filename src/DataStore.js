const Store = require('electron-store')
const { DateTime } = require('luxon')

class DataStore extends Store {
  constructor(settings) {
    super(settings)
    console.log(this.path)
    // init with lists or empty arrays
    this.todos = this.get('todos') || []
    this.created_at = DateTime.now()
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
    return this.saveTodos()
  }
}

module.exports = DataStore
