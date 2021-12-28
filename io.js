let fs = require("fs");
let filename = "config";

function loadConfig() {
  var output = [];

  //Check if file exists
  if (fs.existsSync(filename)) {
    let data = fs.readFileSync(filename, "utf8").split("\n");

    console.log("IO :: loadConfig :: loaded: " + data);
    data.forEach((audio) => {
      let [nick, url] = audio.split(",");
      console.log("IO :: loadConfig :: url: " + url);
      output.push(["v=" + url, nick]);
    });
  } else {
    console.log("File Doesn't Exist. Creating new file.");
    fs.writeFile(filename, "", (err) => {
      if (err) console.log(err);
    });
  }

  console.log("IO :: loadConfig :: output: " + output);
  return output;
}

function saveConfig(data = []) {
  console.log("SAVE CONFIG :: Entering");
  console.log("SAVE CONFIG :: data= " + data);
  data.forEach((element) => {
    console.log("SAVE CONFIG :: ELEMENT 0 = " + element[0]);
    fs.appendFile(filename, element[0] + "," + element[1] + "\n", (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
}
