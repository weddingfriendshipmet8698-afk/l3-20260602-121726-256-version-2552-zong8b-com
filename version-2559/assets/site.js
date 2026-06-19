(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var navButton = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-site-nav]");
    if (navButton && nav) {
      navButton.addEventListener("click", function () {
        nav.classList.toggle("open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var heroIndex = 0;
    function showHero(index) {
      if (!slides.length) {
        return;
      }
      heroIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === heroIndex);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === heroIndex);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showHero(i);
      });
    });
    if (slides.length > 1) {
      showHero(0);
      window.setInterval(function () {
        showHero(heroIndex + 1);
      }, 5200);
    }

    var searchInput = document.querySelector("[data-search-input]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    if (searchInput && cards.length) {
      searchInput.addEventListener("input", function () {
        var query = searchInput.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title"),
            card.getAttribute("data-year"),
            card.getAttribute("data-category"),
            card.getAttribute("data-tags"),
            card.textContent
          ].join(" ").toLowerCase();
          card.classList.toggle("hidden-by-search", query && haystack.indexOf(query) === -1);
        });
      });
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(function (shell) {
      var video = shell.querySelector("video");
      var button = shell.querySelector("[data-play-button]");
      var source = shell.getAttribute("data-stream");
      var hlsInstance = null;

      function loadAndPlay() {
        if (!video || !source) {
          return;
        }
        if (!video.getAttribute("data-ready")) {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
          } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({ enableWorker: true });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
          } else {
            video.src = source;
          }
          video.setAttribute("data-ready", "1");
        }
        shell.classList.add("playing");
        video.play().catch(function () {});
      }

      if (button) {
        button.addEventListener("click", loadAndPlay);
      }
      if (video) {
        video.addEventListener("click", function () {
          if (video.paused) {
            loadAndPlay();
          }
        });
        video.addEventListener("play", function () {
          shell.classList.add("playing");
        });
        video.addEventListener("ended", function () {
          shell.classList.remove("playing");
        });
      }
      window.addEventListener("pagehide", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  });
})();
