import "./stylesheets/main.css";
import { ipcRenderer } from "electron";
import jetpack from "fs-jetpack";
const Timer = require('./timer/timer')
const ToDoList = require('./todo/todolist') 
//import env from "env";


const timer = new Timer('focus')

// TIMER CONTROLS
document.querySelector("#modeId").innerHTML = timer.mode
document.querySelector("#startBtnId").addEventListener('click',() => {timer.startTimer()})
document.querySelector("#stopBtnId").addEventListener('click',() => {timer.stopTimer()})

// BURN LIST
document.querySelector("#burnBtnId").addEventListener('click',() => {
  timer.stopTimer()
  mainList.deleteList()
  secList.deleteList()
})

// IPC MESSAGES
// We can communicate with main process through messages.
ipcRenderer.on("StartBreakTimer", () => {
  timer.startBreakTimer()
  document.querySelector("#modeId").innerHTML = timer.mode
})
ipcRenderer.on("StartFocusTimer", () => {
  timer.startFocusTimer()
  document.querySelector("#modeId").innerHTML = timer.mode
})

// STORAGE
const secList = new ToDoList('secondary')
const mainList = new ToDoList('main')
// const dumpList = new ToDoList('dumpster')
// seems like I can initialise three lists, three electron-store instances too much
mainList.render()
secList.render()
// dumpList.render()

// CONTROL FUNCTIONS FOR THE THREE LISTS OF TASKS
ipcRenderer.on("AddTodo", (event, list) => {
  switch(list){
    case 'main':
      mainList.handleSubmit()
      break
    case 'secondary':
      secList.handleSubmit()
      break
    case 'dumpster':
      dumpList.handleSubmit()
      break
    default:
      console.log("no match for list, need to see: 'main', 'secondary' or 'dumpster'")
  }
})

ipcRenderer.on("DeleteTodo", (event, todo, list) => {
  switch(list){
    case 'main':
      mainList.deleteToDo(todo)
      break
    case 'secondary':
      secList.deleteToDo(todo)
      break
    case 'dumpster':
      dumpList.deleteToDo(todo)
      break
    default:
      console.log("no match for list, need to see: 'main', 'secondary' or 'dumpster'")
  }
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
