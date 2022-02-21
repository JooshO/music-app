// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var count = 0;

var player = [];
var audioMap = new Map();

function resetAll() {
  var container = document.getElementById("audio-container");
  container.textContent = "";
  player = [];
  audioMap = new Map();
  count = 0;
}

function getAudioMap() {
  console.log($("#audio-container").sortable("toArray").toString());
  return audioMap;
}

function getOrder() {
  var order = $("#audio-container").sortable("toArray");
  var list = [];
  order.forEach((str) => {
    list.push(str.slice(-1));
  });

  return list;
}

function addVideo(url, nick, c = "#a52a2a") {
  var curCount = count;
  var data = url.split("=")[1];

  if (data === "undefined") return;

  const video = {
    color: c,
    nickname: nick,
  };
  audioMap.set(data, video);

  var container = document.getElementById("audio-container");
  var node = document.createElement("div");
  node.classList.add("audio-button");
  node.id = "youtube-audio" + count;
  container.appendChild(node);
  var ctrlq1 = document.getElementById("youtube-audio" + count);
  ctrlq1.innerHTML =
    '<div id="yt-button' +
    curCount +
    '" class="yt-button"></div><div id="youtube-player' +
    count +
    '"></div><div class="nickname-holder"><input type="text" id="nickname' +
    curCount +
    '" name="nickname' +
    curCount +
    '" placeholder="nickname"> </div>';

  var button = document.getElementById("yt-button" + curCount);
  button.style.backgroundColor = c;

  button.innerHTML =
    "<div class='pause-button vid-button' id='pause" +
    curCount +
    "'> <i class='fi fi-rr-pause'></i> </div><div class='play-button vid-button' id='play" +
    curCount +
    "'> <i class='fi fi-rr-play'></i> </div><div class='rest-button vid-button' id='reset" +
    curCount +
    "'> <i class='fi fi-rr-refresh'></i> </div><div class='picker'><input type='color' class='color-picker' id='colorpick" +
    curCount +
    "' value='" +
    c +
    "'> </div>";

  colorPicker = document.getElementById("colorpick" + curCount);
  colorPicker.addEventListener("input", function () {
    co = document.getElementById("colorpick" + curCount);
    document.getElementById("yt-button" + curCount).style.backgroundColor =
      co.value;
  });

  colorPicker.addEventListener("change", function () {
    co = document.getElementById("colorpick" + curCount);
    console.log("Changing color to " + co.value);
    audioMap.get(data).color = co.value;
    document.getElementById("yt-button" + curCount).style.backgroundColor =
      co.value;
  });

  document
    .getElementById("pause" + curCount)
    .addEventListener("click", function () {
      if (
        player.at(curCount).getPlayerState() == 1 ||
        player.at(curCount).getPlayerState() == 3
      ) {
        player.at(curCount).pauseVideo();
        togglePlayButton(false, curCount);
      }
    });

  document
    .getElementById("play" + curCount)
    .addEventListener("click", function () {
      if (
        player.at(curCount).getPlayerState() !== 1 &&
        player.at(curCount).getPlayerState() !== 3
      ) {
        for (let i = 0; i < player.length; i++) {
          if (i == curCount) continue;
          const video = player[i];
          video.seekTo(0, true);
          video.pauseVideo();
          togglePlayButton(false, i);
        }

        player.at(curCount).playVideo();
        togglePlayButton(true, curCount);
      } else {
        console.log(
          "Can't play, current state is " + player.at(curCount).getPlayerState()
        );
      }
    });

  document
    .getElementById("reset" + curCount)
    .addEventListener("click", function () {
      player.at(curCount).seekTo(0, true);
    });

  nickname = document.getElementById("nickname" + curCount);
  nickname.value = nick;
  nickname.addEventListener("input", function () {
    audioMap.get(data).nickname = nickname.value;
  });

  player.push(
    new YT.Player("youtube-player" + count, {
      height: "0",
      width: "0",
      videoId: data,
      playerVars: {
        autoplay: 0,
        loop: 1,
        playlist: data, // this is necesary for looping a single video properly
      },
      host: "https://www.youtube-nocookie.com",
      showInfo: false,
      origin: "file://",
      events: {
        onReady: function () {
          onPlayerReady(null, curCount);
        },
        onStateChange: function () {
          onPlayerStateChange(curCount);
        },
      },
    })
  );
  count++;
}

function togglePlayButton(play, target) {
  var targetID = "yt-button" + target;
  document.getElementById(targetID).classList.toggle("yt-button", !play);
  document.getElementById(targetID).classList.toggle("yt-button-pressed", play);
}

function toggleAudio(target) {
  if (
    player.at(target).getPlayerState() == 1 ||
    player.at(target).getPlayerState() == 3
  ) {
    player.at(target).pauseVideo();
    player.at(target).seekTo(0, true);
    togglePlayButton(false, target);
  } else {
    for (let i = 0; i < player.length; i++) {
      const video = player[i];
      video.pauseVideo();
      video.seekTo(0, true);
      togglePlayButton(false, i);
    }

    player.at(target).playVideo();
    togglePlayButton(true, target);
  }
}

function onPlayerReady(event, target) {
  player.at(target).setPlaybackQuality("small");
  togglePlayButton(false, target);
}

function onPlayerStateChange(event, target) {
  if (event.data === 0) {
    togglePlayButton(false, target);
  }
}

function clickPress(event) {
  if (event.keyCode == 13) {
    var input = document.getElementById("input");
    if (/.*www\.youtube\.com\/watch\?v=.*/gi.test(input.value)) {
      this.addVideo(input.value, "");
      input.value = "";
      input.setCustomValidity("");
      input.reportValidity();
      input.classList.remove("url-input:invalid");
    } else {
      console.log("Invalid string: " + input.value);
      input.setCustomValidity("Invalid string: " + input.value);
      input.reportValidity();
      input.classList.add("url-input:invalid");
    }
  }
}
