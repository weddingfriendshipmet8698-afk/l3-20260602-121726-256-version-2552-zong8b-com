(function () {
  const cache = new Map();

  function setup(video, src) {
    if (cache.has(video)) {
      return cache.get(video);
    }

    let instance = null;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (window.Hls && window.Hls.isSupported()) {
      instance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      instance.loadSource(src);
      instance.attachMedia(video);
    } else {
      video.src = src;
    }

    cache.set(video, instance || true);
    return instance || true;
  }

  window.initMoviePlayer = function (videoId, buttonId, src) {
    const video = document.getElementById(videoId);
    const button = document.getElementById(buttonId);

    if (!video || !button || !src) {
      return;
    }

    function play() {
      setup(video, src);
      button.classList.add('is-hidden');
      video.controls = true;
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          button.classList.remove('is-hidden');
        });
      }
    }

    button.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener('play', function () {
      button.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
      if (!video.ended && video.currentTime === 0) {
        button.classList.remove('is-hidden');
      }
    });
  };
})();
