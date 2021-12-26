// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
var electronify = require("electronify-server");
// const io = require("./io");

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

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
