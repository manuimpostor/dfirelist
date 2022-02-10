import "./stylesheets/main.css";

// Everything below is just a demo. You can delete all of it.

import { ipcRenderer } from "electron";
import jetpack from "fs-jetpack";
import { greet } from "./hello_world/hello_world";
import { togglePlay } from "./timer/timer"
//import env from "env";

document.querySelector("#greet").innerHTML = greet();
document.querySelector("#playstopbtn").addEventListener('click',() => {togglePlay()})
document.querySelector("#playstate").innerHTML = "playing";

const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

// We can communicate with main process through messages.
ipcRenderer.on("app-path", (event, appDirPath) => {
  // Holy crap! This is browser window with HTML and stuff, but I can read
  // files from disk like it's node.js! Welcome to Electron world :)
  const appDir = jetpack.cwd(appDirPath);
  const manifest = appDir.read("package.json", "json");
  document.querySelector("#author").innerHTML = manifest.author;
});
ipcRenderer.send("need-app-path");

document.querySelector(".electron-website-link").addEventListener(
  "click",
  event => {
    ipcRenderer.send("open-external-link", event.target.href);
    event.preventDefault();
  },
  false
);
