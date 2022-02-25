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

// TODO: not just set the title but also hide the input fields afterwards
// on initial render, make sure that input field only rendered if no prior main fire title was set
ipcRenderer.on("AddMainFire", () => {
  mainList.setTitle(focusFireInput.value)
  mainList.renderTitle()
  renderTitleInput()
})

mainList.renderTitle()
renderTitleInput()

function renderTitleInput(){
  if(mainList.store.title === 'Main Fire'){
    focusFireSubmit.style.display = 'inline'
    focusFireInput.style.display = 'inline'
    focusFireInput.value = ''
  } else {
    focusFireSubmit.style.display = 'none'
    focusFireInput.style.display = 'none'
    focusFireInput.value = ''
  }
}
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
  mainList.setTitle("Main Fire")
  mainList.renderTitle()
  renderTitleInput()
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
