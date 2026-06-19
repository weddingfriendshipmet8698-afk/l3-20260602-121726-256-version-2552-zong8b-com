(function () {
  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      const isOpen = mobileMenu.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const slider = document.querySelector("[data-hero-slider]");

  if (slider) {
    const slides = Array.from(slider.querySelectorAll(".hero-slide"));
    const dots = Array.from(slider.querySelectorAll("[data-hero-dot]"));
    let current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  const filterAreas = document.querySelectorAll("[data-filter-area]");

  filterAreas.forEach(function (area) {
    const list = area.parentElement.querySelector("[data-card-list]");
    const empty = area.parentElement.querySelector("[data-empty-state]");
    const searchInput = area.querySelector("[data-card-search]");
    const yearSelect = area.querySelector("[data-card-year]");
    const typeSelect = area.querySelector("[data-card-type]");
    const regionSelect = area.querySelector("[data-card-region]");

    if (!list) {
      return;
    }

    const cards = Array.from(list.children);

    if (area.hasAttribute("data-read-query") && searchInput) {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("q");
      if (query) {
        searchInput.value = query;
      }
    }

    function applyFilter() {
      const query = normalize(searchInput ? searchInput.value : "");
      const year = normalize(yearSelect ? yearSelect.value : "");
      const type = normalize(typeSelect ? typeSelect.value : "");
      const region = normalize(regionSelect ? regionSelect.value : "");
      let visible = 0;

      cards.forEach(function (card) {
        const text = normalize([
          card.dataset.title,
          card.dataset.tags,
          card.dataset.year,
          card.dataset.region,
          card.dataset.type,
          card.textContent
        ].join(" "));
        const matchQuery = !query || text.includes(query);
        const matchYear = !year || normalize(card.dataset.year) === year;
        const matchType = !type || normalize(card.dataset.type) === type;
        const matchRegion = !region || normalize(card.dataset.region) === region;
        const isVisible = matchQuery && matchYear && matchType && matchRegion;
        card.style.display = isVisible ? "" : "none";
        if (isVisible) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    [searchInput, yearSelect, typeSelect, regionSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });

    applyFilter();
  });
})();
