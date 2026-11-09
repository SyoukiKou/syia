/**
 * Main JavaScript - SYIA Portfolio
 * Faithfully reproduces yoichiochiai.com interactions with SYIA customizations
 */
(function () {
  'use strict';

  // ========================================
  // Detect page type
  // ========================================
  const isHomePage = document.querySelector('.hero') !== null;
  const isSubPage = !isHomePage;

  // ========================================
  // Loading Screen (sub pages): the home page's opening, in short.
  // Five staff lines are drawn across the screen, then come apart into five-line fragments
  // that drift off and fade while the page shows through.
  // ========================================
  const loading = document.getElementById('loading');
  const staffCanvas = document.getElementById('loadingStaff');
  var LOAD_DRAW = .8, LOAD_OUT = .8;   // seconds: drawing the staff, coming apart
  var revealAt = 300;                  // when the page title rises (ms)

  if (loading && staffCanvas && staffCanvas.getContext) {
    var reduceLoad = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    revealAt = reduceLoad ? 300 : (LOAD_DRAW + .15) * 1000;
    if (reduceLoad) {
      setTimeout(function () { loading.classList.add('is-hidden'); }, 200);
      setTimeout(function () { loading.style.display = 'none'; }, 1000);
    } else {
      var sctx = staffCanvas.getContext('2d');
      var lw = staffCanvas.clientWidth, lh = staffCanvas.clientHeight, ldpr = Math.min(window.devicePixelRatio || 1, 2);
      staffCanvas.width = Math.round(lw * ldpr); staffCanvas.height = Math.round(lh * ldpr);
      var staffColors = ['78,98,204', '124,138,230', '176,172,236', '222,224,250', '246,246,255'];
      var rowGap = Math.max(lh * .04, 24), rowY = lh * .5, frags = [], specks = [];
      var fragCount = Math.round(lw / 5);
      for (var fi = 0; fi < fragCount; fi++) {
        var rows = [0, 1, 2, 3, 4];
        while (rows.length > 3 + Math.floor(Math.random() * 3)) rows.splice(Math.floor(Math.random() * rows.length), 1);
        frags.push({
          x: fi / fragCount * lw * 1.12 - lw * .04, delay: Math.random(), bx: Math.random() * 2 - 1, by: Math.random() * 2 - 1,
          lines: rows.map(function (r) { return { row: r, len: 6 + Math.random() * 40, color: staffColors[Math.floor(Math.random() * 5)] }; })
        });
      }
      for (var si = 0; si < fragCount / 3; si++) {
        specks.push({ x: Math.random() * lw * 1.1 - lw * .05, row: Math.floor(Math.random() * 5), delay: Math.random(), bx: Math.random() * 2 - 1, by: Math.random() * 2 - 1, size: 1 + Math.random() * 1.8 });
      }
      var loadEase = function (x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); };
      var loadStart = 0, loadHidden = false;
      var drawStaff = function (now) {
        if (!loadStart) loadStart = now;
        var t = (now - loadStart) / 1000, drawn = loadEase(t / LOAD_DRAW), edge = drawn * lw * 1.05 - lw * .05;
        sctx.setTransform(ldpr, 0, 0, ldpr, 0, 0);
        sctx.clearRect(0, 0, lw, lh);
        sctx.lineCap = 'round';
        sctx.lineWidth = lw < 769 ? 1 : 1.3;
        frags.forEach(function (f) {
          if (f.x > edge) return;
          var e = loadEase((t - LOAD_DRAW - f.delay * .35) / LOAD_OUT), e1 = loadEase(e / .6);
          var dx = f.bx * lw * .06 * e, dy = (f.by * .22 - .05) * lh * e, gap = rowGap * (1 - .7 * e1);
          sctx.globalAlpha = .92 * (1 - loadEase((e - .35) / .65));
          f.lines.forEach(function (l) {
            var y = rowY + (l.row - 2) * gap + dy, x = f.x + dx;
            sctx.strokeStyle = 'rgb(' + l.color + ')';
            sctx.beginPath(); sctx.moveTo(x, y); sctx.lineTo(x + l.len * (1 - .3 * e), y); sctx.stroke();
          });
        });
        sctx.fillStyle = '#eef0ff';
        specks.forEach(function (p) {
          if (p.x > edge) return;
          var e = loadEase((t - LOAD_DRAW - p.delay * .35) / LOAD_OUT);
          sctx.globalAlpha = (.5 + .4 * Math.sin(t * 6 + p.x)) * (1 - e);
          sctx.beginPath();
          sctx.arc(p.x + p.bx * lw * .06 * e, rowY + (p.row - 2) * rowGap + (p.by * .22 - .05) * lh * e, p.size, 0, Math.PI * 2);
          sctx.fill();
        });
        sctx.globalAlpha = 1;
        if (!loadHidden && t > LOAD_DRAW + .15) { loadHidden = true; loading.classList.add('is-hidden'); }
        if (t < LOAD_DRAW + LOAD_OUT + .5) requestAnimationFrame(drawStaff);
        else loading.style.display = 'none';
      };
      requestAnimationFrame(drawStaff);
    }
  }

  // ========================================
  // Concerts (js/concerts.js) and news (js/information.js)
  // The Concert list, each concert's own page (concert/<id>), the Information list and the home page's
  // latest concerts are written as HTML by scripts/build.mjs. Here: the latest items in the menu,
  // old concert#id addresses, and the frame of pictures whose size the build could not read.
  // ========================================
  var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var byDateDesc = function (a, b) { return String(b.date).localeCompare(String(a.date)); };
  var concerts = (window.SYIA_CONCERTS || []).filter(function (c) { return c && c.id; }).sort(byDateDesc);
  var news = (window.SYIA_INFORMATION || []).filter(function (n) { return n && n.date && n.title; }).sort(byDateDesc);

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  // 2026-10-24 -> "2026.10/24 (Sat)"; with dateEnd, "2025.11/22 (Sat) – 12/25 (Thu)" (the year again only if it changes)
  function concertDate(c) {
    if (c.dateText) return c.dateText;
    var day = function (iso, withYear) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
      if (!m) return iso || '';
      var wd = WEEKDAYS[new Date(+m[1], +m[2] - 1, +m[3]).getDay()];
      return (withYear ? m[1] + '.' : '') + m[2] + '/' + m[3] + ' (' + wd + ')';
    };
    var text = day(c.date, true);
    if (c.dateEnd) text += ' – ' + day(c.dateEnd, String(c.dateEnd).slice(0, 4) !== String(c.date).slice(0, 4));
    return text;
  }
  function concertUrl(c) { return 'concert/' + encodeURIComponent(c.id); }
  // links written the old way (concert#id) go to the concert's own page
  function siteUrl(url) { return String(url).replace(/^\/?concert#([A-Za-z0-9-]+)$/, 'concert/$1'); }

  // tall pictures (flyers) and middling ones are shown narrower than wide banners
  // (the build already does this for every picture whose size it can read)
  function sizeFigures(root) {
    root.querySelectorAll('.article__figure img').forEach(function (img) {
      var fit = function () {
        var w = img.naturalWidth, h = img.naturalHeight;
        if (!w) return;
        img.parentNode.classList.toggle('article__figure--portrait', h > w * 1.1);
        img.parentNode.classList.toggle('article__figure--medium', h <= w * 1.1 && w < h * 2.2);
      };
      if (img.complete) fit(); else img.addEventListener('load', fit);
    });
  }

  // latest in the menu (every page): news and concerts together, newest first
  var latest = news.map(function (n) { return { date: n.date, dateEnd: n.dateEnd, dateText: n.dateText, title: n.title, titleEn: n.titleEn, url: n.link ? siteUrl(n.link) : 'information' }; })
    .concat(concerts.map(function (c) { return { date: c.date, dateEnd: c.dateEnd, dateText: c.dateText, title: c.title, titleEn: c.titleEn, url: concertUrl(c) }; }))
    .sort(byDateDesc).slice(0, 3);
  document.querySelectorAll('.menu__information__list').forEach(function (ul) {
    ul.innerHTML = latest.map(function (c) {
      return '<li><a href="' + escapeHtml(c.url) + '"><p class="menu__information__list__date"><time datetime="' + escapeHtml(c.date) + '">' + escapeHtml(concertDate(c)) + '</time></p>' +
        '<p class="menu__information__list__title menu__information__list__title--ja">' + escapeHtml(c.title) + '</p>' +
        '<p class="menu__information__list__title menu__information__list__title--en">' + escapeHtml(c.titleEn || c.title) + '</p></a></li>';
    }).join('');
  });

  // Concert list: an old address ending in #id (concert#fccj2025, shared before each concert had its own page)
  // opens that concert's page
  if (document.getElementById('concertList') && location.hash.length > 1) {
    var oldId = '';
    try { oldId = decodeURIComponent(location.hash.slice(1)); } catch (e) { /* not an id */ }
    if (concerts.some(function (c) { return c.id === oldId; })) location.replace(concertUrl({ id: oldId }));
  }
  var concertDetail = document.getElementById('concertDetail');
  if (concertDetail) sizeFigures(concertDetail);

  // ========================================
  // Page Title Reveal Animation
  // ========================================
  var titleAnims = document.querySelectorAll('.page-title-anim');
  if (titleAnims.length) {
    setTimeout(function () {
      titleAnims.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }, revealAt);
  }

  // ========================================
  // Night sky: quietly twinkling stars behind every page and inside the menu
  // ========================================
  var stillSky = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var starSprite = document.createElement('canvas');
  starSprite.width = starSprite.height = 32;
  (function () {
    var c = starSprite.getContext('2d'), g = c.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(.25, 'rgba(236,238,255,.85)');
    g.addColorStop(.55, 'rgba(176,192,255,.28)');
    g.addColorStop(1, 'rgba(176,192,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, 32, 32);
  })();

  function starfield(parent) {
    var canvas = document.createElement('canvas');
    canvas.className = 'stars';
    canvas.setAttribute('aria-hidden', 'true');
    parent.insertBefore(canvas, parent.firstChild);
    var c = canvas.getContext('2d'), stars = [], w = 0, h = 0, dpr = 1, raf = 0, running = false;
    function size() {
      w = canvas.clientWidth; h = canvas.clientHeight; dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      stars = [];
      for (var i = Math.round(w * h / 6500); i > 0; i--) {
        var big = Math.random() < .08;   // a few brighter ones with a soft glow, like the specks round the violin
        stars.push({ x: Math.random() * w, y: Math.random() * h, r: big ? 5 + Math.random() * 7 : .35 + Math.random() * .85,
          a: big ? .45 + Math.random() * .4 : .12 + Math.random() * .5, speed: .3 + Math.random() * 1.4, phase: Math.random() * 6.3, big: big });
      }
    }
    function draw(t) {
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, w, h);
      c.fillStyle = '#e8ecff';
      stars.forEach(function (s) {
        c.globalAlpha = s.a * (stillSky ? .8 : .55 + .45 * Math.sin(t / 1000 * s.speed + s.phase));
        if (s.big) c.drawImage(starSprite, s.x - s.r / 2, s.y - s.r / 2, s.r, s.r);
        else { c.beginPath(); c.arc(s.x, s.y, s.r, 0, Math.PI * 2); c.fill(); }
      });
      c.globalAlpha = 1;
    }
    function loop(t) { draw(t); raf = running && !document.hidden && !stillSky ? requestAnimationFrame(loop) : 0; }
    function start() { running = true; if (!w) size(); if (!raf) raf = requestAnimationFrame(loop); }
    window.addEventListener('resize', function () { if (running) { size(); draw(performance.now()); } });
    document.addEventListener('visibilitychange', function () { if (running && !raf) raf = requestAnimationFrame(loop); });
    return { start: start, stop: function () { running = false; } };
  }

  var pageSky = document.getElementById('canvas');   // sub pages: fixed layer behind the content
  if (pageSky) starfield(pageSky).start();
  var menuEl = document.querySelector('.menu');
  if (menuEl && window.MutationObserver) {
    var menuSky = starfield(menuEl);
    new MutationObserver(function () {
      if (menuEl.classList.contains('is-open')) menuSky.start(); else menuSky.stop();
    }).observe(menuEl, { attributes: true, attributeFilter: ['class'] });
  }

  // ========================================
  // Header: a backdrop once the page scrolls (the body is the scroller on this site)
  // ========================================
  function onPageScroll() {
    document.body.classList.toggle('is-scrolled', (document.body.scrollTop || window.pageYOffset) > 40);
  }
  document.body.addEventListener('scroll', onPageScroll, { passive: true });
  window.addEventListener('scroll', onPageScroll, { passive: true });
  onPageScroll();

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
  // Scroll Reveal
  // ========================================
  var revealObserver;
  function revealIn(root) {
    var reveals = root.querySelectorAll('.reveal:not(.is-visible)');
    if (!reveals.length) return;
    if (!('IntersectionObserver' in window)) { reveals.forEach(function (el) { el.classList.add('is-visible'); }); return; }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    }
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }
  window.addEventListener('load', function () { revealIn(document); });

  // ========================================
  // Contact Form (Contact, Lesson)
  // Sent to /api/contact (api/contact.js, a Vercel Function), which mails it to syiaviolin@gmail.com.
  // If that fails, the visitor gets a link that opens their mail app with what they wrote
  // ========================================
  var CONTACT_MAIL = 'syiaviolin@gmail.com';
  document.querySelectorAll('.contact-form').forEach(function (form) {
    var button = form.querySelector('.contact-form__submit');
    var note = form.querySelector('.contact-form__note');
    var buttonLabel = button ? button.textContent : '';
    var sending = false;
    var value = function (name) {
      return form.elements[name] ? form.elements[name].value.trim() : '';
    };
    var showNote = function (html, isError) {
      if (!note) return;
      note.innerHTML = html;
      note.classList.toggle('contact-form__note--error', !!isError);
      note.hidden = false;
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;
      var data = {
        name: value('name'),
        email: value('email'),
        subject: value('subject'),
        message: value('message'),
        form: form.dataset.subject || 'お問い合わせ',
        website: value('website')
      };
      sending = true;
      if (button) { button.disabled = true; button.textContent = 'Sending…'; }
      if (note) note.hidden = true;
      var controller = window.AbortController ? new AbortController() : null;
      var timer = controller ? setTimeout(function () { controller.abort(); }, 20000) : 0;
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller ? controller.signal : undefined
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (json) {
          if (!res.ok || !json.ok) throw new Error(json.error || ('HTTP ' + res.status));
        });
      }).then(function () {
        form.reset();
        showNote('送信しました。お問い合わせありがとうございます。<br>内容を確認のうえ、ご入力のメールアドレスへご連絡いたします。');
      }).catch(function () {
        var mailto = 'mailto:' + CONTACT_MAIL +
          '?subject=' + encodeURIComponent(data.subject || data.form) +
          '&body=' + encodeURIComponent(data.message + '\n\n' + data.name + '\n' + data.email);
        showNote('送信できませんでした。お手数ですが、<a href="' + escapeHtml(mailto) + '">メールアプリで送る</a>か、' +
          '<a href="mailto:' + CONTACT_MAIL + '">' + CONTACT_MAIL + '</a> まで直接ご連絡ください。', true);
      }).then(function () {
        clearTimeout(timer);
        sending = false;
        if (button) { button.disabled = false; button.textContent = buttonLabel; }
      });
    });
  });

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
