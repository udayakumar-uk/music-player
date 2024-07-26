/*target elements*/
const video = $(".myVideo")[0];
const player = $(".mediaPlayer");
const myFileAuVi = $("#myFileInput")[0];
const progressRange = $(".progress-range")[0];
const progressBar = $(".progress-bar");
const currentTime = $(".time-elapsed");
const duration = $(".time-duration");
const playBtn = $("#play-btn");
const skipButtons = $(".skip-btn");
const speaker = $("#speaker");
const volumeControl = $("#volume_slider");
const control = $("#control");

// if (window.innerWidth < 767) {
//   $("#myVideoPlayer").after($(".center-controls"));
// }


$(playBtn).on("click", function () {
  if($(video).attr('src')){
    if (video.paused) {
      video?.play();
      playBtn.html('<img src="./img/pause.svg" class="material-symbols-rounded">');
      playBtn.attr("title", "Pause");
    } else {
      video.pause();
      playBtn.html('<img src="./img/play.svg" class="material-symbols-rounded">');
      playBtn.attr("title", "Play");
    }
  }
});



$("#toggleEq").on("click", function () {
  $(this).toggleClass("active");
  $(".myEqualizer").toggle();
});

$(video).click(function () {
  playBtn.click();
});

$(document, video).on("keyup", function (event) {
  if (event.keyCode === 32) {
    playBtn.click();
  } else if (event.keyCode === 39) {
    skipVideo("10");
  } else if (event.keyCode === 37) {
    skipVideo("-10");
  } else if (event.keyCode === 38) {
    volume(0.1, true);
  } else if (event.keyCode === 40) {
    volume(-0.1, true);
  }
});

$(speaker).on("click", function () {
  if (window.innerWidth > 767) {
    if (video["volume"] != 0) {
      volume(0);
      speaker.html(
        '<img src="./img/volume_off.svg" class="material-symbols-rounded">'
      );
    } else {
      volume(0.5);
      speaker.html(
        '<img src="./img/volume_up.svg" class="material-symbols-rounded">'
      );
    }
  } else {
    $(this).toggleClass("active");
  }
});

function volume(val, bool) {
  var setVol = video["volume"];
  var setVolSouund = volumeControl[0].value;

  if (bool && setVol + val >= 0 && setVol + val <= 1) {
    video["volume"] = setVol + val;
    volumeControl[0].value = setVolSouund + val;
  }

  if (!bool) {
    video["volume"] = val;
    $(volumeControl).val(val);
  }
}

// volume functions
$(volumeControl).on("change, mousemove", function () {
  video[this.name] = this.value;
  if (video["volume"] === 0) {
    speaker.html(
      '<img src="./img/volume_off.svg" class="material-symbols-rounded">'
    );
  } else {
    speaker.html(
      '<img src="./img/volume_up.svg" class="material-symbols-rounded">'
    );
  }
});

$("#control").on("click", function (e) {
  $(this).parent().parent().toggleClass("showControls");
  $(this).toggleClass("active");
});

$(skipButtons).on("click", function () {
  var getVal = $(this).attr("data-skip");
  skipVideo(getVal);
});

function skipVideo(value) {
  video.currentTime += +value;
}

$(video).on("timeupdate", function () {
  $(progressBar).css("width", (video.currentTime / video.duration) * 100 + "%");
  $(currentTime).text(displayTime(video.currentTime));
});

myFileAuVi.addEventListener(
  "input",
  function (e) {
    var file = myFileAuVi.files && myFileAuVi.files[(0, 0)];
    myFileAuVi.value = "";
    if (!file) return;
    var mediaUrl = URL.createObjectURL(file);
    $("#myVideoPlayer").attr("src", mediaUrl);
    $("#videoCaption").text(file.name);

    videoDuration();
    $(progressBar).css("width", "0px");
    playBtn.html('<img src="./img/play.svg" class="material-symbols-rounded">');
    playBtn.attr("title", "Play");
  },
  false
);

// videoDuration();

function videoDuration() {
  setTimeout(function () {
    $(duration).text(displayTime(video.duration));
  }, 500);
}

// Calculate display time format
function displayTime(time) {
  if (time) {
    let hour = Math.floor(Math.floor(time / 60) / 60);
    let minutes = Math.floor((time / 60) % 60);
    let seconds = Math.floor(time % 60);

    minutes = minutes > 9 ? minutes : "0" + minutes;
    seconds = seconds > 9 ? seconds : "0" + seconds;

    if (hour >= 1) {
      return hour + ":" + minutes + ":" + seconds;
    }
    return minutes + ":" + seconds;
  }
}

// progressRange

$(progressRange).on("click", function (e) {
  const newTime = e.offsetX / progressRange.offsetWidth;
  $(progressBar).css("width", newTime * 100 + "%");
  video.currentTime = newTime * video.duration;
});
