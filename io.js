let fs = require("fs");

function loadConfig(path) {
  var output = [];

  //Check if file exists
  if (fs.existsSync(path)) {
    let data = fs.readFileSync(path, "utf8").split("\n");

    console.log("IO :: loadConfig :: loaded: " + data);
    data.forEach((audio) => {
      let [nick, url] = audio.split(",");
      console.log("IO :: loadConfig :: url: " + url);
      output.push(["v=" + url, nick]);
    });
  } else {
    console.log("File Doesn't Exist. Creating new file.");
    fs.writeFile(path, "", (err) => {
      if (err) console.log(err);
    });
  }

  console.log("IO :: loadConfig :: output: " + output);
  return output;
}

function saveConfig(path, data = []) {
  console.log("SAVE CONFIG :: Entering");
  console.log("SAVE CONFIG :: data= " + data);

  // empty the file
  fs.writeFile(path, "", (err) => {
    if (err) {
      console.log(err);
    }
  });

  // write new data
  data.forEach((element) => {
    console.log("SAVE CONFIG :: ELEMENT 0 = " + element[0]);
    fs.appendFile(path, element[0] + "," + element[1] + "\n", (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
}
