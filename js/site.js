/* Lowick Hedry — v1 site interactions
   Minimal, dependency-free: mobile nav toggle, scroll-reveal,
   and a demo-only contact form handler. */
(function () {
  'use strict';

  /* ----- Mobile nav ----- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----- Scroll reveal ----- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ----- Hero vertical video slider ----- */
  var sliderTracks = document.querySelectorAll('[data-vertical-slider]');
  function setSliderStep(track) {
    var slide = track.querySelector('.hero-video-card');
    if (!slide) return;

    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.rowGap || styles.gap) || 0;
    var viewport = track.closest('.hero-video-slider');
    var viewportHeight = Math.round((slide.offsetHeight * 1.62) + (gap * 2));

    track.style.setProperty('--slide-step', (slide.offsetHeight + gap) + 'px');
    track.style.setProperty('--slider-pad', Math.round((viewportHeight - slide.offsetHeight) / 2) + 'px');
    if (viewport) {
      viewport.style.setProperty('--slider-viewport-height', viewportHeight + 'px');
    }
  }

  function pauseSliderVideos(track) {
    track.querySelectorAll('video').forEach(function (video) {
      video.pause();
    });
  }

  function playCenteredVideo(track, index) {
    pauseSliderVideos(track);

    var video = track.querySelector('[data-slide-index="' + index + '"]:not([aria-hidden="true"]) video');
    if (!video) return;

    video.currentTime = 0;
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  function syncCenteredVideos(track) {
    var active = 0;
    var stepMs = 2600;
    var playMs = 2000;
    var preRollMs = 260;

    playCenteredVideo(track, active);
    if (reduce) return;

    window.setTimeout(function () {
      pauseSliderVideos(track);
    }, playMs);

    function scheduleNext(delay) {
      var next = (active + 1) % 4;

      window.setTimeout(function () {
        active = next;
        playCenteredVideo(track, active);

        window.setTimeout(function () {
          pauseSliderVideos(track);
        }, playMs + preRollMs);
        scheduleNext(stepMs);
      }, delay);
    }

    scheduleNext(stepMs - preRollMs);
  }

  sliderTracks.forEach(function (track) {
    if (track.dataset.cloned !== 'true') {
      var slides = Array.prototype.slice.call(track.children);

      slides.forEach(function (slide, index) {
        slide.dataset.slideIndex = String(index);
      });

      var firstClone = slides[0].cloneNode(true);
      var lastClone = slides[slides.length - 1].cloneNode(true);
      firstClone.setAttribute('aria-hidden', 'true');
      lastClone.setAttribute('aria-hidden', 'true');
      firstClone.dataset.slideIndex = '0';
      lastClone.dataset.slideIndex = String(slides.length - 1);

      track.insertBefore(lastClone, slides[0]);
      track.appendChild(firstClone);
      track.dataset.cloned = 'true';
    }

    setSliderStep(track);
    syncCenteredVideos(track);
  });
  window.addEventListener('resize', function () {
    sliderTracks.forEach(setSliderStep);
  });

  /* ----- Demo-only contact form ----- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('formStatus');
      if (status) {
        status.hidden = false;
        status.textContent = 'This is a demonstration form — submissions are not yet wired to a backend. We will connect it before launch.';
        status.focus();
      }
    });
  }
})();
