import "./stylesheets/main.css";
import { ipcRenderer } from "electron";
import jetpack from "fs-jetpack";
const Timer = require('./timer/timer')
const ToDoList = require('./todo/todolist') 
//import env from "env";


const timer = new Timer('focus')
// STORAGE
const secList = new ToDoList('secondary')
const mainList = new ToDoList('main')
// const dumpList = new ToDoList('dumpster')
// seems like I can initialise three lists, three electron-store instances too much
mainList.render()
secList.render()
// dumpList.render()


// TIMER CONTROLS
document.querySelector("#modeId").innerHTML = timer.mode
document.querySelector("#startBtnId").addEventListener('click',() => {timer.startTimer()})
document.querySelector("#stopBtnId").addEventListener('click',() => {timer.stopTimer()})

// SET FOCUS TITLE
let focusFireInput = document.querySelector("#input_title_main")
let focusFireSubmit = document.querySelector("#submit_title_main")
let focusFire = document.querySelector("#title_main")

ipcRenderer.on("AddMainFire", () => {
  focusFire.innerHTML = focusFireInput.value
  focusFireInput.value = ""
})

function clickHandlerOnMainFire() {
  focusFireSubmit.addEventListener('click',() => {
    ipcRenderer.send('MainFireSubmitted')
  })
}
clickHandlerOnMainFire()
// BURN LIST
document.querySelector("#burnBtnId").addEventListener('click',() => {
  timer.stopTimer()
  mainList.deleteList()
  secList.deleteList()
  document.querySelector("#listAge").innerHTML = mainList.getAge()
  document.querySelector("#listAgeInSessions").innerHTML = mainList.getSessions()
})
document.querySelector("#listAgeInSessions").innerHTML = mainList.getSessions()

// IPC MESSAGES
// We can communicate with main process through messages.
ipcRenderer.on("StartBreakTimer", () => {
  timer.startBreakTimer()
  document.querySelector("#modeId").innerHTML = timer.mode
  mainList.incSessions()
  document.querySelector("#listAgeInSessions").innerHTML = `${mainList.getSessions()}`
})
ipcRenderer.on("StartFocusTimer", () => {
  timer.startFocusTimer()
  document.querySelector("#modeId").innerHTML = timer.mode
})

document.querySelector("#listAge").innerHTML = mainList.getAge()
ipcRenderer.on("UpdateListAge", () => {
  document.querySelector("#listAge").innerHTML = mainList.getAge()
})
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


// TODO: Remove this MANUAL NOTIFICATION POP
function addNotiClick() {
  document.getElementById("noti").addEventListener('click',() => {
    ipcRenderer.send('FiveSecondEarlyAlert')
  })
}
addNotiClick()
function mainProcessPopNoti(){
    ipcRenderer.send('FiveSecondEarlyAlert')
}
// mainProcessPopNoti()

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
