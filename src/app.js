import "./stylesheets/main.css";
import { ipcRenderer } from "electron";
import jetpack from "fs-jetpack";
const Timer = require('./timer/timer')
const DataStore = require('./DataStore') 
//import env from "env";


const timer = new Timer('focus')

// CONTROLS
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

todosData
  .addTodo('main super important task')
  .addTodo('main second important task')
  .addTodo('main third important task')
  .addTodo('main fourth important task')
console.log("wowwwwwww ############################")
console.log(todosData.todos)
// render stored todos in html as list
document.querySelector("#mainFires").innerHTML = todosData.todos[0]
todosData.todos.forEach(addListItem)
function addListItem(item, index, arr){
  document.querySelector("#mainList").innerHTML += `<li>${arr[index]}</li>`
}

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
