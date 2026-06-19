(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }

  ready(function () {
    var navToggle = document.querySelector('.nav-toggle');
    var navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function () {
        var isOpen = navMenu.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var index = 0;

      function show(next) {
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === index);
        });
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
          show(dotIndex);
        });
      });

      if (slides.length > 1) {
        window.setInterval(function () {
          show(index + 1);
        }, 5800);
      }
    });

    document.querySelectorAll('.filter-bar').forEach(function (bar) {
      var target = bar.getAttribute('data-filter-scope');
      var container = target ? document.querySelector(target) : null;
      var input = bar.querySelector('[data-filter-input]');
      var yearInput = bar.querySelector('[data-year-input]');
      var clearButton = bar.querySelector('[data-filter-clear]');

      function applyFilter() {
        if (!container) {
          return;
        }
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var year = yearInput ? yearInput.value.trim().toLowerCase() : '';
        container.querySelectorAll('[data-filter-card]').forEach(function (card) {
          var haystack = (card.getAttribute('data-search') || '').toLowerCase();
          var cardYear = (card.getAttribute('data-year') || '').toLowerCase();
          var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchedYear = !year || cardYear.indexOf(year) !== -1 || haystack.indexOf(year) !== -1;
          card.classList.toggle('is-hidden', !(matchedKeyword && matchedYear));
        });
      }

      if (input) {
        input.addEventListener('input', applyFilter);
      }
      if (yearInput) {
        yearInput.addEventListener('input', applyFilter);
      }
      if (clearButton) {
        clearButton.addEventListener('click', function () {
          if (input) {
            input.value = '';
          }
          if (yearInput) {
            yearInput.value = '';
          }
          applyFilter();
        });
      }
    });

    document.querySelectorAll('[data-player]').forEach(function (player) {
      var video = player.querySelector('video');
      var cover = player.querySelector('.player-cover');
      var hlsInstance = null;

      function attachMedia() {
        if (!video || video.getAttribute('data-ready') === '1') {
          return;
        }
        var playUrl = video.getAttribute('data-play');
        if (!playUrl) {
          return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = playUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(playUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = playUrl;
        }
        video.setAttribute('data-ready', '1');
      }

      function startPlayback() {
        attachMedia();
        if (cover) {
          cover.classList.add('is-hidden');
        }
        if (video) {
          video.controls = true;
          var promise = video.play();
          if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {});
          }
        }
      }

      if (cover) {
        cover.addEventListener('click', startPlayback);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (video.paused) {
            startPlayback();
          }
        });
      }

      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });

    document.querySelectorAll('[data-player-jump]').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        var player = document.querySelector('[data-player]');
        var cover = player ? player.querySelector('.player-cover') : null;
        if (player) {
          player.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (cover) {
          setTimeout(function () {
            cover.click();
          }, 280);
        }
      });
    });
  });
})();
