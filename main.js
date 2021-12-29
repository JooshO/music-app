// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog, session } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
var electronify = require("electronify-server");

electronify({
  command: "node",
  args: ["server.js"],
  options: {
    cwd: "./resources/app",
  },
  url: "http://localhost:8080",
  debug: true,
  window: {
    height: 768,
    width: 1024,
    "title-bar-style": "default",
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  },
  ready: function (app) {
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
  },
  preLoad: function (app, window) {
    // window event listeners could be added here
  },
  postLoad: function (app, window, error) {
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
    // io.loadConfig();
    // url finished loading
  },
  showDevTools: false,
})
  .on("child-started", function (child) {
    // child process has started
    console.log("PID: " + child.pid);

    // setup logging on child process
    child.stdout.on("data", function (buffer) {
      console.log(buffer.toString());
    });
    child.stderr.on("data", function (buffer) {
      console.log(buffer.toString());
    });
  })
  .on("child-closed", function (app, stderr, stdout) {
    // the child process has finished
    app.quit();
  })
  .on("child-error", function (err, app) {
    // close electron if the child crashes
    console.log(err);

    app.quit();
    throw err;
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
