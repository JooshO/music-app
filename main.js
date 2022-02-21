// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog, session } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

const http = require("http");
const fs = require("fs");

//at start
let server;
server = http
  .createServer((req, res) => {
    const filePath = path.join(app.getAppPath(), req.url);
    const file = fs.readFileSync(filePath);
    res.end(file.toString());
    if (req.url.includes("index.js")) server.close();
  })
  .listen(8080);

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 768,
    width: 1024,
    "title-bar-style": "default",
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  //mainWindow.loadFile("index.html");

  mainWindow.loadURL("http://localhost:8080/index.html");
}

app.whenReady().then(() => {
  createWindow();
  ipcMain.on("restart_app", () => {
    autoUpdater.quitAndInstall();
  });

  // application event listeners could be added here
  console.log(process.cwd());
  app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
  });

  ipcMain.on("selectFileToSave", (event) => {
    dialog
      .showOpenDialog({
        properties: ["openFile", "promptToCreate"],
        title: "Select audio list file",
        filters: [{ name: "Overbeek Audio File", extensions: ["oaf"] }],
      })
      .then((result) => {
        console.log(result.canceled);
        console.log(result.filePaths);
        if (!result.canceled) {
          respondWithPath(result.filePaths, event);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("here");
  });

  ipcMain.on("selectFileToLoad", (event) => {
    dialog
      .showOpenDialog({
        properties: ["openFile"],
        title: "Select audio list file",
        filters: [{ name: "Overbeek Audio File", extensions: ["oaf"] }],
      })
      .then((result) => {
        console.log(result.canceled);
        console.log(result.filePaths);
        if (!result.canceled) {
          respondWithPathLoad(result.filePaths, event);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("here");
  });

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("post-load", function () {
  window.once("ready-to-show", () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  autoUpdater.on("update-available", () => {
    window.webContents.send("update_available");
  });
  autoUpdater.on("update-downloaded", () => {
    window.webContents.send("update_downloaded");
  });
  // Error only exists if there was an error while loading
  // error == {
  //   event: event,
  //   errorCode: errorCode,
  //   errorDescription: errorDescription,
  //   validatedURL: validatedURL,
  //   isMainFrame: isMainFrame
  // }
  if (error) {
    console.log(error.errorCode, error.errorDescription, error.validatedURL);
  }
  io.loadConfig();
});

app.on("quit", function () {
  // io.saveConfig();
});

function respondWithPath(paths, event) {
  console.log("Trying to send " + paths + " to " + event.sender);
  event.sender.send("savepath", paths);
}

function respondWithPathLoad(paths, event) {
  console.log("Trying to send " + paths + " to " + event.sender);
  event.sender.send("loadpath", paths);
}
