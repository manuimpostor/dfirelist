import "./stylesheets/main.css";

// Everything below is just a demo. You can delete all of it.

import { ipcRenderer } from "electron";
import jetpack from "fs-jetpack";
const Timer = require('./timer/timer')
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

// -------
const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

// Example for messages
ipcRenderer.on("app-path", (event, appDirPath) => {
  // Holy crap! This is browser window with HTML and stuff, but I can read
  // files from disk like it's node.js! Welcome to Electron world :)
  const appDir = jetpack.cwd(appDirPath);
  const manifest = appDir.read("package.json", "json");
  // document.querySelector("#author").innerHTML = manifest.author;
});
ipcRenderer.send("need-app-path");

// document.querySelector(".electron-website-link").addEventListener(
//   "click",
//   event => {
//     ipcRenderer.send("open-external-link", event.target.href);
//     event.preventDefault();
//   },
//   false
// );
