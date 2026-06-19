(function () {
  const players = document.querySelectorAll("[data-player]");

  players.forEach(function (player) {
    const button = player.querySelector("[data-stream]");
    const video = player.querySelector("video");
    let started = false;
    let hls = null;

    function startVideo() {
      if (started || !button || !video) {
        return;
      }

      const stream = button.getAttribute("data-stream");
      if (!stream) {
        return;
      }

      started = true;
      button.classList.add("is-hidden");
      video.setAttribute("controls", "controls");

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        video.play().catch(function () {});
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
        return;
      }

      video.src = stream;
      video.play().catch(function () {});
    }

    if (button) {
      button.addEventListener("click", startVideo);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (!started) {
          startVideo();
        }
      });
    }

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
