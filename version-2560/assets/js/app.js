(function () {
  function queryAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var button = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.mobile-nav');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  function setupHero() {
    var slides = queryAll('.hero-slide');
    var dots = queryAll('.hero-dot');
    var prev = document.querySelector('.hero-prev');
    var next = document.querySelector('.hero-next');
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function startTimer() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-slide') || '0', 10));
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        startTimer();
      });
    }

    show(0);
    startTimer();
  }

  function setupFilters() {
    queryAll('.filter-scope').forEach(function (scope) {
      var search = scope.querySelector('.movie-search');
      var year = scope.querySelector('.movie-year-filter');
      var genre = scope.querySelector('.movie-genre-filter');
      var cards = queryAll('.movie-card', scope);

      function filter() {
        var keyword = search ? search.value.trim().toLowerCase() : '';
        var selectedYear = year ? year.value : '';
        var selectedGenre = genre ? genre.value : '';
        cards.forEach(function (card) {
          var text = [
            card.getAttribute('data-title'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-region'),
            card.getAttribute('data-category')
          ].join(' ').toLowerCase();
          var cardYear = card.getAttribute('data-year') || '';
          var cardCategory = card.getAttribute('data-category') || '';
          var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchedYear = !selectedYear || cardYear === selectedYear;
          var matchedGenre = !selectedGenre || cardCategory === selectedGenre;
          card.classList.toggle('is-filter-hidden', !(matchedKeyword && matchedYear && matchedGenre));
        });
      }

      if (search) {
        search.addEventListener('input', filter);
      }
      if (year) {
        year.addEventListener('change', filter);
      }
      if (genre) {
        genre.addEventListener('change', filter);
      }
    });
  }

  function setupHeroSearch() {
    var form = document.querySelector('.hero-search');
    if (!form) {
      return;
    }
    form.addEventListener('submit', function () {
      var input = form.querySelector('.movie-search');
      try {
        sessionStorage.setItem('movieSearchKeyword', input ? input.value : '');
      } catch (error) {
      }
    });

    var librarySearch = document.querySelector('#library .movie-search');
    if (!librarySearch) {
      return;
    }
    try {
      var keyword = sessionStorage.getItem('movieSearchKeyword');
      if (keyword) {
        librarySearch.value = keyword;
        librarySearch.dispatchEvent(new Event('input'));
        sessionStorage.removeItem('movieSearchKeyword');
      }
    } catch (error) {
    }
  }

  function setupImages() {
    queryAll('img').forEach(function (image) {
      image.addEventListener('error', function () {
        image.style.opacity = '0';
      }, { once: true });
    });
  }

  function setupPlayer() {
    queryAll('.video-player').forEach(function (player) {
      var video = player.querySelector('video');
      var button = player.querySelector('.video-start');
      var status = player.querySelector('.video-status');
      var stream = player.getAttribute('data-stream');
      var initialized = false;
      var hlsInstance = null;

      if (!video || !button || !stream) {
        return;
      }

      function setStatus(message) {
        if (!status) {
          return;
        }
        status.textContent = message;
        status.hidden = !message;
      }

      function initialize() {
        if (initialized) {
          return;
        }
        initialized = true;
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 90
          });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) {
              return;
            }
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              setStatus('网络连接异常，正在重新加载');
              hlsInstance.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              setStatus('播放遇到异常，正在恢复');
              hlsInstance.recoverMediaError();
            } else {
              setStatus('暂时无法播放此影片');
              hlsInstance.destroy();
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else {
          setStatus('此浏览器暂不支持该播放格式');
        }
      }

      function play() {
        initialize();
        setStatus('');
        button.classList.add('is-hidden');
        var action = video.play();
        if (action && typeof action.catch === 'function') {
          action.catch(function () {
            button.classList.remove('is-hidden');
          });
        }
      }

      button.addEventListener('click', play);
      video.addEventListener('play', function () {
        button.classList.add('is-hidden');
      });
      video.addEventListener('pause', function () {
        if (!video.ended) {
          button.classList.remove('is-hidden');
        }
      });
      video.addEventListener('ended', function () {
        button.classList.remove('is-hidden');
      });
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      window.addEventListener('pagehide', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupHeroSearch();
    setupImages();
    setupPlayer();
  });
})();
