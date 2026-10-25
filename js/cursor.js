/**
 * Cursor - SYIA Portfolio
 * A calm glow on the pointer (like the specks of light around the violin) and a shooting star:
 * a bright head with a long pale-blue tail along the pointer's recent path, stardust falling
 * from the tail, and a twinkle on click.
 * Mouse and pen only: touch screens and reduced motion keep the normal cursor.
 */
(function () {
  'use strict';

  if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var LIFE = 700;          // ms a point of the tail stays
  var MAX_POINTS = 64;
  // tail layers, widest first: [width at the head (px), width at the tail, opacity, colour]
  var LAYERS = [[18, 1.5, .07, '120,146,255'], [6.5, .6, .4, '176,198,255'], [2.6, .3, .95, '255,255,255']];
  var DUST = ['255,255,255', '214,226,255', '176,198,255'];

  // ----- elements -----
  var wrap = document.createElement('div');
  wrap.className = 'cursor';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = '<canvas class="cursor__trail"></canvas><div class="cursor__glow"></div>';
  document.body.appendChild(wrap);
  document.documentElement.classList.add('has-cursor');

  var canvas = wrap.querySelector('.cursor__trail'), ctx = canvas.getContext('2d');
  var glow = wrap.querySelector('.cursor__glow');
  var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0;
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  // ----- state -----
  var pointer = { x: W / 2, y: H / 2 };
  var path = [], sparks = [], clicks = [];
  var shown = false, raf = 0, quietSince = 0;

  function show(on) {
    shown = on;
    glow.style.opacity = on ? '1' : '0';
  }

  // the glow opens up a little over links and buttons
  function setLink(target) {
    glow.classList.toggle('is-link', !!(target && target.closest && target.closest('a, button, label, [role="button"]')));
  }

  function wake() { if (!raf) raf = requestAnimationFrame(frame); }

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    pointer.x = e.clientX; pointer.y = e.clientY;
    glow.style.transform = 'translate(' + pointer.x + 'px,' + pointer.y + 'px) translate(-50%,-50%)';
    if (e.target && e.target.tagName === 'IFRAME') { show(false); return; }   // maps and videos keep their own cursor
    if (!shown) show(true);
    setLink(e.target);
    path.push({ x: pointer.x, y: pointer.y, t: performance.now() });
    if (path.length > MAX_POINTS) path.shift();
    wake();
  }, { passive: true });
  window.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch') return;
    clicks.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    wake();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', function () { show(false); });
  window.addEventListener('blur', function () { show(false); });
  window.addEventListener('resize', resize);

  // ----- drawing -----
  function frame() {
    var now = performance.now(), i, k;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';

    // the tail: fades and narrows away from the head
    var live = path.filter(function (p) { return now - p.t < LIFE; });
    if (live.length > 2) {
      var n = live.length, head = live[n - 1], back = live[Math.max(0, n - 4)];
      var mx = head.x - back.x, my = head.y - back.y, speed = Math.min(1, Math.hypot(mx, my) / 60);
      LAYERS.forEach(function (layer) {
        for (i = 1; i < n - 1; i++) {
          var a = live[i - 1], p = live[i], b = live[i + 1];
          var along = i / (n - 1), fade = 1 - (now - p.t) / LIFE, w = along * along;
          ctx.strokeStyle = 'rgba(' + layer[3] + ',' + (layer[2] * fade * along).toFixed(3) + ')';
          ctx.lineWidth = Math.max(.3, (layer[1] + (layer[0] - layer[1]) * w) * fade);
          ctx.beginPath();
          ctx.moveTo((a.x + p.x) / 2, (a.y + p.y) / 2);
          ctx.quadraticCurveTo(p.x, p.y, (p.x + b.x) / 2, (p.y + b.y) / 2);
          ctx.stroke();
        }
      });
      // the head: a soft white glow while it moves
      var hr = 4 + 8 * speed, glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, hr);
      glow.addColorStop(0, 'rgba(255,255,255,' + (.55 * speed + .15) + ')');
      glow.addColorStop(.4, 'rgba(200,214,255,' + (.25 * speed) + ')');
      glow.addColorStop(1, 'rgba(160,180,255,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(head.x, head.y, hr, 0, Math.PI * 2); ctx.fill();
      // stardust shed from the tail
      if (speed > .15 && sparks.length < 70 && Math.random() < .5 + speed * .5) {
        var from = live[Math.floor(n * (.55 + Math.random() * .4))];
        sparks.push({ x: from.x + (Math.random() - .5) * 4, y: from.y + (Math.random() - .5) * 4,
          vx: -mx * .01 + (Math.random() - .5) * .5, vy: -my * .01 + (Math.random() - .5) * .5 + .15,
          t: now, life: 600 + Math.random() * 700, size: .6 + Math.random() * 1.3, c: DUST[Math.floor(Math.random() * DUST.length)],
          tw: 8 + Math.random() * 10 });
      }
    }
    for (i = sparks.length - 1; i >= 0; i--) {
      var s = sparks[i], age = (now - s.t) / s.life;
      if (age > 1) { sparks.splice(i, 1); continue; }
      s.x += s.vx; s.y += s.vy; s.vx *= .96; s.vy *= .96;
      var twinkle = .55 + .45 * Math.sin(now / 1000 * s.tw + s.x);
      ctx.fillStyle = 'rgba(' + s.c + ',' + ((1 - age) * twinkle * .9).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.size * (1 - age * .5), 0, Math.PI * 2); ctx.fill();
    }
    // click: a star twinkles - four thin rays and a faint ring
    for (i = clicks.length - 1; i >= 0; i--) {
      var c = clicks[i], ca = (now - c.t) / 800;
      if (ca > 1) { clicks.splice(i, 1); continue; }
      var flare = Math.sin(Math.PI * Math.min(1, ca * 1.6)), ray = 6 + 26 * flare;
      ctx.lineWidth = 1;
      [[1, 0, 1], [0, 1, 1], [.7071, .7071, .45], [.7071, -.7071, .45]].forEach(function (d) {
        var g = ctx.createLinearGradient(c.x - d[0] * ray, c.y - d[1] * ray, c.x + d[0] * ray, c.y + d[1] * ray);
        g.addColorStop(0, 'rgba(200,214,255,0)');
        g.addColorStop(.5, 'rgba(255,255,255,' + (.9 * flare * d[2]).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(200,214,255,0)');
        ctx.strokeStyle = g;
        ctx.beginPath(); ctx.moveTo(c.x - d[0] * ray * d[2], c.y - d[1] * ray * d[2]); ctx.lineTo(c.x + d[0] * ray * d[2], c.y + d[1] * ray * d[2]); ctx.stroke();
      });
      ctx.strokeStyle = 'rgba(176,198,255,' + ((1 - ca) * .35).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(c.x, c.y, 6 + ca * 46, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';

    // stop once everything has faded
    var idle = !sparks.length && !clicks.length && (!path.length || now - path[path.length - 1].t > LIFE);
    if (idle) {
      if (!quietSince) quietSince = now;
      if (now - quietSince > 200) { ctx.clearRect(0, 0, W, H); path.length = 0; raf = 0; quietSince = 0; return; }
    } else {
      quietSince = 0;
    }
    raf = requestAnimationFrame(frame);
  }
})();
