// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const path = require("path");
const { dialog, ipcRenderer } = require("electron");

const notification = document.getElementById("notification");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart-button");
ipcRenderer.on("update_available", () => {
  ipcRenderer.removeAllListeners("update_available");
  message.innerText = "A new update is available. Downloading now...";
  notification.classList.remove("hidden");
});
ipcRenderer.on("update_downloaded", () => {
  ipcRenderer.removeAllListeners("update_downloaded");
  message.innerText =
    "Update Downloaded. It will be installed on restart. Restart now?";
  restartButton.classList.remove("hidden");
  notification.classList.remove("hidden");
});

function closeNotification() {
  notification.classList.add("hidden");
}
function restartApp() {
  ipcRenderer.send("restart_app");
}

var save = document.getElementById("save-button");
console.log("SCRIPT: renderer :: just assigned save, save is " + save);
save.addEventListener("click", function () {
  ipcRenderer.send("selectFileToSave");
});

var load = document.getElementById("load-button");
load.addEventListener("click", function () {
  ipcRenderer.send("selectFileToLoad");
});

ipcRenderer.on("savepath", (event, data) => {
  console.log("Returned Path: " + data);
  console.log("SCRIPT: renderer :: click for save-button\n");
  saveConfig(data[0], getAudioMap());
});

ipcRenderer.on("loadpath", (event, data) => {
  output = loadConfig(data[0]);
  resetAll();
  output.forEach((element) => {
    console.log("SCRIPT: renderer :: trying to add  " + element);
    addVideo(element[0], element[1], element[2]);
  });
});
