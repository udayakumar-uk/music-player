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
const songChange = $(".songchange-btn");
const nextSong = $(".next-song");
const prevSong = $(".prev-song");
const speaker = $("#speaker");
const volumeControl = $("#volume_slider");
const control = $("#control");
const queues = $(".song-queue");
var songList = [];
var blobURL = '';
var aboveOneSongs = false;

// const fullscreen = player.querySelector(".toggleFullscreen");

$(video).dblclick(function(){
  toggleFullscreen();
})

// Create fullscreen video button
function toggleFullscreen() {
  if (!document.webkitFullscreenElement) {
   if (video.requestFullScreen) {
    player[0].requestFullScreen();
   } else if (video.webkitRequestFullScreen) {
    player[0].webkitRequestFullScreen();
   } else if (video.mozRequestFullScreen) {
    player[0].mozRequestFullScreen();
   }
  } else {
   document.webkitExitFullscreen();
  }
 }


// if(window.innerWidth < 767){
  
//   $('#myVideoPlayer').after($('.center-controls'));
// }

$(playBtn).on('click', function(){
  if(video.paused) {
        video?.play();
        playBtn.html('<img src="./img/pause.svg" class="material-symbols-rounded">');
      playBtn.attr("title", "Pause");
  } else {
        video.pause();
        playBtn.html('<img src="./img/play.svg" class="material-symbols-rounded">');
      playBtn.attr("title", "Play");
    }
});

$('#toggleEq').on('click', function(){
  $(this).toggleClass('active');
  $('.myEqualizer').toggle();
});

$('#toggleQueue').on('click', function(){
  $(this).toggleClass('active');
  $('#mediaList').toggle();
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

function createSource(files,  index){
  if(!files){
    $('#mediaList').hide()
    return
  } 
  var mediaUrl = URL.createObjectURL(files);
  blobURL = mediaUrl;
  
  if(songList[0].length > 1){
    $('#songCounts').text((index + 1) + ' / ' + songList[0].length);
  }else{
    $('#songCounts').text('')
  }

  $('#myVideoPlayer').attr('src', mediaUrl);
  $('#myVideoPlayer').attr('index', index);
  $('#videoCaption').text(files.name); 
  
  playBtn.click();
  playBtn.html('<img src="./img/pause.svg" class="material-symbols-rounded">');
  playBtn.attr('title', 'Pause');
  videoDuration();
  $(progressBar).css("width", "0px");

}

function createQueue(){
  if(songList[0].length > 1){
    var list = `<ul class="p-0 m-0">`;
    var queueList = songList[0];
    for(var j=0; j < queueList.length; j++){
      list += '<li class="p-2 song-queue" title="'+queueList[j].name+'" data-index="'+j+'">' + '<img src="./img/music.svg" class="material-symbols-rounded"> '+ queueList[j].name+'</li>'
    }
    list += `</ul>`;
    $('#mediaList').html(list);
    $('#toggleQueue').show();
    $('.song-queue[data-index="0"]').addClass('playing');
    $('.song-queue[data-index="0"]').find('img').attr('src', './img/playing.svg');
    
    $('.song-queue').click(function(){
      $('.song-queue').removeClass('playing');
      $('.song-queue').find('img').attr('src', './img/music.svg');
      $(this).addClass('playing');
      $(this).find('img').attr('src', './img/playing.svg');
      var getIndex = $(this).attr('data-index');
      createSource(songList[0][getIndex], +(getIndex));
    });

  }else{
    $('#toggleQueue').hide();
  }
}


songChange.click(function(){
  var getAttr = $(this).attr('data-change');
  var getIndex = +($('#myVideoPlayer').attr('index'));
  var setIndex = 0;
  var songs = songList[0];
  // next
  if(getAttr == 1){
    if((songs.length - 1) > getIndex){
      setIndex = getIndex + 1;
      createSource(songs[setIndex], setIndex);
      $(prevSong).removeAttr('disabled');
      if(!songs[setIndex + 1]){
        $(nextSong).attr('disabled', 'disabled');
      }
    }
  }else{
    if(songs.length > getIndex && getIndex != 0){
      setIndex = getIndex - 1;
      createSource(songs[setIndex], setIndex);
      $(nextSong).removeAttr('disabled');
      if(!songs[setIndex - 1]){
        $(prevSong).attr('disabled', 'disabled');
      }
    }
  }
  
  $('.song-queue').find('img').attr('src', './img/music.svg');
  $('.song-queue').removeClass('playing');
  $('.song-queue[data-index="'+setIndex+'"]').find('img').attr('src', './img/playing.svg');
  $('.song-queue[data-index="'+setIndex+'"]').addClass('playing');
});

video.addEventListener("ended", function(e) {
  setTimeout(function(){
    $(nextSong).click();
  }, 1000)
});

myFileAuVi.addEventListener( 'input', function (e) {
  // myFileAuVi.value = "";
  if (!this.files) return;
  songList = [];
  songList.push(this.files);
  console.log(songList);  

  aboveOneSongs = songList[0].length > 1;
  
  if(aboveOneSongs){
    songChange.removeClass('d-none')
  }else{
    songChange.addClass('d-none')
  }

  if(songList[0].length < 2){
    $('#mediaList').hide()
  }

  createSource(songList[0][0], 0);
  createQueue();

}, false);


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
