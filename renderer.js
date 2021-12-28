// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const path = require("path");

var save = document.getElementById("save-button");
console.log("SCRIPT: renderer :: just assigned save, save is " + save);
save.addEventListener("click", function () {
  console.log("SCRIPT: renderer :: click for save-button\n");
  saveConfig(getAudioList());
});

var load = document.getElementById("load-button");
load.addEventListener("click", function () {
  output = loadConfig();
  output.forEach((element) => {
    console.log("SCRIPT: renderer :: trying to add  " + element);
    addVideo(element[0], element[1]);
  });
});
