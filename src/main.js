// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, Menu, ipcMain, shell } from "electron";
import appMenuTemplate from "./menu/app_menu_template";
import editMenuTemplate from "./menu/edit_menu_template";
import devMenuTemplate from "./menu/dev_menu_template";
import createWindow from "./helpers/window";

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}

const setApplicationMenu = () => {
  const menus = [appMenuTemplate, editMenuTemplate];
  if (env.name !== "production") {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// We can communicate with our window (the renderer process) via messages.
const initIpc = () => {
  ipcMain.on("need-app-path", (event, arg) => {
    event.reply("app-path", app.getAppPath());
  });
  ipcMain.on("open-external-link", (event, href) => {
    shell.openExternal(href);
  });
};

app.on("ready", () => {
  setApplicationMenu();
  initIpc();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      // Two properties below are here for demo purposes, and are
      // security hazard. Make sure you know what you're doing
      // in your production app.
      nodeIntegration: true,
      contextIsolation: false,
      // Spectron needs access to remote module
      enableRemoteModule: env.name === "test"
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app.html"),
      protocol: "file:",
      slashes: true
    })
  );

  if (env.name === "development") {
    mainWindow.openDevTools();
  }
});

app.on("window-all-closed", () => {
  app.quit();
});

// IPC MSG TO COMMUNICATE WITH RENDERER (/src/app.js) ABOUT WHAT TO START
// Timer sends msg and main.js dispatches next action
ipcMain.on('FocusComplete', function (event) {
  event.sender.send('StartBreakTimer')
})
ipcMain.on('BreakComplete', function (event) {
  event.sender.send('StartFocusTimer')
})
// msgs for todos
ipcMain.on('TodoSubmited', (event, list) => {
  console.log('main knows todo was submitted')
  event.sender.send('AddTodo', list)
})
ipcMain.on('TodoDeleted', (event, todo, list) => {
  event.sender.send('DeleteTodo', todo, list)
})


// TODO: Take notification class from reference and call it here
// this will we called to the notification class which will display the message
// ipcMain.on('FiveSecondEarlyAlert', function (event, mode) {
//   if (mode === 'break') {
//     if (CurrentRound === UserRound) {
//       return
//     }
//   }
//   notification.AlertFiveSecondEarly({
//     title: 'Information',
//     mode: mode,
//     message: 'will start in 5 sec'
//   })
// })
