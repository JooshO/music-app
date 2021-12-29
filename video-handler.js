// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var count = 0;

var player = [];
var audioList = [];
var audioMap = new Map();

function getAudioList() {
  return audioList;
}

function getAudioMap() {
  console.log("Audio Map on call: " + audioMap);
  return audioMap;
}

function addVideo(url, nick) {
  var curCount = count;
  var data = url.split("=")[1];

  if (data === "undefined") return;

  audioList.push([nick, data]);
  audioMap.set(data, nick);
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

  document
    .getElementById("yt-button" + curCount)
    .addEventListener("click", function () {
      toggleAudio(curCount);
    });

  nickname = document.getElementById("nickname" + curCount);
  nickname.value = nick;
  nickname.addEventListener("input", function () {
    audioMap.set(data, nickname.value);
  });

  player.push(
    new YT.Player("youtube-player" + count, {
      height: "0",
      width: "0",
      videoId: data,
      playerVars: {
        autoplay: 0,
        loop: 1,
      },
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
  console.log("Play toString: " + play + " Target: " + target);
  document.getElementById(targetID).classList.toggle("yt-button", !play);

  document.getElementById(targetID).classList.toggle("yt-button-pressed", play);
}

function toggleAudio(target) {
  console.log(
    "Toggling audio at " +
      target +
      ", player state is " +
      player.at(target).getPlayerState()
  );
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
