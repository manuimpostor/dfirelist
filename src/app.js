import "./stylesheets/main.css";
import { ipcRenderer } from "electron";
import jetpack from "fs-jetpack";
const Timer = require('./timer/timer')
const DataStore = require('./DataStore') 
const ToDoList = require('./todo/todolist') 
//import env from "env";


const timer = new Timer('focus')

// TIMER CONTROLS
document.querySelector("#modeId").innerHTML = timer.mode
document.querySelector("#startBtnId").addEventListener('click',() => {timer.startTimer()})
document.querySelector("#stopBtnId").addEventListener('click',() => {timer.stopTimer()})

// IPC MESSAGES
// We can communicate with main process through messages.
ipcRenderer.on("StartBreakTimer", () => {
  timer.startBreakTimer()
  console.log("start break from app.js")
  document.querySelector("#modeId").innerHTML = timer.mode
})
ipcRenderer.on("StartFocusTimer", () => {
  timer.startFocusTimer()
  console.log("start focus from app.js")
  document.querySelector("#modeId").innerHTML = timer.mode
})

// STORAGE
const todosData = new DataStore({ name: 'Todos Main Fire'})
const secList = new ToDoList('secondary')
console.log(secList.store.todos)

// RENDER ALL TODOS FIRST TIME
todosData
  .addTodo('main super important task')

function clickHandlerOnItems(){
  document.querySelectorAll('.todo-item').forEach(i => {
    i.addEventListener('click', (e)=>{
      ipcRenderer.send('TodoDeleted', e.target.textContent)
    })
  })
}

function addListHtml(item, index, arr){
  document.querySelector("#mainList").innerHTML += `<li class="todo-item">${arr[index]}</li>`
}
todosData.todos.forEach(addListHtml)

// TODOs Controls
document.querySelector("#submitMainList").addEventListener('click',() => {
  ipcRenderer.send('TodoSubmited')
})

ipcRenderer.on("AddTodo", () => {
  const newToDo = document.querySelector("#inputMainList").value
  todosData.addTodo(newToDo)
  document.querySelector("#inputMainList").value = ""
  console.log(todosData.todos)
  document.querySelector("#mainList").innerHTML += `<li class="todo-item" >${newToDo}</li>`
  clickHandlerOnItems()
})

clickHandlerOnItems() // intial click handler setup

ipcRenderer.on("DeleteTodo", (event, todo) => {
  console.log("deleting, updated state:")
  const updatedToDos = todosData.deleteTodo(todo).todos
  console.log(todosData.todos)
  document.querySelector("#mainList").innerHTML = ""
  updatedToDos.forEach(addListHtml)
  clickHandlerOnItems()
})


// BOILERPALTE FOR EXMAPLES-------
const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

ipcRenderer.on("app-path", (event, appDirPath) => {
  // Holy crap! This is browser window with HTML and stuff, but I can read
  // files from disk like it's node.js! Welcome to Electron world :)
  const appDir = jetpack.cwd(appDirPath);
  const manifest = appDir.read("package.json", "json");
  // document.querySelector("#author").innerHTML = manifest.author;
});
ipcRenderer.send("need-app-path");
