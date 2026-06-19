document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  function normalize(text) {
    return String(text || '').trim().toLowerCase();
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
  var yearFilter = document.querySelector('[data-year-filter]');
  var regionFilter = document.querySelector('[data-region-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));

  function applyFilters() {
    var keyword = normalize(searchInputs.map(function (input) {
      return input.value;
    }).filter(Boolean)[0]);
    var yearValue = yearFilter ? yearFilter.value : '';
    var regionValue = regionFilter ? regionFilter.value : '';

    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title'),
        card.getAttribute('data-desc'),
        card.getAttribute('data-tags')
      ].join(' ').toLowerCase();
      var yearOk = !yearValue || card.getAttribute('data-year') === yearValue;
      var regionOk = !regionValue || card.getAttribute('data-region') === regionValue;
      var keywordOk = !keyword || haystack.indexOf(keyword) !== -1;
      card.classList.toggle('hidden-by-filter', !(yearOk && regionOk && keywordOk));
    });
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      searchInputs.forEach(function (other) {
        if (other !== input) {
          other.value = input.value;
        }
      });
      applyFilters();
    });
  });

  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilters);
  }

  if (regionFilter) {
    regionFilter.addEventListener('change', applyFilters);
  }
});
