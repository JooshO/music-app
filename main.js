// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
var electronify = require("electronify-server");

electronify({
  command: "node",
  args: ["server.js"],
  options: {
    cwd: "./music-app-win32-x64/resources/app",
  },
  url: "http://localhost:8080",
  debug: true,
  window: {
    height: 768,
    width: 1024,
    "title-bar-style": "default",
    frame: true,
  },
  ready: function (app) {
    // application event listeners could be added here
    console.log(process.cwd());
  },
  preLoad: function (app, window) {
    // window event listeners could be added here
  },
  postLoad: function (app, window, error) {
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
  })
  .on("child-error", function (err, app) {
    // close electron if the child crashes
    console.log(err);

    // app.quit();
    // throw err;
  });

// function createWindow() {
//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"),
//     },
//   });

//   // and load the index.html of the app.
//   mainWindow.loadFile("index.html");

//   // Open the DevTools.
//   // mainWindow.webContents.openDevTools()
// }

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.whenReady().then(() => {
//   createWindow();

//   app.on("activate", function () {
//     // On macOS it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// // Quit when all windows are closed, except on macOS. There, it's common
// // for applications and their menu bar to stay active until the user quits
// // explicitly with Cmd + Q.
// app.on("window-all-closed", function () {
//   if (process.platform !== "darwin") app.quit();
// });

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and require them here.
