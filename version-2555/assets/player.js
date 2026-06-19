document.addEventListener('DOMContentLoaded', function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  function loadHlsLibrary(callback) {
    if (window.Hls) {
      callback();
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.onload = callback;
    script.onerror = function () {
      callback(new Error('hls.js failed to load'));
    };
    document.head.appendChild(script);
  }

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var cover = player.querySelector('.play-cover');
    var url = player.getAttribute('data-video-url');

    if (!video || !cover || !url) {
      return;
    }

    cover.addEventListener('click', function () {
      cover.classList.add('is-hidden');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play().catch(function () {});
        return;
      }

      loadHlsLibrary(function () {
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          video.src = url;
          video.play().catch(function () {});
        }
      });
    });
  });
});
