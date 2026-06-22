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

  /* ----- Draggable client logo stripe ----- */
  var logoMarquees = document.querySelectorAll('[data-logo-marquee]');

  function initLogoMarquee(marquee) {
    var track = marquee.querySelector('.marquee-track');
    if (!track) return;

    var offset = 0;
    var loopWidth = 0;
    var autoSpeed = reduce ? 0 : 34;
    var isDragging = false;
    var lastX = 0;
    var lastTime = 0;
    var velocity = 0;
    var previousFrame = null;

    function measure() {
      loopWidth = track.scrollWidth / 2;
      normalizeOffset();
      render();
    }

    function normalizeOffset() {
      if (!loopWidth) return;
      offset = ((offset % loopWidth) + loopWidth) % loopWidth;
      if (offset > 0) offset -= loopWidth;
    }

    function render() {
      track.style.setProperty('--marquee-x', offset + 'px');
    }

    function tick(timestamp) {
      if (previousFrame === null) previousFrame = timestamp;

      var delta = Math.min(timestamp - previousFrame, 48) / 1000;
      previousFrame = timestamp;

      if (!isDragging) {
        offset -= autoSpeed * delta;
        if (Math.abs(velocity) > 1) {
          offset += velocity * delta;
          velocity *= Math.pow(0.92, delta * 60);
        } else {
          velocity = 0;
        }
        normalizeOffset();
        render();
      }

      window.requestAnimationFrame(tick);
    }

    marquee.classList.add('is-draggable');
    track.querySelectorAll('img').forEach(function (image) {
      image.setAttribute('draggable', 'false');
    });

    marquee.addEventListener('pointerdown', function (event) {
      if (event.button !== undefined && event.button !== 0) return;

      isDragging = true;
      lastX = event.clientX;
      lastTime = event.timeStamp || performance.now();
      velocity = 0;
      marquee.classList.add('is-dragging');
      marquee.setPointerCapture(event.pointerId);
    });

    marquee.addEventListener('pointermove', function (event) {
      if (!isDragging) return;

      var now = event.timeStamp || performance.now();
      var deltaX = event.clientX - lastX;
      var deltaTime = Math.max(now - lastTime, 16);

      offset += deltaX;
      velocity = deltaX / deltaTime * 1000;
      lastX = event.clientX;
      lastTime = now;

      normalizeOffset();
      render();
    });

    function endDrag(event) {
      if (!isDragging) return;

      isDragging = false;
      marquee.classList.remove('is-dragging');
      if (marquee.hasPointerCapture(event.pointerId)) {
        marquee.releasePointerCapture(event.pointerId);
      }
    }

    marquee.addEventListener('pointerup', endDrag);
    marquee.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', measure);

    measure();
    window.requestAnimationFrame(tick);
  }

  logoMarquees.forEach(initLogoMarquee);

  /* ----- Proof stats counters ----- */
  var statFigures = document.querySelectorAll('.stat-figure');
  var counterDuration = 1200;

  function animateStatFigure(figure) {
    if (figure.dataset.counted === 'true') return;

    var match = figure.textContent.match(/\d+/);
    if (!match) return;

    var target = parseInt(match[0], 10);
    var textNode = Array.prototype.find.call(figure.childNodes, function (node) {
      return node.nodeType === Node.TEXT_NODE && /\d+/.test(node.nodeValue);
    });
    if (!textNode) return;

    figure.dataset.counted = 'true';
    if (reduce) {
      textNode.nodeValue = String(target);
      return;
    }

    var startTime = null;
    textNode.nodeValue = '0';

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;

      var progress = Math.min((timestamp - startTime) / counterDuration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      textNode.nodeValue = String(Math.round(target * eased));

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        textNode.nodeValue = String(target);
      }
    }

    window.requestAnimationFrame(tick);
  }

  if (reduce || !('IntersectionObserver' in window)) {
    statFigures.forEach(animateStatFigure);
  } else {
    var statIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStatFigure(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.45 });
    statFigures.forEach(function (figure) { statIo.observe(figure); });
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

  /* ----- Testimonials slider ----- */
  var testimonialSlider = document.querySelector('[data-testimonial-slider]');
  if (testimonialSlider) {
    var testimonialSlides = Array.prototype.slice.call(testimonialSlider.querySelectorAll('[data-testimonial-slide]'));
    var testimonialDots = Array.prototype.slice.call(document.querySelectorAll('[data-testimonial-dot]'));
    var testimonialIndex = 0;
    var testimonialTimer = null;
    var testimonialDelay = 5600;

    function showTestimonial(index) {
      testimonialIndex = (index + testimonialSlides.length) % testimonialSlides.length;

      testimonialSlides.forEach(function (slide, slideIndex) {
        var active = slideIndex === testimonialIndex;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      testimonialDots.forEach(function (dot, dotIndex) {
        var active = dotIndex === testimonialIndex;
        dot.classList.toggle('is-active', active);
        if (active) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });
    }

    function queueNextTestimonial() {
      if (reduce || testimonialSlides.length < 2) return;

      window.clearInterval(testimonialTimer);
      testimonialTimer = window.setInterval(function () {
        showTestimonial(testimonialIndex + 1);
      }, testimonialDelay);
    }

    testimonialDots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showTestimonial(index);
        queueNextTestimonial();
      });
    });

    showTestimonial(0);
    queueNextTestimonial();
  }

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

  /* ----- News archive filters ----- */
  var newsFilters = document.querySelectorAll('[data-news-filter]');
  var newsItems = document.querySelectorAll('#newsGrid [data-news-item]');
  var newsEmpty = document.getElementById('newsEmpty');
  if (newsFilters.length && newsItems.length) {
    newsFilters.forEach(function (button) {
      button.addEventListener('click', function () {
        var category = button.dataset.newsFilter;
        var visible = 0;

        newsFilters.forEach(function (item) {
          var active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        newsItems.forEach(function (item) {
          var show = category === 'all' || item.dataset.category === category;
          item.hidden = !show;
          if (show) visible += 1;
        });

        if (newsEmpty) newsEmpty.hidden = visible !== 0;
      });
    });
  }

  /* ----- Demo-only newsletter form ----- */
  var newsletter = document.querySelector('.newsletter-form');
  if (newsletter) {
    newsletter.addEventListener('submit', function (event) {
      event.preventDefault();
      var button = newsletter.querySelector('button');
      if (button) {
        button.textContent = 'Thank you';
        button.disabled = true;
      }
    });
  }
})();
