(function () {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  const params = new URLSearchParams(window.location.search);
  const queryValue = params.get('q') || '';
  const liveInputs = document.querySelectorAll('[data-live-search]');

  liveInputs.forEach(function (input) {
    if (queryValue) {
      input.value = queryValue;
    }

    input.addEventListener('input', applyFilters);
  });

  document.querySelectorAll('[data-filter-button]').forEach(function (button) {
    button.addEventListener('click', function () {
      const group = button.closest('.page-section') || document;
      group.querySelectorAll('[data-filter-button]').forEach(function (item) {
        item.classList.remove('active');
      });
      button.classList.add('active');
      applyFilters();
    });
  });

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function activeFilter() {
    const selected = document.querySelector('[data-filter-button].active');
    return selected ? selected.getAttribute('data-filter') : '全部';
  }

  function applyFilters() {
    const input = document.querySelector('[data-live-search]');
    const keyword = normalize(input ? input.value : queryValue);
    const filter = activeFilter();
    const cards = document.querySelectorAll('[data-movie-card]');
    const empty = document.querySelector('[data-empty-state]');
    let visible = 0;

    cards.forEach(function (card) {
      const haystack = normalize(card.getAttribute('data-search'));
      const filterText = normalize([
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags')
      ].join(' '));
      const matchesKeyword = !keyword || haystack.includes(keyword);
      const matchesFilter = filter === '全部' || filterText.includes(normalize(filter));
      const shouldShow = matchesKeyword && matchesFilter;
      card.style.display = shouldShow ? '' : 'none';
      if (shouldShow) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  if (queryValue || document.querySelector('[data-live-search]')) {
    applyFilters();
  }

  document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
    const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
    const previous = carousel.querySelector('[data-hero-prev]');
    const next = carousel.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')));
        restart();
      });
    });

    if (previous) {
      previous.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    show(0);
    restart();
  });
})();
