const { Console } = require("console");
let fs = require("fs");

function loadConfig(path) {
  var output = [];

  //Check if file exists
  if (fs.existsSync(path)) {
    let data = fs.readFileSync(path, "utf8").split("\n");

    console.log("IO :: loadConfig :: loaded: " + data);
    data.forEach((audio) => {
      let [nick, url, color] = audio.split(",");
      console.log("IO :: loadConfig :: url: " + url);
      output.push(["v=" + url, nick, color]);
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

function saveConfig(path, data) {
  console.log("SAVE CONFIG :: Entering");
  console.log("SAVE CONFIG :: data= " + data);

  // empty the file
  fs.writeFile(path, "", (err) => {
    if (err) {
      console.log(err);
    }
  });

  var list = [];
  for (const [key, value] of data) {
    list.push([value.nickname, key, value.color]);
  }

  var order = getOrder();

  console.log(order);
  // write the data
  order.forEach((i) => {
    [nickname, key, color] = list.at(i);
    fs.appendFile(path, nickname + "," + key + "," + color + "\n", (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
}
