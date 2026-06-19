(function () {
    "use strict";

    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupNavigation() {
        var toggle = document.querySelector(".menu-toggle");
        var nav = document.querySelector(".mobile-nav");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(open));
        });
    }

    function setupHero() {
        var slides = selectAll("[data-hero-slide]");
        var dots = selectAll("[data-hero-dot]");
        if (slides.length <= 1) {
            return;
        }
        var active = 0;
        var timer = null;

        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, idx) {
                slide.classList.toggle("is-active", idx === active);
            });
            dots.forEach(function (dot, idx) {
                dot.classList.toggle("is-active", idx === active);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot") || 0));
                start();
            });
        });

        var hero = document.querySelector(".home-hero");
        if (hero) {
            hero.addEventListener("mouseenter", stop);
            hero.addEventListener("mouseleave", start);
        }
        start();
    }

    function setupFilters() {
        selectAll(".has-filters").forEach(function (section) {
            var search = section.querySelector(".filter-search");
            var selects = selectAll(".filter-select", section);
            var cards = selectAll(".movie-card", section);
            var count = section.querySelector(".result-count");
            var empty = section.querySelector(".empty-state");
            var reset = section.querySelector(".filter-reset");
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");

            if (search && query) {
                search.value = query;
            }

            function filter() {
                var keyword = search ? search.value.trim().toLowerCase() : "";
                var visible = 0;
                cards.forEach(function (card) {
                    var ok = true;
                    var text = (card.getAttribute("data-card-text") || "").toLowerCase();
                    if (keyword && text.indexOf(keyword) === -1) {
                        ok = false;
                    }
                    selects.forEach(function (select) {
                        var value = select.value;
                        var key = select.getAttribute("data-filter");
                        var cardValue = card.getAttribute("data-" + key) || "";
                        if (value && cardValue.indexOf(value) === -1) {
                            ok = false;
                        }
                    });
                    card.hidden = !ok;
                    if (ok) {
                        visible += 1;
                    }
                });
                if (count) {
                    count.textContent = "共 " + visible + " 部影片";
                }
                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }

            if (search) {
                search.addEventListener("input", filter);
            }
            selects.forEach(function (select) {
                select.addEventListener("change", filter);
            });
            if (reset) {
                reset.addEventListener("click", function () {
                    if (search) {
                        search.value = "";
                    }
                    selects.forEach(function (select) {
                        select.value = "";
                    });
                    filter();
                });
            }
            filter();
        });
    }

    function loadHlsLibrary(callback) {
        if (window.Hls) {
            callback();
            return;
        }
        var existing = document.querySelector("script[data-hls-loader]");
        if (existing) {
            existing.addEventListener("load", callback, { once: true });
            return;
        }
        var script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js";
        script.defer = true;
        script.setAttribute("data-hls-loader", "true");
        script.addEventListener("load", callback, { once: true });
        document.head.appendChild(script);
    }

    function setupPlayers() {
        selectAll("[data-player]").forEach(function (player) {
            var video = player.querySelector("video[data-src]");
            var trigger = player.querySelector(".play-trigger");
            if (!video || !trigger) {
                return;
            }

            function attachAndPlay() {
                var src = video.getAttribute("data-src");
                if (!src) {
                    return;
                }
                player.classList.add("is-playing");
                video.setAttribute("controls", "controls");

                function playVideo() {
                    var promise = video.play();
                    if (promise && promise.catch) {
                        promise.catch(function () {
                            player.classList.remove("is-playing");
                        });
                    }
                }

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    if (!video.src) {
                        video.src = src;
                    }
                    playVideo();
                    return;
                }

                loadHlsLibrary(function () {
                    if (window.Hls && window.Hls.isSupported()) {
                        if (!video.__hlsInstance) {
                            var hls = new window.Hls({
                                enableWorker: true,
                                lowLatencyMode: true,
                                backBufferLength: 90
                            });
                            hls.loadSource(src);
                            hls.attachMedia(video);
                            video.__hlsInstance = hls;
                            hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
                        } else {
                            playVideo();
                        }
                    } else {
                        video.src = src;
                        playVideo();
                    }
                });
            }

            trigger.addEventListener("click", attachAndPlay);
            video.addEventListener("play", function () {
                player.classList.add("is-playing");
            });
            video.addEventListener("pause", function () {
                if (video.currentTime === 0 || video.ended) {
                    player.classList.remove("is-playing");
                }
            });
        });
    }

    function setupCopyButtons() {
        selectAll(".copy-link").forEach(function (button) {
            button.addEventListener("click", function () {
                var url = window.location.href;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(function () {
                        button.textContent = "已复制";
                        window.setTimeout(function () {
                            button.textContent = "复制链接";
                        }, 1400);
                    });
                }
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        setupNavigation();
        setupHero();
        setupFilters();
        setupPlayers();
        setupCopyButtons();
    });
}());
