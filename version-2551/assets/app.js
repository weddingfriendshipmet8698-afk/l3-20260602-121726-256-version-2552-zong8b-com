(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");
    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        mobilePanel.classList.toggle("open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var index = 0;
      var show = function (next) {
        if (!slides.length) return;
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
        });
      };
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
        });
      });
      setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var input = document.querySelector("[data-filter-input]");
    var yearSelect = document.querySelector("[data-year-select]");
    var params = new URLSearchParams(location.search);
    if (input && params.get("q")) {
      input.value = params.get("q");
    }

    function normalize(value) {
      return (value || "").toString().toLowerCase().trim();
    }

    function filterCards() {
      var q = normalize(input ? input.value : "");
      var y = normalize(yearSelect ? yearSelect.value : "");
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-category"),
          card.getAttribute("data-year")
        ].join(" "));
        var cardYear = normalize(card.getAttribute("data-year"));
        var matched = (!q || haystack.indexOf(q) !== -1) && (!y || cardYear.indexOf(y) !== -1);
        card.classList.toggle("hidden", !matched);
      });
    }

    if (input) {
      input.addEventListener("input", filterCards);
    }
    if (yearSelect) {
      yearSelect.addEventListener("change", filterCards);
    }
    if (input || yearSelect) {
      filterCards();
    }
  });
})();
