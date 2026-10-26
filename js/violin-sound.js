/**
 * Violin sound - SYIA Portfolio
 * What the home page violin sounds like when it is touched. Everything is synthesised in the browser with the
 * Web Audio API (no audio files): plucked strings (Karplus-Strong) and their harmonics, the hum, rustle and knock
 * of the wooden body, the breath of the f-holes, and small bells on the scroll.
 * js/hero.js works out what was touched, where and how fast, and calls window.SYIA_VIOLIN_SOUND.
 * Browsers only allow sound after the visitor's first click, tap or key press on the page; until then it stays silent.
 */
(function () {
  'use strict';

  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;

  var MAX_VOICES = 32;
  var ac = null, bus = {}, voices = 0, gestureAt = -1e9, noiseBuf = null, cache = {}, cacheKeys = [];

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function noop() {}

  // ----- start on the visitor's first gesture -----
  function unlock() {
    gestureAt = performance.now();
    if (!ac) {
      try { ac = new AC({ latencyHint: 'interactive' }); } catch (e) { try { ac = new AC(); } catch (e2) { return; } }
      build();
    }
    if (ac.state !== 'running') { var p = ac.resume(); if (p && p.catch) p.catch(noop); }
  }
  ['pointerdown', 'pointerup', 'touchend', 'keydown', 'click'].forEach(function (type) {
    window.addEventListener(type, unlock, { capture: true, passive: true });
  });

  // Sounds are made while the context runs, and also just after a gesture while it is still starting
  // (phones start it on touchend, after the touch that asked for the sound).
  function can() {
    return !!ac && voices < MAX_VOICES && (ac.state === 'running' || performance.now() - gestureAt < 700);
  }

  // ----- the room and the wood -----
  function biquad(type, f, q, gainDb) {
    var b = ac.createBiquadFilter();
    b.type = type; b.frequency.value = f; b.Q.value = q;
    if (gainDb) b.gain.value = gainDb;
    return b;
  }
  function gain(v, dest) { var g = ac.createGain(); g.gain.value = v; if (dest) g.connect(dest); return g; }
  function osc(type, f, dest) { var o = ac.createOscillator(); o.type = type; o.frequency.value = f; if (dest) o.connect(dest); return o; }

  // a large, dark hall: stereo noise fading over `sec` seconds and losing its highs as it goes
  function hall(sec) {
    var sr = ac.sampleRate, len = Math.floor(sr * sec), b = ac.createBuffer(2, len, sr);
    for (var c = 0; c < 2; c++) {
      var d = b.getChannelData(c), lp = 0;
      for (var i = 0; i < len; i++) {
        var t = i / sr;
        lp += (.6 - .48 * t / sec) * (Math.random() * 2 - 1 - lp);
        d[i] = lp * Math.exp(-6.9 * t / sec) * Math.min(1, t / .02);
      }
    }
    return b;
  }

  function build() {
    var comp = ac.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 4; comp.attack.value = .003; comp.release.value = .25;
    var master = gain(.85);
    master.connect(comp); comp.connect(ac.destination);
    var verb = ac.createConvolver();
    verb.buffer = hall(3.4);
    verb.connect(gain(.55, master));
    function send(node, amount) { node.connect(gain(amount, verb)); }

    // wood: strings, hum and knock sound through the body's resonances
    // (the air inside near 280 Hz, the plates near 480 Hz, the "bridge hill" near 2.7 kHz)
    var hp = biquad('highpass', 160, .7), a0 = biquad('peaking', 280, 4, 5), b1 = biquad('peaking', 480, 3, 3);
    var hill = biquad('peaking', 2700, 1.1, 4), top = biquad('lowpass', 7500, .6);
    hp.connect(a0); a0.connect(b1); b1.connect(hill); hill.connect(top); top.connect(master); send(top, .35);
    bus.wood = hp;
    // air: harmonics, bells and breath, with more of the hall
    bus.air = gain(1, master); send(bus.air, .75);

    noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    var nd = noiseBuf.getChannelData(0);
    for (var i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  }

  // Start the sources at t and stop them at `end`; once they have finished every node of the voice is let go.
  // `out` is the voice's last gain, `parts` the nodes in between.
  function play(srcs, out, parts, dest, pan, t, end) {
    var tail = out, nodes = parts.concat(out);
    if (pan && ac.createStereoPanner) {
      var p = ac.createStereoPanner();
      p.pan.value = clamp(pan, -1, 1);
      out.connect(p); tail = p; nodes.push(p);
    }
    tail.connect(dest);
    voices++;
    srcs.forEach(function (s) {
      if (s.buffer === noiseBuf) s.start(t, Math.random() * 1.5); else s.start(t);
      s.stop(end);
    });
    srcs[0].onended = function () {
      voices--;
      srcs.concat(nodes).forEach(function (n) { n.disconnect(); });
    };
  }
  function at(delay) { return ac.currentTime + .01 + (delay || 0); }
  function noise() { var s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true; return s; }

  // ----- plucked string (Karplus-Strong) -----
  // A burst of noise one period long goes round a delay line; each pass smooths it a little, so the highs die
  // first, as on a real string. vel: how hard (a brighter burst); pos: where along the string it is plucked,
  // as a fraction from the bridge (small = thin and bright); decay: seconds to fade by 60 dB.
  function ksSamples(sr, freq, vel, pos, decay) {
    // the smoothing is a weighted average (1 - S, S); high notes pass through it so often that S = .5 would
    // kill them too soon, so there it is lightened until the note lasts `decay`
    var w = 2 * Math.PI * freq / sr, target = Math.pow(.001, 1 / (freq * decay)), S = .5, rho = target / Math.cos(w / 2);
    if (rho > 1) {
      S = (1 - Math.sqrt(1 - 2 * (1 - target * target) / (1 - Math.cos(w)))) / 2;
      rho = .99999;
    }
    var D = Math.atan2(S * Math.sin(w), 1 - S + S * Math.cos(w)) / w;   // delay of the average at this pitch
    var P = sr / freq, N = Math.floor(P - D - .1), frac = P - D - N, C = (1 - frac) / (1 + frac);
    var len = Math.ceil(sr * (decay + .1)), out = new Float32Array(len), line = new Float32Array(N), ex = new Float32Array(N);
    var lp = 0, k = .1 + .8 * vel, M = Math.max(1, Math.round(pos * N)), mean = 0, peak = 0, i;
    for (i = 0; i < N; i++) { lp += k * (Math.random() * 2 - 1 - lp); line[i] = lp; }
    for (i = 0; i < N; i++) { ex[i] = line[i] - line[(i - M + N) % N]; mean += ex[i] / N; }
    for (i = 0; i < N; i++) { ex[i] -= mean; peak = Math.max(peak, Math.abs(ex[i])); }
    // loop: the average (the string's losses) and an allpass for the fraction of a sample, so it is in tune
    var norm = 1 / (peak || 1), idx = 0, prev = 0, x1 = 0, y1 = 0;
    for (i = 0; i < len; i++) {
      var cur = ex[idx], avg = (1 - S) * cur + S * prev, y = C * avg + x1 - C * y1;
      out[i] = cur * norm;
      prev = cur; x1 = avg; y1 = y;
      ex[idx] = rho * y;
      if (++idx === N) idx = 0;
    }
    var fade = Math.min(len, Math.floor(sr * .06));
    for (i = 0; i < fade; i++) out[len - 1 - i] *= i / fade;
    return out;
  }
  function ks(freq, vel, pos, decay) {
    vel = Math.round(clamp(vel, 0, 1) * 4) / 4; pos = Math.round(clamp(pos, .02, .5) * 50) / 50; decay = Math.round(decay * 10) / 10;
    var key = freq.toFixed(1) + '/' + vel + '/' + pos + '/' + decay;
    if (!cache[key]) {
      var data = ksSamples(ac.sampleRate, freq, vel, pos, decay), b = ac.createBuffer(1, data.length, ac.sampleRate);
      b.getChannelData(0).set(data);
      cache[key] = b; cacheKeys.push(key);
      if (cacheKeys.length > 24) delete cache[cacheKeys.shift()];
    }
    return cache[key];
  }

  // o: freq, vel 0-1, pos, decay (s), pan -1..1, delay (s), gain,
  //    glide: the pitch it starts at as a ratio, sliding back to 1 (a peg being turned)
  function pluck(o) {
    if (!can()) return;
    var t = at(o.delay), src = ac.createBufferSource(), vel = clamp(o.vel, 0, 1), out = gain((.2 + .6 * vel) * (o.gain || 1));
    src.buffer = ks(o.freq, vel, o.pos || .2, o.decay || 1.2);
    if (o.glide) { src.playbackRate.setValueAtTime(o.glide, t); src.playbackRate.setTargetAtTime(1, t + .03, .15); }
    src.connect(out);
    play([src], out, [], bus.wood, o.pan, t, t + src.buffer.duration + .05);
  }

  // a natural harmonic: the string touched lightly at a node - nearly pure, glassy and long
  function harmonic(o) {
    if (!can()) return;
    var t = at(o.delay), dur = o.decay || 2.8, vel = clamp(o.vel, 0, 1), out = gain(0), upper = gain(.1, out);
    var a = osc('sine', o.freq, out), b = osc('sine', o.freq * 2, upper);
    a.detune.value = (Math.random() - .5) * 6;
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime((.06 + .18 * vel) * (o.gain || 1), t + .01);
    out.gain.setTargetAtTime(0, t + .01, dur / 5);
    play([a, b], out, [upper], bus.air, o.pan, t, t + dur);
  }

  // the strings answering softly when the body is stroked: a dark pluck that swells in instead of striking
  function hum(o) {
    if (!can()) return;
    var t = at(o.delay), vel = clamp(o.vel, 0, 1), src = ac.createBufferSource(), out = gain(0), rise = .16 - .1 * vel;
    src.buffer = ks(o.freq, vel * .5, .3, 2.2);
    src.connect(out);
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime((.08 + .3 * vel) * (o.gain || 1), t + rise);
    out.gain.setTargetAtTime(0, t + rise, .6);
    play([src], out, [], bus.wood, o.pan, t, t + 2.3);
  }

  // skin over wood: a short breath of filtered noise, brighter when faster
  function rustle(o) {
    if (!can()) return;
    var t = at(o.delay), vel = clamp(o.vel, 0, 1), src = noise(), bp = biquad('bandpass', 900 + 2600 * vel, .9), out = gain(0);
    var len = .07 + .1 * (1 - vel);
    src.connect(bp); bp.connect(out);
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime((.04 + .14 * vel) * (o.gain || 1), t + len * .4);
    out.gain.linearRampToValueAtTime(0, t + len);
    play([src], out, [bp], bus.wood, o.pan, t, t + len + .02);
  }

  // the f-holes: air moving through them, tuned to the body's air resonance (about 280 Hz) and its octave
  function breath(o) {
    if (!can()) return;
    var t = at(o.delay), vel = clamp(o.vel, 0, 1), src = noise(), out = gain(0);
    var a = biquad('bandpass', 280, 5), b = biquad('bandpass', 560, 4), bg = gain(.5, out), len = .5 + .5 * vel;
    src.connect(a); a.connect(out); src.connect(b); b.connect(bg);
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime((.6 + 1.2 * vel) * (o.gain || 1), t + .06 + .1 * (1 - vel));
    out.gain.linearRampToValueAtTime(0, t + len);
    play([src], out, [a, b, bg], bus.air, o.pan, t, t + len + .02);
  }

  // a knuckle on the wood: the plate's own ringing modes [Hz, level, seconds], lower and duller on the back
  var MODES = [[275, 1, .3], [455, .7, .2], [530, .6, .17], [690, .35, .11], [1020, .22, .07], [1550, .14, .05], [2350, .08, .03]];
  function knock(o) {
    if (!can()) return;
    var t = at(o.delay), vel = clamp(o.vel, 0, 1), sc = o.scale || 1, out = gain((.16 + .28 * vel) * (o.gain || 1));
    var srcs = [], parts = [];
    MODES.forEach(function (m, i) {
      if (o.back && i > 4) return;
      var g = gain(0, out), s = osc('sine', m[0] * sc * (1 + (Math.random() - .5) * .02), g);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(m[1], t + .002);
      g.gain.setTargetAtTime(0, t + .002, m[2] / 3 * (o.back ? 1.3 : 1));
      srcs.push(s); parts.push(g);
    });
    // the click of contact
    var n = noise(), bp = biquad('bandpass', o.back ? 1200 : 2000, .8), ng = gain(0, out);
    n.connect(bp); bp.connect(ng);
    ng.gain.setValueAtTime(.6 * vel + .2, t);
    ng.gain.exponentialRampToValueAtTime(.001, t + .025);
    srcs.push(n); parts.push(bp, ng);
    play(srcs, out, parts, bus.wood, o.pan, t, t + .6);
  }

  // small bells on the scroll: a few inharmonic partials [ratio, level, length], like glass or a star
  var BELL = [[1, 1, 1], [2, .3, .6], [2.76, .26, .42], [4.07, .12, .28], [5.4, .07, .2]];
  function bell(o) {
    if (!can()) return;
    var t = at(o.delay), vel = clamp(o.vel, 0, 1), dur = 2.4, out = gain((.04 + .14 * vel) * (o.gain || 1)), srcs = [], parts = [];
    BELL.forEach(function (p, i) {
      var g = gain(0, out), s = osc('sine', o.freq * p[0], g);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(p[1] * (i > 1 ? .35 + .65 * vel : 1), t + .003);
      g.gain.setTargetAtTime(0, t + .003, dur * p[2] / 5);
      srcs.push(s); parts.push(g);
    });
    play(srcs, out, parts, bus.air, o.pan, t, t + dur);
  }

  window.SYIA_VIOLIN_SOUND = { pluck: pluck, harmonic: harmonic, hum: hum, rustle: rustle, breath: breath, knock: knock, bell: bell };
})();
