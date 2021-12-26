let fs = require("fs");
const { isObject } = require("util");
let filename = "config";

exports.loadConfig = () => {
  //Check if file exists
  if (fs.existsSync(filename)) {
    let data = fs.readFileSync(filename, "utf8").split("\n");

    data.forEach((audio, index) => {
      let [nick, data] = audio.split(",");
      addVideo("v=" + data, nick);
    });
  } else {
    console.log("File Doesn't Exist. Creating new file.");
    fs.writeFile(filename, "", (err) => {
      if (err) console.log(err);
    });
  }
};
exports.saveConfig = (data) => {
  data.forEach((element) => {
    fs.appendFile(element[0] + "," + element[1] + "\n");
  });
};
