/**
 * Main JavaScript - SYIA Portfolio
 * Faithfully reproduces yoichiochiai.com interactions with SYIA customizations
 */
(function () {
  'use strict';

  // ========================================
  // Detect page type
  // ========================================
  const isHomePage = document.querySelector('.top-header') !== null;
  const isSubPage = !isHomePage;

  // ========================================
  // Loading Screen with EEG Brainwave + SYIA Mask
  // ========================================
  const loading = document.getElementById('loading');
  const eegCanvas = document.getElementById('loadingEeg');

  // EEG brainwave animation – small area near top-left note icon
  if (eegCanvas) {
    var eegCtx = eegCanvas.getContext('2d');
    var eegW, eegH;
    var eegTime = 0;
    var eegRunning = true;
    var eegChannels = 3; // fewer channels for small area
    var eegAmplitudes = [];
    var eegPhases = [];
    var eegFreqs = [];

    for (var ch = 0; ch < eegChannels; ch++) {
      eegAmplitudes.push(4 + Math.random() * 6);
      eegPhases.push(Math.random() * Math.PI * 2);
      eegFreqs.push(1.2 + Math.random() * 2.5);
    }

    function resizeEeg() {
      var dpr = window.devicePixelRatio || 1;
      // Use the canvas element's CSS-computed size
      eegW = eegCanvas.offsetWidth;
      eegH = eegCanvas.offsetHeight;
      eegCanvas.width = eegW * dpr;
      eegCanvas.height = eegH * dpr;
      eegCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeEeg();
    window.addEventListener('resize', function () {
      if (eegRunning) resizeEeg();
    });

    function drawEeg() {
      if (!eegRunning) return;
      eegCtx.clearRect(0, 0, eegW, eegH);

      var channelSpacing = eegH / (eegChannels + 1);

      for (var ch = 0; ch < eegChannels; ch++) {
        var baseY = channelSpacing * (ch + 1);
        var amp = eegAmplitudes[ch];
        var phase = eegPhases[ch];
        var freq = eegFreqs[ch];

        eegCtx.beginPath();
        eegCtx.strokeStyle = 'rgba(243,243,243,' + (0.18 + ch * 0.08) + ')';
        eegCtx.lineWidth = 0.8;

        for (var x = 0; x < eegW; x++) {
          var t = (x / eegW) * Math.PI * 6;
          var y = baseY +
            Math.sin(t * freq + eegTime * 2.5 + phase) * amp * 0.5 +
            Math.sin(t * freq * 2.3 + eegTime * 3.1 + phase * 1.5) * amp * 0.25 +
            Math.sin(t * freq * 0.7 + eegTime * 1.2 + phase * 0.8) * amp * 0.3 +
            Math.sin(t * freq * 4.1 + eegTime * 5 + phase * 2) * amp * 0.08 +
            (Math.random() - 0.5) * 1;

          if (x === 0) {
            eegCtx.moveTo(x, y);
          } else {
            eegCtx.lineTo(x, y);
          }
        }
        eegCtx.stroke();
      }

      eegTime += 0.025;
      requestAnimationFrame(drawEeg);
    }
    drawEeg();
  }

  function hideLoading() {
    if (!loading) return;
    eegRunning = false;
    loading.classList.add('is-hidden');
    document.body.classList.add('is-loaded');
    setTimeout(function () {
      loading.style.display = 'none';
    }, 800);
  }

  if (isHomePage) {
    // Home page: show loading, then reveal after delay
    window.addEventListener('load', function () {
      setTimeout(hideLoading, 2200);
    });
    // Failsafe
    setTimeout(hideLoading, 5000);
  } else {
    // Sub pages: already has is-loaded, hide loading quickly
    setTimeout(function () {
      if (loading) {
        eegRunning = false;
        loading.classList.add('is-hidden');
        setTimeout(function () { loading.style.display = 'none'; }, 600);
      }
    }, 800);
  }

  // ========================================
  // Page Title Reveal Animation
  // ========================================
  var titleAnims = document.querySelectorAll('.page-title-anim');
  if (titleAnims.length) {
    setTimeout(function () {
      titleAnims.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }, 300);
  }

  // ========================================
  // Menu Open / Close
  // ========================================
  var menu = document.querySelector('.menu');
  var menuOpenBtn = document.querySelector('.header__button');
  var menuCloseBtn = document.querySelector('.menu__button');

  if (menuOpenBtn && menu) {
    menuOpenBtn.addEventListener('click', function () {
      menu.classList.add('is-open');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          menu.classList.add('is-visible');
        });
      });
      document.body.style.overflow = 'hidden';
    });
  }
  if (menuCloseBtn && menu) {
    menuCloseBtn.addEventListener('click', function () {
      menu.classList.remove('is-visible');
      setTimeout(function () {
        menu.classList.remove('is-open');
        document.body.style.overflow = '';
      }, 500);
    });
  }

  // ========================================
  // Language Toggle
  // ========================================
  var langJaBtn = document.querySelector('.menu__information__lang__button--ja');
  var langEnBtn = document.querySelector('.menu__information__lang__button--en');
  var menuInfo = document.querySelector('.menu__information');

  function setLanguage(lang) {
    if (!menuInfo) return;
    menuInfo.classList.remove('menu__information--ja', 'menu__information--en');
    menuInfo.classList.add('menu__information--' + lang);
    if (langJaBtn) langJaBtn.classList.toggle('is-active', lang === 'ja');
    if (langEnBtn) langEnBtn.classList.toggle('is-active', lang === 'en');
  }
  // Initialize to Japanese
  if (menuInfo && !menuInfo.classList.contains('menu__information--ja') && !menuInfo.classList.contains('menu__information--en')) {
    setLanguage('ja');
  }
  if (langJaBtn) langJaBtn.addEventListener('click', function () { setLanguage('ja'); });
  if (langEnBtn) langEnBtn.addEventListener('click', function () { setLanguage('en'); });

  // ========================================
  // Menu Background Slide
  // ========================================
  var slides = document.querySelectorAll('.menu__information__background__slide');
  var currentSlide = 0;
  if (slides.length > 0) {
    slides[0].classList.add('is-active');
    setInterval(function () {
      slides[currentSlide].classList.remove('is-active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('is-active');
    }, 4000);
  }

  // ========================================
  // Nav Trigger Eighth Note (Desktop left-side)
  // ========================================
  var navTrigger = document.querySelector('.header__nav-trigger');
  var headerNav = document.querySelector('.header__nav');
  var navList = document.querySelector('.header__nav__list');
  var navVisible = false;

  if (navList) {
    var hasCurrent = navList.querySelector('.is-current');
    if (hasCurrent) navList.classList.add('has-current');
  }

  if (navTrigger && headerNav) {
    // Show note icon after a delay (on subpages quickly, on home after loading)
    var dotDelay = isHomePage ? 2800 : 800;
    setTimeout(function () {
      navTrigger.classList.add('is-visible');
    }, dotDelay);

    navTrigger.addEventListener('click', function () {
      navVisible = !navVisible;
      if (navVisible) {
        headerNav.classList.add('is-visible');
        navTrigger.classList.add('is-hidden');
      } else {
        headerNav.classList.remove('is-visible');
        navTrigger.classList.remove('is-hidden');
      }
    });

    // Close nav when clicking outside
    document.addEventListener('click', function (e) {
      if (navVisible && !headerNav.contains(e.target) && e.target !== navTrigger) {
        navVisible = false;
        headerNav.classList.remove('is-visible');
        navTrigger.classList.remove('is-hidden');
      }
    });
  }

  // ========================================
  // Autograph Canvas (Front page only)
  // ========================================
  var autographCanvas = document.getElementById('autographCanvas');
  if (autographCanvas) {
    var ctx = autographCanvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
      var rect = autographCanvas.getBoundingClientRect();
      autographCanvas.width = rect.width * dpr;
      autographCanvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      drawSignature(1);
    }

    function drawSignature(progress) {
      var w = autographCanvas.getBoundingClientRect().width;
      var h = autographCanvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w * progress, h);
      ctx.clip();
      ctx.strokeStyle = '#f3f3f3';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      var sx = w * 0.05, sy = h * 0.3;
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(w*0.1, h*0.5, w*0.08, h*0.6);
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(w*0.15, h*0.15, w*0.18, h*0.3);
      ctx.quadraticCurveTo(w*0.2, h*0.5, w*0.15, h*0.7);
      ctx.moveTo(w*0.18, h*0.5);
      ctx.bezierCurveTo(w*0.25,h*0.3, w*0.35,h*0.6, w*0.45,h*0.35);
      ctx.bezierCurveTo(w*0.55,h*0.15, w*0.6,h*0.55, w*0.7,h*0.4);
      ctx.bezierCurveTo(w*0.8,h*0.25, w*0.85,h*0.5, w*0.95,h*0.35);
      ctx.moveTo(w*0.1, h*0.8);
      ctx.bezierCurveTo(w*0.3,h*0.75, w*0.6,h*0.78, w*0.9,h*0.72);
      ctx.stroke();
      ctx.beginPath();
      ctx.globalAlpha = 0.6;
      ctx.arc(w*0.92, h*0.5, 2, 0, Math.PI*2);
      ctx.fillStyle = '#f3f3f3';
      ctx.fill();
      ctx.restore();
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animate drawing
    var drawProgress = 0;
    function animateDraw() {
      drawProgress += 0.015;
      if (drawProgress >= 1) { drawSignature(1); return; }
      drawSignature(drawProgress);
      requestAnimationFrame(animateDraw);
    }
    setTimeout(animateDraw, 2000);
  }

  // ========================================
  // YouTube Background Video (Home page)
  // ========================================
  var playerEl = document.getElementById('player');
  if (playerEl && isHomePage) {
    var backgroundPlayer = null;

    // Create fallback background
    var fallback = document.createElement('div');
    fallback.className = 'top-background-video__fallback';
    fallback.style.backgroundImage = "url('https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1600&q=80')";
    fallback.style.opacity = '0';
    fallback.style.transition = 'opacity 2s ease';
    playerEl.parentElement.appendChild(fallback);
    setTimeout(function () { fallback.style.opacity = '0.35'; }, 2000);

    // Load YouTube API
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(tag, firstScript);

    var toggleSound = function () {
      if (!backgroundPlayer) return;
      if (backgroundPlayer.isMuted()) {
        backgroundPlayer.unMute();
      } else {
        backgroundPlayer.mute();
      }
    };

    playerEl.parentElement.title = 'Click to toggle sound';
    playerEl.parentElement.addEventListener('click', toggleSound);
    playerEl.addEventListener('click', toggleSound);

    window.onYouTubeIframeAPIReady = function () {
      backgroundPlayer = new YT.Player('player', {
        videoId: 'ye4q25buANs',
        playerVars: {
          autoplay: 1, mute: 1, controls: 0, loop: 1,
          playlist: 'ye4q25buANs', modestbranding: 1, rel: 0,
          showinfo: 0, playsinline: 1, disablekb: 1, iv_load_policy: 3,
          origin: window.location.origin
        },
        events: {
          onReady: function (e) {
            e.target.setPlaybackQuality('hd720');
            e.target.mute();
            if (fallback) {
              fallback.style.opacity = '0';
              setTimeout(function () { fallback.remove(); }, 2000);
            }
          },
          onStateChange: function (e) {
            if (e.data === YT.PlayerState.ENDED) e.target.playVideo();
          }
        }
      });
    };
  }

  // ========================================
  // Scroll Reveal
  // ========================================
  function setupScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(function (el) { observer.observe(el); });
  }
  window.addEventListener('load', setupScrollReveal);

  // ========================================
  // Particle Background (Front page only)
  // ========================================
  var canvasEl = document.getElementById('canvas');
  if (canvasEl && isHomePage) {
    var cvs = document.createElement('canvas');
    cvs.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0';
    canvasEl.appendChild(cvs);
    var pCtx = cvs.getContext('2d');
    var particles = [];
    var N = 30;

    function resizeParticles() { cvs.width = window.innerWidth; cvs.height = window.innerHeight; }
    resizeParticles();
    window.addEventListener('resize', resizeParticles);

    for (var i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.1
      });
    }

    function animateParticles() {
      pCtx.clearRect(0, 0, cvs.width, cvs.height);
      particles.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = cvs.width;
        if (p.x > cvs.width) p.x = 0;
        if (p.y < 0) p.y = cvs.height;
        if (p.y > cvs.height) p.y = 0;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        pCtx.fillStyle = 'rgba(243,243,243,' + p.alpha + ')';
        pCtx.fill();
      });
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            pCtx.beginPath();
            pCtx.moveTo(particles[a].x, particles[a].y);
            pCtx.lineTo(particles[b].x, particles[b].y);
            pCtx.strokeStyle = 'rgba(243,243,243,' + (0.05 * (1 - dist / 150)) + ')';
            pCtx.lineWidth = 0.5;
            pCtx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    setTimeout(animateParticles, 2000);
  }

  // ========================================
  // Information Page: Year Filter & Pagination
  // ========================================
  var archiveTrigger = document.getElementById('archiveTrigger');
  var archiveFilter = document.getElementById('archiveFilter');
  var archiveFilterClose = document.getElementById('archiveFilterClose');
  var archiveFilterList = document.getElementById('archiveFilterList');
  var archiveTriggerValue = document.getElementById('archiveTriggerValue');
  var informationFilteredValue = document.getElementById('informationFilteredValue');
  var informationList = document.getElementById('informationList');
  var pagerCount = document.getElementById('pagerCount');
  var pagerEl = document.getElementById('pager');
  var pagerContent = document.getElementById('pagerContent');

  if (archiveTrigger && archiveFilter) {
    // Toggle filter panel
    archiveTrigger.addEventListener('click', function () {
      archiveFilter.classList.toggle('is-open');
    });
    if (archiveFilterClose) {
      archiveFilterClose.addEventListener('click', function () {
        archiveFilter.classList.remove('is-open');
      });
    }
  }

  if (archiveFilterList && informationList) {
    var ITEMS_PER_PAGE = 6;
    var infoCurrentPage = 1;
    var allInfoItems = Array.from(informationList.querySelectorAll('li[data-year]'));
    var filteredInfoItems = allInfoItems.slice();

    function filterInfoByYear(year) {
      // Update filter UI
      archiveFilterList.querySelectorAll('a').forEach(function (a) {
        a.classList.toggle('is-selected', a.dataset.year === year);
      });

      // Update trigger value and filtered label
      var label = year === 'ALL' ? 'All' : year;
      if (archiveTriggerValue) archiveTriggerValue.textContent = label;
      if (informationFilteredValue) informationFilteredValue.textContent = label;

      // Filter items
      filteredInfoItems = [];
      allInfoItems.forEach(function (item) {
        if (year === 'ALL' || item.dataset.year === year) {
          filteredInfoItems.push(item);
        }
      });

      infoCurrentPage = 1;
      renderInfoPage();
      archiveFilter.classList.remove('is-open');
    }

    function renderInfoPage() {
      var totalPages = Math.max(1, Math.ceil(filteredInfoItems.length / ITEMS_PER_PAGE));
      if (infoCurrentPage > totalPages) infoCurrentPage = totalPages;
      var start = (infoCurrentPage - 1) * ITEMS_PER_PAGE;
      var end = start + ITEMS_PER_PAGE;

      // Hide all, show filtered page
      allInfoItems.forEach(function (item) { item.style.display = 'none'; });
      filteredInfoItems.slice(start, end).forEach(function (item) { item.style.display = ''; });

      // Pager count
      if (pagerCount) {
        pagerCount.textContent = 'Page ' + infoCurrentPage + '/' + totalPages;
        pagerCount.style.display = totalPages <= 1 ? 'none' : '';
      }

      // Build pagination
      if (pagerContent && pagerEl) {
        if (totalPages <= 1) {
          pagerEl.style.display = 'none';
          return;
        }
        pagerEl.style.display = '';

        var html = '<ul class="pager__list">';
        for (var i = 1; i <= totalPages; i++) {
          if (i === infoCurrentPage) {
            html += '<li><span class="page-numbers current">' + i + '</span></li>';
          } else if (i <= 3 || i === totalPages || Math.abs(i - infoCurrentPage) <= 1) {
            html += '<li><a class="page-numbers" href="#" data-page="' + i + '">' + i + '</a></li>';
          } else if ((i === 4 && infoCurrentPage > 5) || (i === totalPages - 1 && infoCurrentPage < totalPages - 3)) {
            html += '<li><span class="page-numbers dots">&hellip;</span></li>';
          }
        }
        html += '</ul>';
        html += '<div class="pager__separation">';
        if (infoCurrentPage > 1) {
          html += '<a class="pager__prev" href="#" data-page="' + (infoCurrentPage - 1) + '">Prev</a>';
        } else {
          html += '<span class="pager__prev">Prev</span>';
        }
        if (infoCurrentPage < totalPages) {
          html += '<a class="pager__next" href="#" data-page="' + (infoCurrentPage + 1) + '">Next</a>';
        } else {
          html += '<span class="pager__next">Next</span>';
        }
        html += '</div>';

        pagerContent.innerHTML = html;

        // Bind pager events
        pagerContent.querySelectorAll('a[data-page]').forEach(function (a) {
          a.addEventListener('click', function (e) {
            e.preventDefault();
            infoCurrentPage = parseInt(a.dataset.page);
            renderInfoPage();
            window.scrollTo({ top: 200, behavior: 'smooth' });
          });
        });
      }
    }

    // Bind year filter links
    archiveFilterList.querySelectorAll('a[data-year]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        filterInfoByYear(a.dataset.year);
      });
    });

    // Initial render
    renderInfoPage();
  }

  // ========================================
  // Art Page: Category & Year Filter
  // ========================================
  var artFilterBtn = document.getElementById('artFilterBtn');
  var artFilterContent = document.getElementById('artFilterContent');
  var artFilterClose = document.getElementById('artFilterClose');
  var artCategoryFilter = document.getElementById('artCategoryFilter');
  var artYearFilter = document.getElementById('artYearFilter');
  var artList = document.getElementById('artList');

  // Mobile filter toggle
  if (artFilterBtn && artFilterContent) {
    artFilterBtn.addEventListener('click', function () {
      artFilterContent.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (artFilterClose && artFilterContent) {
    artFilterClose.addEventListener('click', function () {
      artFilterContent.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  }

  if (artList) {
    var allArtItems = Array.from(artList.querySelectorAll('li[data-category]'));
    var selectedCategory = 'all';
    var selectedYear = null;

    function filterArtItems() {
      allArtItems.forEach(function (item) {
        var catMatch = selectedCategory === 'all' || item.dataset.category === selectedCategory;
        var yearMatch = !selectedYear || item.dataset.year === selectedYear;
        item.style.display = (catMatch && yearMatch) ? '' : 'none';
      });
    }

    // Category filter
    if (artCategoryFilter) {
      artCategoryFilter.querySelectorAll('a[data-category]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          selectedCategory = a.dataset.category;
          artCategoryFilter.querySelectorAll('a').forEach(function (el) {
            el.classList.toggle('is-selected', el.dataset.category === selectedCategory);
          });
          filterArtItems();
        });
      });
    }

    // Year filter
    if (artYearFilter) {
      artYearFilter.querySelectorAll('a[data-year]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          if (selectedYear === a.dataset.year) {
            // Deselect
            selectedYear = null;
            artYearFilter.querySelectorAll('a').forEach(function (el) { el.classList.remove('is-selected'); });
          } else {
            selectedYear = a.dataset.year;
            artYearFilter.querySelectorAll('a').forEach(function (el) {
              el.classList.toggle('is-selected', el.dataset.year === selectedYear);
            });
          }
          filterArtItems();
        });
      });
    }
  }

})();
