(function () {
    var video = document.getElementById('moviePlayer');
    var button = document.querySelector('[data-play-button]');
    if (!video) {
        return;
    }

    var stream = video.getAttribute('data-stream');
    var ready = false;
    var hlsInstance = null;

    function attach() {
        if (ready || !stream) {
            return;
        }
        ready = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                maxBufferLength: 30,
                backBufferLength: 30
            });
            hlsInstance.loadSource(stream);
            hlsInstance.attachMedia(video);
            return;
        }
        video.src = stream;
    }

    function play() {
        attach();
        if (button) {
            button.classList.add('is-hidden');
        }
        var action = video.play();
        if (action && typeof action.catch === 'function') {
            action.catch(function () {});
        }
    }

    if (button) {
        button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            play();
        }
    });

    video.addEventListener('play', function () {
        if (button) {
            button.classList.add('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
})();
