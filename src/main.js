// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, Menu, ipcMain, shell, Notification } from "electron";
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

  const splash = createWindow("splash", {
    width: 700, 
    height: 500, 
    frame: false, 
    alwaysOnTop: true 
  });
  splash.loadURL(
    url.format({
      pathname: path.join(__dirname, "splash.html"),
      protocol: "file:",
      slashes: true
    })
  );
  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    show: false,
    webPreferences: {
      // Two properties below are here for demo purposes, and are
      // security hazard. Make sure you know what you're doing
      // in your production app.
      nodeIntegration: true,
      contextIsolation: false,
      // Spectron needs access to remote module
      enableRemoteModule: env.name === "test",
      icon: path.join(__dirname, "../resources/icon.icns")
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app.html"),
      protocol: "file:",
      slashes: true
    })
  );

  setTimeout(function () {
    splash.close();
    mainWindow.center();
    mainWindow.show();
  }, 10000);

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
// Do these things every minute the timer (based on the timer.js interval)
ipcMain.on('FullMinute', function (event) {
  event.sender.send('UpdateListAge')
})

// msgs for todos
ipcMain.on('TodoSubmitted', (event, list) => {
  event.sender.send('AddTodo', list)
})
ipcMain.on('TodoClicked', (event, todo, list) => {
  event.sender.send('DeleteOrCompleteTodo', todo, list)
})

ipcMain.on('MainFireSubmitted', (event) => {
  event.sender.send('AddMainFire')
})

// NOTIF STUFF
const break_noti = {
  title: 'Time for a break',
  body: 'Well done, breathe, stretch',
  silent: false,
  urgency: 'critical'
}

const focus_noti = {
  title: 'Time to focus again',
  body: 'Ready for 25min of focus?',
  silent: false,
  urgency: 'critical'
}
function customNotification(mode){
  if(mode === 'focus'){
    new Notification(break_noti).show()
  }
  else if (mode === 'break'){
    new Notification(focus_noti).show()
  }
  else {
    new Notification({title: "wow", body: "nonono"}).show()
  }
}

ipcMain.on('FiveSecondEarlyAlert', function (event, mode) {
  customNotification(mode)
})

