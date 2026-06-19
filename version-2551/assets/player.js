(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var video = document.querySelector("[data-player]");
    var layer = document.querySelector("[data-play-layer]");
    var url = typeof STREAM_URL === "string" ? STREAM_URL : "";
    var loaded = false;
    var hlsObject = null;

    function attach() {
      if (!video || !url || loaded) return;
      loaded = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (window.Hls && Hls.isSupported()) {
        hlsObject = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsObject.loadSource(url);
        hlsObject.attachMedia(video);
      } else {
        video.src = url;
      }
    }

    function play() {
      if (!video) return;
      attach();
      if (layer) layer.classList.add("hidden");
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          if (layer) layer.classList.remove("hidden");
        });
      }
    }

    if (layer) {
      layer.addEventListener("click", play);
    }
    if (video) {
      video.addEventListener("play", function () {
        if (layer) layer.classList.add("hidden");
      });
      video.addEventListener("pause", function () {
        if (video.currentTime === 0 && layer) layer.classList.remove("hidden");
      });
      video.addEventListener("error", function () {
        if (hlsObject) {
          hlsObject.destroy();
          hlsObject = null;
        }
        loaded = false;
      });
    }
  });
})();
