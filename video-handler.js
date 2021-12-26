// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var count = 1;

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player = [];
player.push(null);

//TODO: merge this and below function into one, perhaps one that calls the other
function onYouTubeIframeAPIReady() {
  var curCount = count;
  var ctrlq1 = document.getElementById("youtube-audio" + curCount);
  ctrlq1.innerHTML =
    '<div id="yt-button1" class="yt-button"></div><div id="youtube-player' +
    count +
    '"></div>';
  //   ctrlq1.style.cssText =
  //     "width:150px;margin:2em auto;cursor:pointer;cursor:hand;display:none";
  ctrlq1.addEventListener("click", function () {
    toggleAudio(curCount);
  });

  player.push(
    new YT.Player("youtube-player" + curCount, {
      height: "0",
      width: "0",
      videoId: ctrlq1.dataset.video,
      playerVars: {
        autoplay: ctrlq1.dataset.autoplay,
        loop: ctrlq1.dataset.loop,
      },
      events: {
        onReady: function () {
          onPlayerReady1(null, curCount);
        },
        onStateChange: function () {
          onPlayerStateChange1(curCount);
        },
      },
    })
  );
  count++;
}

function addVideo(url) {
  var curCount = count;
  var data = url.split("=")[1];
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
    '"></div>';
  //   ctrlq1.style.cssText =
  //     "width:150px;margin:2em auto;cursor:pointer;cursor:hand;display:none";
  ctrlq1.addEventListener("click", function () {
    toggleAudio(curCount);
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
          onPlayerReady1(null, curCount);
        },
        onStateChange: function () {
          onPlayerStateChange1(curCount);
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
    togglePlayButton(false, target);
  } else {
    for (let i = 1; i < player.length; i++) {
      const video = player[i];
      video.pauseVideo();
      togglePlayButton(false, i);
    }

    player.at(target).playVideo();
    togglePlayButton(true, target);
  }
}

function onPlayerReady1(event, target) {
  player.at(target).setPlaybackQuality("small");
  document.getElementById("youtube-audio1").style.display = "block";
  togglePlayButton(false, target);
}

function onPlayerStateChange1(event, target) {
  if (event.data === 0) {
    togglePlayButton(false, target);
  }
}

function clickPress(event) {
  if (event.keyCode == 13) {
    addVideo(document.getElementById("input").value);
  }
}
