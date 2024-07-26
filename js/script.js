define("frequency-draw", ["require", "exports"], function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
});

define("equalizer", ["require", "exports"], function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var EqualizerFilter = /** @class */ (function () {
    function EqualizerFilter(frequencys) {
      this.frequencys = frequencys;
      this.count = frequencys.length;
      this.filters = new Array(this.count);
    }
    EqualizerFilter.prototype.init = function (ac) {
      var filter,
        i = 0;
      for (; i < this.count; i++) {
        filter = ac.createBiquadFilter();
        filter.type = "peaking";
        filter.frequency.value = this.frequencys[i];
        this.filters[i] = filter;
        if (this.filters[i - 1]) {
          this.filters[i - 1].connect(this.filters[i]);
        }
      }
    };
    Object.defineProperty(EqualizerFilter.prototype, "first", {
      get: function () {
        return this.filters[(0, 0)];
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(EqualizerFilter.prototype, "last", {
      get: function () {
        return this.filters[this.count - 1];
      },
      enumerable: true,
      configurable: true
    });
    return EqualizerFilter;
  })();
  exports.EqualizerFilter = EqualizerFilter;

  var Equalizer = /** @class */ (function () {
    function Equalizer() {
      this.presets = {
        Manual: {
          name: "Manual",
          values: [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        Rock: {
          name: "Rock",
          values: [8, 6, 3, -8, -12, -4, 3, 8, 10, 10, 7, 0, 0]
        },
        Live: {
          name: "Live",
          values: [8, -6, 0, 4, 8, 9, 9, 5, 3, 2, 1, 0, 0]
        },
        Treble: {
          name: "Treble",
          values: [8, -10, -11, -12, -6, 2, 8, 13, 13, 11, 14, 0, 0]
        },
        Bass: {
          name: "Bass",
          values: [8, 11, 7, 3, 0, 0, -6, -10, -10, -2, -2, 0, 0]
        },
        Classic: {
          name: "Classic",
          values: [8, 0, 7, -1, -7, -12, -8, 0, 10, 4, -5, 0, 0]
        },
        Theatre: {
          name: "Theatre",
          values: [11, 12, 2, 5, 0, -10, -9, -5, -1, 2, 4, 2, 6]
        },
        Dolby: {
          name: "Dolby",
          values: [15, 15, 2, 14, -5, -12, -10, -11, -13, -10, -5, -10, -6]
        }
      };
      // 100 200 400 600 1K 3K 6K 12K 14K 16K
      this.frequencys = [
        10,
        20,
        30,
        40,
        60,
        120,
        250,
        500,
        1000,
        2000,
        4000,
        8000,
        16000
      ];
      this.eqFilter = new EqualizerFilter(this.frequencys);
    }
    Equalizer.prototype.init = function (ac) {
      this.eqFilter.init(ac);
    };
    Equalizer.prototype.use = function (name) {
      var seq = this.presets[name] || this.presets[0];
      for (var i = 0; i < this.eqFilter.filters.length; i++) {
        this.eqFilter.filters[i].gain.value = seq.values[i];
      }
    };
    Equalizer.prototype.reset = function () {
      for (var i = 0; i < this.eqFilter.filters.length; i++) {
        this.eqFilter.filters[i].gain.value = 0;
      }
    };
    Equalizer.prototype.set = function (index, value) {
      this.eqFilter.filters[index].gain.value = value;
    };
    Equalizer.prototype.get = function (index) {
      return this.eqFilter.filters[index].gain.value;
    };
    Equalizer.prototype.connect = function (before, aftter) {
      if (this.eqFilter) {
        before.connect(this.eqFilter.first);
        this.eqFilter.last.connect(aftter);
      }
    };
    return Equalizer;
  })();
  exports.Equalizer = Equalizer;
});
define("equalizer-ui", ["require", "exports"], function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var EqualizerUIItem = /** @class */ (function () {
    function EqualizerUIItem() {
      this.div = document.createElement("div");
      this.freq = document.createElement("span");
      this.input = document.createElement("input");
      this.label = document.createElement("span");
      this.div.className = "slide-wrapper";
      this.input.type = "range";
      this.input.min = "-20.0";
      this.input.max = "20.0";
      this.input.value = "0";
      this.freq.className = "scope";
      this.freq.textContent = "";
      this.label.className = "scope";
      this.label.textContent = this.input.value + " dB";
      this.div.appendChild(this.freq);
      this.div.appendChild(this.input);
      this.div.appendChild(this.label);
    }
    return EqualizerUIItem;
  })();
  exports.EqualizerUIItem = EqualizerUIItem;
  var EqualizerUI = /** @class */ (function () {
    function EqualizerUI(count) {
      this.el = document.createElement("div");
      this.el.className = "equalizer";
      this.comboxEqualizer = document.createElement("select");
      this.items = [];
      this.updateItems(count);
    }
    EqualizerUI.prototype.updateItems = function (count) {
      for (var i = 0; i < count; i++) {
        var item = this.createItem(i);
        this.el.appendChild(item.div);
        this.items[i] = item;
      }
    };
    EqualizerUI.prototype.createItem = function (index) {
      var _this = this;
      var item = new EqualizerUIItem();
      item.input.addEventListener(
        "input",
        function () {
          if (_this.update) {
            _this.update(item, index);
          }
        },
        false
      );
      return item;
    };
    return EqualizerUI;
  })();
  exports.EqualizerUI = EqualizerUI;
});
define("audio-player", [
  "require",
  "exports",
  "equalizer",
  "equalizer-ui"
], function (require, exports, equalizer_1, equalizer_ui_1) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var AudioPlayer = /** @class */ (function () {
    function AudioPlayer() {
      this.eq = new equalizer_1.Equalizer();
      this.ui = new equalizer_ui_1.EqualizerUI(this.eq.frequencys.length);
      this.audioCtx = new AudioContext();
      this.analyser = this.audioCtx.createAnalyser();
      this.eq.init(this.audioCtx);
      for (var i = 0, item = void 0; i < this.ui.items.length; i++) {
        item = this.ui.items[i];
        if (this.eq.frequencys[i] > 1000) {
          item.freq.textContent =
            Math.floor(this.eq.frequencys[i] / 5000) + "K";
        } else {
          item.freq.textContent = this.eq.frequencys[i] + "";
        }
      }
    }

    AudioPlayer.prototype.connect = function (media) {
      this.mediaSource = this.audioCtx.createMediaElementSource(media);
      if (this.eq) {
        this.eq.connect(this.mediaSource, this.analyser);
      } else {
        this.mediaSource.connect(this.analyser);
      }
      this.analyser.connect(this.audioCtx.destination);
    };

    return AudioPlayer;
  })();
  exports.AudioPlayer = AudioPlayer;
});

define("main", [
  "require",
  "exports",
  "frequency-draw",
  "audio-player"
], function (require, exports, frequency_draw_1, audio_player_1) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  function $id(id) {
    return document.getElementById(id);
  }
  function $$(selector) {
    return document.querySelector(selector);
  }
  function run() {
    var equalizer = $id("equalizer");
    // var myAudio = $id("myAudioPlayer");
    var myVideo = $id("myVideoPlayer");

    var comboxEqualizer = $id("combox-equalizer");
    var audioPlayer = new audio_player_1.AudioPlayer();
    var audioPlayerInited = false;
    
    audioPlayer.ui.update = function (item, index) {
      var val = +item.input.value;
      if (audioPlayer.eq) {
        audioPlayer.eq.set(index, val);
      }
      updateEq();
      comboxEqualizer.value = "Theatre";
      item.label.textContent = val + " dB";
    };
    equalizer.appendChild(audioPlayer.ui.el);
    function initAudioPlayer() {
      if (audioPlayerInited) return;
      updateEq();
      // audioPlayer.connect(myAudio);
      audioPlayer.connect(myVideo);
      audioPlayerInited = true;
    }

    function updateEq() {
      for (var i = 0; i < audioPlayer.ui.items.length; i++) {
        var item = audioPlayer.ui.items[i];
        if (audioPlayer.eq) {
          item.input.value = audioPlayer.eq.get(i) + "";
          item.label.textContent = item.input.value + " dB";
        }
      }
    }
    function update() {
      requestAnimationFrame(update);
    }
    function init() {
      myVideo.volume = 0.5;
      myVideo.addEventListener(
        "play",
        function () {
          if (audioPlayer.audioCtx.state === "suspended") {
            audioPlayer.audioCtx.resume();
          }
          initAudioPlayer();
        },
        false
      );

      comboxEqualizer.addEventListener(
        "change",
        function () {
          var val = comboxEqualizer.value;
          if (audioPlayer.eq) audioPlayer.eq.use(val);
          updateEq();
        },
        false
      );


      comboxEqualizer.value = "Theatre";
      
      // Dispatch change event
      var event = new Event('change');
      comboxEqualizer.dispatchEvent(event);

      update();
    }
    init();
  }
  if (!AudioContext) {
    alert("your browser not support AudioContext.");
  } else {
    run();
  }
});
requirejs(["main"]);

// define("frequency-draw", ["require", "exports"], function (require, exports) {
//     "use strict";
//     Object.defineProperty(exports, "__esModule", { value: true });
// });

// define("equalizer", ["require", "exports"], function (require, exports) {
//     "use strict";
//     Object.defineProperty(exports, "__esModule", { value: true });
//     var EqualizerFilter = /** @class */ (function () {
//         function EqualizerFilter(frequencys) {
//             this.frequencys = frequencys;
//             this.count = frequencys.length;
//             this.filters = new Array(this.count);
//         }
//         EqualizerFilter.prototype.init = function (ac) {
//             var filter, i = 0;
//             for (i = 0; i < this.count; i++) {
//                 filter = ac.createBiquadFilter();
//                 filter.type = "peaking";
//                 filter.frequency.value = this.frequencys[i];
//                 this.filters[i] = filter;
//                 if (this.filters[i - 1]) {
//                     this.filters[i - 1].connect(this.filters[i]);
//                 }
//             }
//         };
//         Object.defineProperty(EqualizerFilter.prototype, "first", {
//             get: function () {
//                 return this.filters[0, 0];
//             },
//             enumerable: true,
//             configurable: true
//         });
//         Object.defineProperty(EqualizerFilter.prototype, "last", {
//             get: function () {
//                 return this.filters[this.count - 1];
//             },
//             enumerable: true,
//             configurable: true
//         });
//         return EqualizerFilter;
//     }());
//     exports.EqualizerFilter = EqualizerFilter;

//     var Equalizer = /** @class */ (function () {
//         function Equalizer() {
//             this.presets = {
//                 "Manual": { name: "Manual", values: [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
//                 "Dance": { name: "Dance", values: [8, 5, 2, 0, -10, -5, 0, 6, 12, 11, 10, 0, 0] },
//                 "Rap": { name: "Rap", values: [8, -13, -9, -4, 2, 8, 12, 2, -11, -2, 8, 0, 0] },
//                 "Metal": { name: "Metal", values: [8, 12, 7, -3, 4, 13, 8, 3, -3, 8, 12, 0, 0] },
//                 "Jazz": { name: "Jazz", values: [8, -8, 6, 0, 8, -8, 10, -2, 13, 8, 1, 0, 0] },
//                 "SoftRock": { name: "SoftRock", values: [8, 5, 5, 2, -2, -8, -12, -4, 0, 7, 9, 0, 0] },
//                 "Rock": { name: "Rock", values: [8, 6, 3, -8, -12, -4, 3, 8, 10, 10, 7, 0, 0] },
//                 "Live": { name: "Live", values: [8, -6, 0, 4, 8, 9, 9, 5, 3, 2, 1, 0, 0] },
//                 "Treble": { name: "Treble", values: [8, -10, -11, -12, -6, 2, 8, 13, 13, 11, 14, 0, 0] },
//                 "Bass": { name: "Bass", values: [8, 11, 7, 3, 0, 0, -6, -10, -10, -2, -2, 0, 0] },
//                 "Classic": { name: "Classic", values: [8, 0, 7, -1, -7, -12, -8, 0, 10, 4, -5, 0, 0] },
//                 "Opera": { name: "Opera", values: [8, -13, -8, 0, 6, 14, 4, -4, -7, -8, -10, 0, 0] },
//                 "UK": { name: "UK", values: [8, -15, -15, -15, -15, -15, -15, -15, -15, -15, -15, -15, -15] },
//             };
//             // 100 200 400 600 1K 3K 6K 12K 14K 16K
//             this.frequencys = [10, 20, 30, 40, 60, 120, 250, 500, 1000, 2000, 4000, 8000, 16000];
//             this.eqFilter = new EqualizerFilter(this.frequencys);
//         }
//         Equalizer.prototype.init = function (ac) {
//             this.eqFilter.init(ac);
//         };
//         Equalizer.prototype.use = function (name) {
//             var seq = this.presets[name] || this.presets[0];
//             for (var i = 0; i < this.eqFilter.filters.length; i++) {
//                 this.eqFilter.filters[i].gain.value = seq.values[i];
//             }
//         };
//         Equalizer.prototype.reset = function () {
//             for (var i = 0; i < this.eqFilter.filters.length; i++) {
//                 this.eqFilter.filters[i].gain.value = 0;
//             }
//         };
//         Equalizer.prototype.set = function (index, value) {
//             this.eqFilter.filters[index].gain.value = value;
//         };
//         Equalizer.prototype.get = function (index) {
//             return this.eqFilter.filters[index].gain.value;
//         };
//         Equalizer.prototype.connect = function (before, aftter) {
//             if (this.eqFilter) {
//                 before.connect(this.eqFilter.first);
//                 this.eqFilter.last.connect(aftter);
//             }
//         };
//         return Equalizer;
//     }());
//     exports.Equalizer = Equalizer;
// });
// define("equalizer-ui", ["require", "exports"], function (require, exports) {
//     "use strict";
//     Object.defineProperty(exports, "__esModule", { value: true });
//     var EqualizerUIItem = /** @class */ (function () {
//         function EqualizerUIItem() {
//             this.div = document.createElement("div");
//             this.freq = document.createElement("span");
//             this.input = document.createElement("input");
//             this.label = document.createElement("span");
//             this.div.className = "slide-wrapper";
//             this.input.type = "range";
//             this.input.min = "-20.0";
//             this.input.max = "20.0";
//             this.input.value = "0";
//             this.freq.className = "scope";
//             this.freq.textContent = "";
//             this.label.className = "scope";
//             this.label.textContent = this.input.value + " dB";
//             this.div.appendChild(this.freq);
//             this.div.appendChild(this.input);
//             this.div.appendChild(this.label);
//         }
//         return EqualizerUIItem;
//     }());
//     exports.EqualizerUIItem = EqualizerUIItem;
//     var EqualizerUI = /** @class */ (function () {
//         function EqualizerUI(count) {
//             this.el = document.createElement("div");
//             this.el.className = "equalizer";
//             this.comboxEqualizer = document.createElement("select");
//             this.items = [];
//             this.updateItems(count);
//         }
//         EqualizerUI.prototype.updateItems = function (count) {
//             for (var i = 0; i < count; i++) {
//                 var item = this.createItem(i);
//                 this.el.appendChild(item.div);
//                 this.items[i] = item;
//             }
//         };
//         EqualizerUI.prototype.createItem = function (index) {
//             var _this = this;
//             var item = new EqualizerUIItem();
//             item.input.addEventListener("input", function () {
//                 if (_this.update) {
//                     _this.update(item, index);
//                 }
//             }, false);
//             return item;
//         };
//         return EqualizerUI;
//     }());
//     exports.EqualizerUI = EqualizerUI;
// });
// define("audio-player", ["require", "exports", "equalizer", "equalizer-ui"], function (require, exports, equalizer_1, equalizer_ui_1) {
//     "use strict";
//     Object.defineProperty(exports, "__esModule", { value: true });
//     var AudioPlayer = /** @class */ (function () {
//         function AudioPlayer() {
//             this.eq = new equalizer_1.Equalizer();
//             this.ui = new equalizer_ui_1.EqualizerUI(this.eq.frequencys.length);
//             this.audioCtx = new AudioContext();
//             this.analyser = this.audioCtx.createAnalyser();
//             this.eq.init(this.audioCtx);
//             for (var i = 0, item = void 0; i < this.ui.items.length; i++) {
//                 item = this.ui.items[i];
//                 if (this.eq.frequencys[i] > 1000) {
//                     item.freq.textContent = Math.floor(this.eq.frequencys[i] / 5000) + "K";
//                 }
//                 else {
//                     item.freq.textContent = this.eq.frequencys[i] + "";
//                 }
//             }
//         }

//         AudioPlayer.prototype.connect = function (media) {
//             this.mediaSource = this.audioCtx.createMediaElementSource(media);
//             if (this.eq) {
//                 this.eq.connect(this.mediaSource, this.analyser);
//             }
//             else {
//                 this.mediaSource.connect(this.analyser);
//             }
//             this.analyser.connect(this.audioCtx.destination);
//         };

//         return AudioPlayer;
//     }());
//     exports.AudioPlayer = AudioPlayer;
// });

// define("main", ["require", "exports", "frequency-draw", "audio-player"], function (require, exports, frequency_draw_1, audio_player_1) {
//     "use strict";
//     Object.defineProperty(exports, "__esModule", { value: true });
//     function $id(id) {
//         return document.getElementById(id);
//     }
//     function $$(selector) {
//         return document.querySelector(selector);
//     }
//     function run() {
//         var playBtn = $id("play");
//         var myFileAuVi = $id("myFileInput");
//         var equalizer = $id("equalizer");
//         var myAudio = $id("myAudioPlayer");
//         var myVideo = $id("myVideoPlayer");
//         var testPre = $id("testingPreset");
//         var play = {
//             src: "",
//         };
//         var comboxEqualizer = $id("combox-equalizer");
//         var audioPlayer = new audio_player_1.AudioPlayer();
//         var audioPlayerInited = false;
//         audioPlayer.ui.update = function (item, index) {
//             var val = +item.input.value;
//             if (audioPlayer.eq) {
//                 audioPlayer.eq.set(index, val);
//             }
//             updateEq();
//             comboxEqualizer.value = "UK";
//             item.label.textContent = val + " dB";
//         };
//         equalizer.appendChild(audioPlayer.ui.el);
//         function initAudioPlayer() {
//             if (audioPlayerInited)
//                 return;
//             updateEq();
//             audioPlayer.connect(myAudio);
//             audioPlayer.connect(myVideo);
//             audioPlayerInited = true;
//         }
//         function updateEq() {
//             for (var i = 0; i < 13; i++) {
//                 var item = audioPlayer.ui.items[i];
//                 if (audioPlayer.eq) {
//                     item.input.value = audioPlayer.eq.get(i) + "";
//                     item.label.textContent = item.input.value + " dB";
//                 }
//             }
//         }
//         function update() {
//             requestAnimationFrame(update);
//         }
//         function updatePlayBtn() {
//             if (myAudio.paused) {
//                 playBtn.textContent = "Play";
//             }
//             else {
//                 playBtn.textContent = "Pause";
//             }
//         }
//         function init() {
//             myAudio.volume = 0.5;
//             myVideo.volume = 0.5;
//             myAudio.addEventListener("play", function () {
//                 if (audioPlayer.audioCtx.state === "suspended") {
//                     audioPlayer.audioCtx.resume();
//                 }
//                 initAudioPlayer();
//                 updatePlayBtn();
//             }, false);

//             myVideo.addEventListener("play", function () {
//                 if (audioPlayer.audioCtx.state === "suspended") {
//                     audioPlayer.audioCtx.resume();
//                 }
//                 initAudioPlayer();
//                 updatePlayBtn();
//             }, false);
//             myAudio.addEventListener("pause", function () {
//                 updatePlayBtn();
//             }, false);

//             playBtn.addEventListener("click", function () {
//                 if (myAudio.paused || myVideo.paused) {
//                     myAudio.play();
//                 }
//                 else {
//                     myAudio.pause();
//                 }
//             }, false);
//             myFileAuVi.addEventListener("input", function (e) {
//                 var file = myFileAuVi.files && myFileAuVi.files[0, 0];
//                 myFileAuVi.value = "";
//                 if (!file)
//                     return;
//                 play.src = URL.createObjectURL(file);
//                 if(file.type == 'audio/mpeg'){
//                     myAudio.src = play.src;
//                 }else{
//                     myVideo.src = play.src;
//                 }
//                 updatePlayBtn();
//             }, false);
//             comboxEqualizer.addEventListener("input", function () {
//                 var val = comboxEqualizer.value;
//                 if (audioPlayer.eq)
//                     audioPlayer.eq.use(val);
//                 updateEq();
//             }, false);
//             update();
//         }
//         init();
//     }
//     if (!AudioContext) {
//         alert("your browser not support AudioContext.");
//     }
//     else {
//         run();
//     }
// });
// requirejs(["main"]);
