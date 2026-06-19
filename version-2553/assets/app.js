(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var menuPanel = document.querySelector('[data-menu-panel]');

  if (menuButton && menuPanel) {
    menuButton.addEventListener('click', function () {
      menuPanel.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dotsBox = hero.querySelector('[data-hero-dots]');
    var activeIndex = 0;

    function showSlide(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === activeIndex);
      });
      if (dotsBox) {
        Array.prototype.slice.call(dotsBox.querySelectorAll('button')).forEach(function (dot, i) {
          dot.classList.toggle('active', i === activeIndex);
        });
      }
    }

    if (dotsBox && slides.length > 1) {
      slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', '切换推荐影片');
        dot.addEventListener('click', function () {
          showSlide(i);
        });
        dotsBox.appendChild(dot);
      });
    }

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5200);
    }
  }

  function renderSearchItem(item) {
    return '<a class="search-result-item" href="' + item.url + '">' +
      '<img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '">' +
      '<span><strong>' + item.title + '</strong><p>' + item.year + ' · ' + item.region + ' · ' + item.genre + '</p></span>' +
      '</a>';
  }

  var searchInput = document.querySelector('[data-site-search]');
  var searchResults = document.querySelector('[data-search-results]');
  var clearButton = document.querySelector('[data-clear-search]');

  if (searchInput && searchResults && window.MOVIE_SEARCH_DATA) {
    searchInput.addEventListener('input', function () {
      var keyword = searchInput.value.trim().toLowerCase();
      if (!keyword) {
        searchResults.classList.remove('active');
        searchResults.innerHTML = '';
        return;
      }
      var results = window.MOVIE_SEARCH_DATA.filter(function (item) {
        return [item.title, item.year, item.region, item.genre, item.summary].join(' ').toLowerCase().indexOf(keyword) !== -1;
      }).slice(0, 12);
      searchResults.innerHTML = results.map(renderSearchItem).join('');
      searchResults.classList.toggle('active', results.length > 0);
    });
  }

  if (clearButton && searchInput && searchResults) {
    clearButton.addEventListener('click', function () {
      searchInput.value = '';
      searchResults.innerHTML = '';
      searchResults.classList.remove('active');
      searchInput.focus();
    });
  }

  var localFilter = document.querySelector('[data-local-filter]');

  if (localFilter) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    localFilter.addEventListener('input', function () {
      var keyword = localFilter.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = [card.dataset.title, card.dataset.year, card.dataset.region, card.dataset.genre, card.textContent].join(' ').toLowerCase();
        card.classList.toggle('is-hidden', keyword && text.indexOf(keyword) === -1);
      });
    });
  }

  var shell = document.querySelector('[data-player-shell]');
  var video = document.querySelector('[data-hls-player]');
  var layer = document.querySelector('[data-play-layer]');

  function initPlayer() {
    if (!video) {
      return;
    }
    var src = video.getAttribute('data-src');
    if (!src) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.src) {
        video.src = src;
      }
    } else if (window.Hls && window.Hls.isSupported()) {
      if (!video.dataset.hlsReady) {
        var hls = new window.Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        video.dataset.hlsReady = 'true';
      }
    } else if (!video.src) {
      video.src = src;
    }
  }

  if (video) {
    initPlayer();
    video.addEventListener('play', function () {
      if (shell) {
        shell.classList.add('playing');
      }
    });
    video.addEventListener('pause', function () {
      if (shell) {
        shell.classList.remove('playing');
      }
    });
  }

  if (layer && video) {
    layer.addEventListener('click', function () {
      initPlayer();
      var playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {});
      }
    });
  }
})();
