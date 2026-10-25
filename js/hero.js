/**
 * Home hero - SYIA Portfolio
 * Five staff lines are drawn across the screen, come apart into five-line fragments,
 * and settle into a line drawing of a violin that slowly turns in 3D.
 * Pointer: strokes give way around the cursor, its horizontal position leans the violin,
 * dragging turns it all the way round, click sends a ripple.
 */
(function () {
  'use strict';

  var hero = document.getElementById('hero');
  var canvas = document.getElementById('heroArt');
  if (!hero || !canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var body = document.body;
  var leadEl = hero.querySelector('.hero__lead');
  var titleEl = hero.querySelector('.hero__title');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var seed = 20240929;
  function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function ease(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }

  // ========================================
  // Violin drawing (units: mm, x = 0 on the centre line, y = 0 at the top of the scroll)
  // Strokes come in bundles of up to five parallel lines; each bundle flies as one staff fragment.
  // ========================================
  var strokes = [];   // [x1, y1, x2, y2, z, r, g, b, group, rank, dz, nx, ny, nz, mode]
  var dots = [];      // [x, y, z, brightness 0-255]
  var groupCount = 0;

  // Which way a stroke's surface faces. mode 0: drawn brighter the more it faces the viewer;
  // mode 1 (the head): not drawn while the pegbox or the scroll is in front of it.
  var face = [0, 0, 1], faceMode = 0;
  function setFace(nx, ny, nz, mode) { face = [nx, ny, nz]; faceMode = mode || 0; }
  function emit(x1, y1, x2, y2, z, c, g, rank, dz, nrm) {
    nrm = nrm || face;
    strokes.push([x1, y1, x2, y2, z, c[0], c[1], c[2], g, rank, dz || 0, nrm[0], nrm[1], nrm[2], faceMode]);
  }

  var BODY_TOP = 237, BODY_BOTTOM = 593, BRIDGE_Y = 432;

  function catmull(pts, sub) {
    var out = [], i, s;
    for (i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (s = 0; s < sub; s++) {
        var t = s / sub, t2 = t * t, t3 = t2 * t;
        out.push([
          .5 * (2 * p1[0] + (p2[0] - p0[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (3 * p1[0] - p0[0] - 3 * p2[0] + p3[0]) * t3),
          .5 * (2 * p1[1] + (p2[1] - p0[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (3 * p1[1] - p0[1] - 3 * p2[1] + p3[1]) * t3)
        ]);
      }
    }
    out.push(pts[pts.length - 1].slice());
    return out;
  }

  // Points every `step` mm along a polyline
  function resample(poly, step) {
    var out = [poly[0].slice()], carry = 0, i;
    for (i = 1; i < poly.length; i++) {
      var ax = poly[i - 1][0], ay = poly[i - 1][1], bx = poly[i][0], by = poly[i][1];
      var len = Math.hypot(bx - ax, by - ay), d = step - carry;
      while (d <= len) { out.push([ax + (bx - ax) * d / len, ay + (by - ay) * d / len]); d += step; }
      carry = len - (d - step);
    }
    return out;
  }

  function mirror(poly) { return poly.map(function (p) { return [-p[0], p[1]]; }); }
  function shift(pts, dy) { return pts.map(function (p) { return [p[0], p[1] + dy]; }); }

  function ellipse(cx, cy, rx, ry, rot, a0, a1, n) {
    var out = [], c = Math.cos(rot), s = Math.sin(rot);
    for (var i = 0; i <= n; i++) {
      var a = a0 + (a1 - a0) * i / n, x = Math.cos(a) * rx, y = Math.sin(a) * ry;
      out.push([cx + x * c - y * s, cy + x * s + y * c]);
    }
    return out;
  }

  // n distinct staff rows (0-4), in order, so a fragment keeps its line order in flight
  function pickRanks(n) {
    var r = [0, 1, 2, 3, 4];
    while (r.length > n) r.splice(Math.floor(rand() * r.length), 1);
    return r;
  }

  // One bundle: n parallel strokes of about `len` mm through (cx, cy) along (dx, dy), `gap` mm apart
  function addBundle(cx, cy, dx, dy, len, n, gap, z, color) {
    var nx = -dy, ny = dx, g = groupCount++, ranks = pickRanks(n), i;
    for (i = 0; i < n; i++) {
      var off = (i - (n - 1) / 2) * gap + (rand() - .5) * gap * .5;
      var half = len * (.7 + rand() * .45) / 2, slide = (rand() - .5) * len * .3;
      var px = cx + nx * off + dx * slide, py = cy + ny * off + dy * slide;
      emit(px - dx * half, py - dy * half, px + dx * half, py + dy * half, z + (rand() - .5) * 3, color(px, py), g, ranks[i]);
    }
  }

  // Strokes following a polyline: chords of about `seg` mm, each drawn as a bundle of n lines
  function trace(poly, o) {
    var pts = resample(poly, 1), i = 0;
    while (i < pts.length - 2) {
      var j = Math.min(pts.length - 1, i + Math.max(2, Math.round(o.seg * (.75 + rand() * .5))));
      var a = pts[i], b = pts[j], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
      var cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
      if (!o.keep || rand() < o.keep) {
        addBundle(cx, cy, dx / len, dy / len, len * 1.08, o.n, o.gap, o.z ? o.z(cx, cy) : 0, o.color);
      }
      i = j - Math.round((j - i) * (o.overlap || .25));
    }
  }

  // Strokes along a 3D polyline (ribs, bridge, head, pegs: the parts that leave the plane of the top).
  // o: {seg, n, gap, off: [x, y, z] direction the n copies are spread along, overlap, keep, color, normal(midpoint)}
  function trace3(pts, o) {
    var dense = [], i, j, c;
    for (i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], steps = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])));
      for (j = i === 1 ? 0 : 1; j <= steps; j++) {
        dense.push([a[0] + (b[0] - a[0]) * j / steps, a[1] + (b[1] - a[1]) * j / steps, a[2] + (b[2] - a[2]) * j / steps]);
      }
    }
    var off = o.off || [0, 0, 1], n = o.n || 1, gap = o.gap || 1;
    i = 0;
    while (i < dense.length - 1) {
      j = Math.min(dense.length - 1, i + Math.max(1, Math.round(o.seg * (.75 + rand() * .5))));
      if (!o.keep || rand() < o.keep) {
        var g = groupCount++, ranks = pickRanks(n), p = dense[i], q = dense[j];
        for (c = 0; c < n; c++) {
          var d = (c - (n - 1) / 2) * gap, mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2];
          emit(p[0] + off[0] * d, p[1] + off[1] * d, q[0] + off[0] * d, q[1] + off[1] * d, mid[2] + off[2] * d,
            o.color(p[0], p[1]), g, ranks[c], (q[2] - p[2]) / 2, o.normal ? o.normal(mid) : null);
        }
      }
      if (j === dense.length - 1) break;
      i = j - Math.round((j - i) * (o.overlap || .2));
    }
  }
  // circle around the x axis (a ring on a peg, the eye of the scroll)
  function ringX(x, y, z, r, n) {
    var out = [];
    for (var a = 0; a <= (n || 24); a++) { var an = a / (n || 24) * Math.PI * 2; out.push([x, y + Math.sin(an) * r, z + Math.cos(an) * r]); }
    return out;
  }

  // ---- palette: night blues, lavender and a little warm light ----
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  var RAMP = [[44, 56, 150], [78, 98, 204], [124, 138, 230], [176, 172, 236], [222, 224, 250], [246, 246, 255]];
  function shade(b) {
    b = clamp(b, 0, .999) * (RAMP.length - 1);
    var i = Math.floor(b);
    return mix(RAMP[i], RAMP[i + 1], b - i);
  }
  function jitter(c, a) { return [c[0] + (rand() - .5) * a, c[1] + (rand() - .5) * a, c[2] + (rand() - .5) * a * .6]; }
  function solid(b, a) { return function () { return jitter(shade(b + (rand() - .5) * (a || .12)), 18); }; }

  // ---- body outline (right half, mm from the top edge of the body) ----
  var upperBout = catmull([[0, 0], [28, 1.5], [50, 7], [66, 17], [77, 31], [83, 48], [84.5, 66], [83, 84], [79.5, 100], [76, 114], [74.5, 126], [75.5, 134]], 6);
  var cBout = catmull([[75.5, 134], [66, 137], [59.5, 146], [56.5, 160], [55.5, 175], [56.5, 190], [59.5, 203], [66, 212], [76.5, 216]], 6);
  var lowerBout = catmull([[76.5, 216], [80, 226], [89, 240], [97, 256], [102, 273], [104, 290], [103.5, 306], [100, 321], [93, 334], [82, 345], [64, 352.5], [40, 355.5], [18, 356], [0, 356]], 6);
  var rightHalf = shift(upperBout.concat(cBout.slice(1), lowerBout.slice(1)), BODY_TOP);
  var outline = rightHalf.concat(mirror(rightHalf).reverse().slice(1));
  var outlineDense = resample(outline, 1);

  // half width of the body at each y (1 mm steps)
  var halfWidth = [];
  (function () {
    for (var i = 0; i < rightHalf.length - 1; i++) {
      var a = rightHalf[i], b = rightHalf[i + 1], steps = Math.ceil(Math.abs(b[1] - a[1]) * 2) + 1;
      for (var s = 0; s <= steps; s++) {
        var y = Math.round(a[1] + (b[1] - a[1]) * s / steps), x = a[0] + (b[0] - a[0]) * s / steps;
        if (!(halfWidth[y] > x)) halfWidth[y] = x;
      }
    }
  })();
  function bodyHalf(y) { return halfWidth[Math.round(y)] || 0; }
  function insideBody(x, y) { return y > BODY_TOP && y < BODY_BOTTOM && Math.abs(x) < bodyHalf(y); }

  // arching of the top plate, used for shading and depth
  function arch(x, y) {
    var w = bodyHalf(y);
    if (!w) return 0;
    var u = x / w, v = (y - BODY_TOP) / (BODY_BOTTOM - BODY_TOP);
    return 16 * Math.max(0, 1 - u * u) * Math.sin(Math.PI * clamp(v, 0, 1));
  }
  // light from the upper left, a touch of warmth where it is brightest
  function bodyLight(x, y) {
    var e = .8, gx = (arch(x + e, y) - arch(x - e, y)) / (2 * e), gy = (arch(x, y + e) - arch(x, y - e)) / (2 * e);
    var n = Math.hypot(gx, gy, 1);
    return clamp(.42 + 1.9 * ((gx * .55 + gy * .5) / n) + .05 * ((-x) / 100), 0, 1);
  }
  function bodyColor(x, y) {
    var b = clamp(bodyLight(x, y) + (rand() - .5) * .26, 0, 1);
    var c = shade(Math.pow(b, 1.35) * .92 + .02);
    if (b > .6 && rand() < .22) c = mix(c, [236, 192, 150], .55);
    return jitter(c, 22);
  }

  function nearestEdge(x, y) {
    var best = 1e9, bi = 0, i;
    for (i = 0; i < outlineDense.length; i += 2) {
      var d = (outlineDense[i][0] - x) * (outlineDense[i][0] - x) + (outlineDense[i][1] - y) * (outlineDense[i][1] - y);
      if (d < best) { best = d; bi = i; }
    }
    var a = outlineDense[Math.max(0, bi - 3)], b = outlineDense[Math.min(outlineDense.length - 1, bi + 3)];
    var tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty) || 1;
    return { d: Math.sqrt(best), tx: tx / tl, ty: ty / tl };
  }

  // inset copy of the outline (purfling, arching contours)
  function inset(poly, d) {
    var out = [], i;
    for (i = 0; i < poly.length; i++) {
      var a = poly[Math.max(0, i - 2)], b = poly[Math.min(poly.length - 1, i + 2)];
      var tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty) || 1, nx = -ty / tl, ny = tx / tl;
      var p = poly[i];
      if (!insideBody(p[0] + nx * 2, p[1] + ny * 2)) { nx = -nx; ny = -ny; }
      out.push([p[0] + nx * d, p[1] + ny * d]);
    }
    return out;
  }

  // ---- f-holes (treble side; the bass side is its mirror) ----
  // An S-shaped slot, thin at the ends and fuller in the middle: a small eye at the top on the inside,
  // a larger eye at the bottom on the outside, a pointed wing opposite each eye, two nicks at the bridge line.
  var fLine = shift(catmull([[21, 158.5], [21.5, 166], [23.4, 175], [27.6, 186], [33.4, 197.5], [39.4, 208.5], [44, 218.5], [46.6, 226.5], [47.6, 232.5]], 8), BODY_TOP);
  var fN = fLine.length, fW = [], fNx = [], fNy = [];
  (function () {
    for (var i = 0; i < fN; i++) {
      var a = fLine[Math.max(0, i - 1)], b = fLine[Math.min(fN - 1, i + 1)];
      var tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty) || 1;
      fNx[i] = ty / tl; fNy[i] = -tx / tl;                                 // normal pointing outwards (up and right)
      fW[i] = .8 + 2.3 * Math.pow(Math.sin(Math.PI * i / (fN - 1)), .8);  // half width of the slot
    }
  })();
  function fIndex(t) { return Math.round(clamp(t, 0, 1) * (fN - 1)); }
  function fWidth(t) { return fW[fIndex(t)]; }
  // point on the slot: t from the top (0) to the bottom (1), `off` mm towards the outside
  function fAt(t, off) { var i = fIndex(t); return [fLine[i][0] + fNx[i] * off, fLine[i][1] + fNy[i] * off]; }
  // wings: the edge swells out in a curve and ends in a sharp point (upper wing outside, lower wing inside)
  function fWing(t) {
    if (t < .03 || t > .245) return 0;
    return t <= .21 ? 4.4 * Math.pow((t - .03) / .18, 1.7) : 4.4 * (1 - (t - .21) / .035);
  }
  var fEyeTop = fAt(0, -1.7), fEyeBottom = fAt(1, 2.1);
  fEyeTop[1] -= 2.2; fEyeBottom[1] += 1.5;
  var F_EYE_TOP_R = 3.3, F_EYE_BOTTOM_R = 4.1;
  var fNick = (function () {
    var best = 0;
    for (var i = 0; i < fN; i++) if (Math.abs(fLine[i][1] - BRIDGE_Y) < Math.abs(fLine[best][1] - BRIDGE_Y)) best = i;
    return best / (fN - 1);
  })();
  // distance from the edge of the treble-side f-hole (negative inside); the bass side mirrors it
  function fHoleDist(x, y) {
    var ax = Math.abs(x), best = 1e9;
    for (var i = 0; i < fN; i += 2) best = Math.min(best, Math.hypot(fLine[i][0] - ax, fLine[i][1] - y) - fW[i]);
    best = Math.min(best, Math.hypot(fEyeTop[0] - ax, fEyeTop[1] - y) - F_EYE_TOP_R);
    return Math.min(best, Math.hypot(fEyeBottom[0] - ax, fEyeBottom[1] - y) - F_EYE_BOTTOM_R);
  }

  // ---- parts that sit on top of the body ----
  function underParts(x, y) {
    if (y < 382 && Math.abs(x) < 26) return true;                       // fingerboard
    if (y > 462 && Math.abs(x) < 25) return true;                       // tailpiece
    if (Math.abs(y - BRIDGE_Y) < 6 && Math.abs(x) < 25) return true;    // bridge
    return fHoleDist(x, y) < 3.2;
  }

  // ---- head geometry (mm), shared by the drawing and by the test for lines hidden behind the head ----
  // The front of the pegbox (the side with the opening) faces the viewer and leans back a little towards the scroll.
  var TAU = Math.PI * 2;
  function zFront(y) { return 24 - (107 - y) * .11; }
  function zBack(y) { return zFront(y) - 23; }
  function zMid(y) { return (zFront(y) + zBack(y)) / 2; }
  function cheekW(y) { return 10.8 + (y - 40) / 67 * 1.7; }
  function openW(y) { return 6 + (y - 40) / 67; }
  // Scroll: a volute of about two and three-quarter turns. In the y-z plane it is a spiral tightening to the eye
  // (what you see from the side); the turns get wider towards the eye, so from the front the inner turns
  // stand out on both sides of the fluted first turn as the "ears".
  var SCY = 21, SCZ = 4.5, SR = 21, SA = 2.0, PHI = 2.75 * TAU, SK = Math.log(SR / 3.4) / PHI;
  function scrollAt(phi, x, dr) {
    var r = SR * Math.exp(-SK * phi), a = SA + phi;
    r += typeof dr === 'function' ? dr(r) : (dr || 0);
    return [x, SCY + Math.sin(a) * r, SCZ + Math.cos(a) * r];
  }
  function scrollW(phi) { return 9.8 + 9.7 * Math.pow(phi / PHI, 1.5); }
  // is a point inside the solid head (pegbox walls and back, or the volute)?
  function insideHead(x, y, z) {
    var ax = Math.abs(x);
    if (y >= 40 && y <= 107 && ax <= cheekW(y) && z >= zBack(y) && z <= zFront(y)) {
      return !(ax < openW(y) && z > zBack(y) + 4 && y > 46 && y < 104);
    }
    var dy = y - SCY, dz = z - SCZ, rho = Math.sqrt(dy * dy + dz * dz);
    if (rho > SR) return false;
    var phi = ((Math.atan2(dy, dz) - SA) % TAU + TAU) % TAU;
    if (SR * Math.exp(-SK * phi) < rho) return false;
    while (phi + TAU <= PHI && SR * Math.exp(-SK * (phi + TAU)) >= rho) phi += TAU;
    if (phi + TAU > PHI && rho < SR * Math.exp(-SK * PHI)) return ax <= scrollW(PHI) + 1;
    return ax <= scrollW(phi);
  }

  function buildViolin() {
    var i, k;
    var bright = function (b) { return solid(b, .1); };

    // body: hatching that follows the grain in the middle and the edge near the rim
    for (k = 0; k < 640; k++) {
      var x = (rand() * 2 - 1) * 104, y = BODY_TOP + rand() * (BODY_BOTTOM - BODY_TOP);
      if (!insideBody(x, y) || underParts(x, y)) continue;
      var ne = nearestEdge(x, y);
      if (ne.d < 2.5) continue;
      var tx = ne.tx, ty = ne.ty;
      if (ty < 0) { tx = -tx; ty = -ty; }
      var w = Math.exp(-ne.d / 13), dx = tx * w, dy = (1 - w) + ty * w;
      var ang = Math.atan2(dy, dx) + (rand() - .5) * .22, len = 14 + rand() * 18 * (1 - w * .5);
      len *= clamp((fHoleDist(x, y) - 1) / 14, .25, 1);
      var n = 3 + Math.floor(rand() * 3);
      addBundle(x, y, Math.cos(ang), Math.sin(ang), len, n, 2.5, arch(x, y) + 1 + (rand() - .5) * 4, bodyColor);
    }

    // arching contours, broken like a sketch
    [12, 24, 38].forEach(function (d, idx) {
      trace(inset(outline, d), { seg: 20, n: 2, gap: 1.3, keep: .55 - idx * .1, overlap: .1,
        z: function (x, y) { return arch(x, y) + 1 + (rand() - .5) * 3; }, color: bodyColor });
    });

    // rim and purfling; a dim copy of the rim at the back plate gives the body its thickness when it turns
    trace(outline, { seg: 22, n: 4, gap: 1.25, z: function () { return 3; }, color: bright(.86) });
    trace(outline, { seg: 30, n: 2, gap: 2.2, overlap: .4, z: function () { return 1; }, color: bright(.72) });
    trace(inset(outline, 4.2), { seg: 18, n: 2, gap: .9, z: function () { return 4; }, color: bright(.66) });
    // ribs and back plate, so the body keeps its volume from the side and from behind
    setFace(0, 0, -1);
    trace(outline, { seg: 26, n: 3, gap: 1.6, keep: .8, z: function () { return -31; }, color: bright(.46) });
    // ribs: lines running round the body at a few heights, facing outwards
    var ribNormal = function (p) {
      var ne2 = nearestEdge(p[0], p[1]), nx2 = ne2.ty, ny2 = -ne2.tx;
      if (nx2 * p[0] + ny2 * (p[1] - 415) < 0) { nx2 = -nx2; ny2 = -ny2; }
      return [nx2, ny2, 0];
    };
    [-8, -16, -24].forEach(function (rz, ri) {
      trace3(resample(outline, 3).map(function (p) { return [p[0], p[1], rz]; }),
        { seg: 24, n: 1, overlap: .15, keep: .85 - ri * .1, normal: ribNormal, color: solid(.5 - ri * .06, .1) });
    });
    trace(inset(outline, 4.2), { seg: 18, n: 2, gap: .9, z: function () { return -32; }, color: bright(.36) });
    for (k = 0; k < 240; k++) {
      var bx = (rand() * 2 - 1) * 104, by = BODY_TOP + rand() * (BODY_BOTTOM - BODY_TOP);
      if (!insideBody(bx, by) || nearestEdge(bx, by).d < 3) continue;
      var flame = (bx > 0 ? -.3 : .3) + (rand() - .5) * .3;   // maple flames run across the back
      addBundle(bx, by, Math.cos(flame), Math.sin(flame), 10 + rand() * 14, 2 + Math.floor(rand() * 3), 2.4, -32 - arch(bx, by) * .85, solid(.3, .16));
    }
    setFace(0, 0, 1);

    // neck under the fingerboard, meeting the body at the heel
    trace3([[0, 110, 6], [0, 200, 0], [0, 226, -6], [0, 236, -18], [0, 243, -31]], { seg: 18, n: 1, normal: function () { return [0, 0, -1]; }, color: bright(.44) });
    [1, -1].forEach(function (side) {
      trace3([[side * 11, 110, 15], [side * 12.5, 228, 8], [side * 13, 238, -4]], { seg: 20, n: 1, normal: function () { return [side, 0, 0]; }, color: bright(.36) });
      trace3([[side * 12, 107, 20.5], [side * 21, 377, 22.5]], { seg: 26, n: 1, normal: function () { return [side, 0, -.4]; }, color: bright(.4) });
    });

    // f-holes: both edges of the slot, the cut edge of the plate seen inside, eyes, wings and nicks
    [1, -1].forEach(function (side) {
      var m = function (p) { return [p[0] * side, p[1]]; };
      var fz = function (x, y) { return arch(x, y) + 1; };
      var outer = [], inner = [], cut = [], t;
      for (i = 0; i <= 48; i++) {
        t = i / 48;
        outer.push(m(fAt(t, fWidth(t) + fWing(t)))); inner.push(m(fAt(t, -fWidth(t) - fWing(1 - t) * 1.15)));
        cut.push(m(fAt(t, -fWidth(t) * .45)));
      }
      trace(outer, { seg: 3, n: 1, gap: 1, overlap: .3, z: fz, color: bright(.97) });
      trace(inner, { seg: 3, n: 1, gap: 1, overlap: .3, z: fz, color: bright(.8) });
      trace(cut.slice(8, 41), { seg: 6, n: 1, gap: 1, overlap: .2, z: fz, color: solid(.28, .06) });
      trace(ellipse(fEyeTop[0] * side, fEyeTop[1], F_EYE_TOP_R, F_EYE_TOP_R, 0, 0, Math.PI * 2, 22), { seg: 2.4, n: 2, gap: .6, overlap: .3, z: fz, color: bright(.97) });
      trace(ellipse(fEyeBottom[0] * side, fEyeBottom[1], F_EYE_BOTTOM_R, F_EYE_BOTTOM_R, 0, 0, Math.PI * 2, 24), { seg: 2.8, n: 2, gap: .6, overlap: .3, z: fz, color: bright(.97) });
      trace([m(fAt(fNick, fWidth(fNick))), m(fAt(fNick, fWidth(fNick) + 2.4))], { seg: 2.4, n: 1, gap: 1, z: fz, color: bright(.95) });
      trace([m(fAt(fNick, -fWidth(fNick))), m(fAt(fNick, -fWidth(fNick) - 2.4))], { seg: 2.4, n: 1, gap: 1, z: fz, color: bright(.95) });
    });

    // fingerboard (ebony: dark inside, lit edges)
    var fbR = [[12, 107], [21, 377]], fbZ = function (x, y) { return 26 + (y - 107) * .02; };
    [1, -1].forEach(function (side) {
      trace([[fbR[0][0] * side, fbR[0][1]], [fbR[1][0] * side, fbR[1][1]]], { seg: 26, n: 2, gap: 1.2, z: fbZ, color: bright(.78) });
    });
    trace(ellipse(0, 377, 21, 4, 0, 0, Math.PI, 12), { seg: 10, n: 2, gap: 1, z: fbZ, color: bright(.7) });
    for (k = 0; k < 46; k++) {
      var fy = 112 + rand() * 260, fw = 12 + (fy - 107) / 270 * 9, fx = (rand() * 2 - 1) * (fw - 3);
      addBundle(fx, fy, 0, 1, 18 + rand() * 20, 2 + Math.floor(rand() * 2), 2.2, fbZ(fx, fy) + (rand() - .5) * 4, solid(.16, .14));
    }

    // strings: four lines, nut -> bridge -> tailpiece, each slice flies as one fragment
    var nutX = [-8.2, -2.7, 2.7, 8.2], brX = [-17, -5.7, 5.7, 17], tpX = [-13, -4.3, 4.3, 13];
    function strings(y0, y1, xa, xb, za, zb, n) {
      for (var s = 0; s < n; s++) {
        var t0 = s / n, t1 = (s + 1) / n, g = groupCount++, ranks = pickRanks(4);
        for (var j = 0; j < 4; j++) {
          emit(xa[j] + (xb[j] - xa[j]) * t0, y0 + (y1 - y0) * t0, xa[j] + (xb[j] - xa[j]) * t1, y0 + (y1 - y0) * t1,
            za + (zb - za) * (t0 + t1) / 2, jitter(shade(.95), 10), g, ranks[j]);
        }
      }
    }
    strings(107, BRIDGE_Y, nutX, brX, 28, 36, 10);
    strings(BRIDGE_Y, 474, brX, tpX, 36, 22, 2);

    // bridge: a thin maple plate standing on the top (edge-on from the front), with its heart and kidney cut-outs
    var foot = arch(20, BRIDGE_Y) + 1;
    var bridge = catmull([[-20.5, foot], [-19.5, foot + 7], [-17.5, 33], [-9, 35.6], [0, 36.3], [9, 35.6], [17.5, 33], [19.5, foot + 7], [20.5, foot]], 4);
    [-.9, .9].forEach(function (dy) {
      trace3(bridge.map(function (p) { return [p[0], BRIDGE_Y + dy, p[1]]; }), { seg: 6, n: 1, color: bright(.97) });
    });
    trace3(ellipse(0, 25.5, 2.6, 3.2, 0, 0, Math.PI * 2, 14).map(function (p) { return [p[0], BRIDGE_Y, p[1]]; }), { seg: 3, n: 1, color: bright(.8) });
    [-1, 1].forEach(function (side) {
      trace3(ellipse(9 * side, 20.5, 3.6, 1.5, 0, 0, Math.PI * 2, 14).map(function (p) { return [p[0], BRIDGE_Y, p[1]]; }), { seg: 3, n: 1, color: bright(.74) });
    });

    // tailpiece, fine tuners, saddle, end button
    var tail = catmull([[-9, 584], [-15, 545], [-19.5, 495], [-19, 478], [-12, 470.5], [0, 469], [12, 470.5], [19, 478], [19.5, 495], [15, 545], [9, 584], [0, 586], [-9, 584]], 5);
    trace(tail, { seg: 14, n: 2, gap: 1.2, z: function () { return 20; }, color: bright(.74) });
    for (k = 0; k < 24; k++) {
      var ty2 = 480 + rand() * 98, tw = 19 - (ty2 - 478) / 106 * 9, tx2 = (rand() * 2 - 1) * (tw - 3);
      addBundle(tx2, ty2, 0, 1, 14 + rand() * 12, 2, 2, 20, solid(.2, .14));
    }
    trace([[-14, 590], [14, 590]], { seg: 14, n: 2, gap: 1.2, z: function () { return 6; }, color: bright(.8) });
    trace3([[0, 586, 19], [0, 591, 6], [0, 595, -12]], { seg: 6, n: 2, gap: 1.6, off: [1, 0, 0], color: bright(.6) });
    trace(ellipse(0, 597, 5, 4, 0, 0, Math.PI * 2, 14), { seg: 4, n: 1, gap: 1, z: function () { return -14; }, color: bright(.8) });

    // ---- head: pegbox, pegs and scroll, in 3D; lines hidden behind the scroll or the pegbox are not drawn ----
    setFace(0, 0, 1, 1);
    var nrm = function (v) { return function () { return v; }; };
    var radial = function (p) { var dy = p[1] - SCY, dz = p[2] - SCZ, l = Math.hypot(dy, dz) || 1; return [0, dy / l, dz / l]; };
    var around = function (y0, z0) {
      return function (p) { var dy = p[1] - y0, dz = p[2] - z0, l = Math.hypot(dy, dz) || 1; return [0, dy / l, dz / l]; };
    };
    var down = function (fx, fz, y0, y1) {
      var pts = [];
      for (var y = y0; y <= y1 + .01; y += 3) pts.push([fx(y), y, fz(y)]);
      return pts;
    };

    // pegbox: cheeks with the dark opening between them, closed at the top; the nut at the bottom
    [1, -1].forEach(function (s) {
      trace3(down(function (y) { return s * cheekW(y); }, zFront, 40, 107), { seg: 14, n: 2, gap: 1.1, off: [s, 0, 0], normal: nrm([s * .5, 0, .85]), color: bright(.86) });
      trace3(down(function (y) { return s * openW(y); }, zFront, 46, 104), { seg: 14, n: 1, normal: nrm([0, 0, 1]), color: bright(.5) });
      trace3(down(function (y) { return s * cheekW(y); }, zBack, 40, 107), { seg: 16, n: 1, normal: nrm([s * .5, 0, -.85]), color: bright(.42) });
      trace3(down(function (y) { return s * cheekW(y); }, zMid, 44, 104), { seg: 18, n: 1, keep: .8, normal: nrm([s, 0, 0]), color: bright(.26) });
    });
    trace3(catmull([[-6, 48.5], [-4.6, 45.6], [0, 44.6], [4.6, 45.6], [6, 48.5]], 4).map(function (p) { return [p[0], p[1], zFront(p[1])]; }),
      { seg: 4, n: 1, normal: nrm([0, 0, 1]), color: bright(.5) });
    trace3([[-13, 107, 26.5], [13, 107, 26.5]], { seg: 13, n: 2, gap: 1.2, off: [0, 1, 0], normal: nrm([0, 0, 1]), color: bright(.92) });

    // pegs: shaft through the box, collar rings, a heart-shaped thumb piece with a small pip at its end
    // (from the top: A on the right, G on the left, E on the right, D on the left)
    var PEGS = [[1, 55], [-1, 65], [1, 78], [-1, 91]];
    var thumb = catmull([[25.5, -2.6], [26.6, -6.4], [29, -8.7], [32, -8.5], [34, -6.2], [36, -8], [38.6, -8.3], [40.8, -6],
      [41.6, -1.8], [41, 2.6], [39, 6.6], [35, 8.7], [30, 8.6], [27, 6.6], [25.5, 2.6]], 4);
    PEGS.forEach(function (pg) {
      var s = pg[0], y = pg[1], zp = zMid(y) + 2, w = cheekW(y);
      trace3([[s * w, y - 2.8, zp], [s * 22.2, y - 2.4, zp]], { seg: 6, n: 1, normal: nrm([0, -1, 0]), color: bright(.82) });
      trace3([[s * w, y + 2.8, zp], [s * 22.2, y + 2.4, zp]], { seg: 6, n: 1, normal: nrm([0, 1, 0]), color: bright(.6) });
      trace3([[s * w, y, zp + 2.8], [s * 22.2, y, zp + 2.4]], { seg: 7, n: 1, normal: nrm([0, 0, 1]), color: bright(.7) });
      trace3([[s * w, y - 2.4, zp], [-s * w, y - 2, zp]], { seg: 6, n: 1, normal: nrm([0, 0, 1]), color: bright(.4) });
      trace3([[-s * w, y - 1.7, zp], [-s * (w + 3.4), y - 1.5, zp]], { seg: 3.4, n: 1, normal: nrm([0, -1, 0]), color: bright(.74) });
      trace3([[-s * w, y + 1.7, zp], [-s * (w + 3.4), y + 1.5, zp]], { seg: 3.4, n: 1, normal: nrm([0, 1, 0]), color: bright(.6) });
      [[22.6, 3.3], [23.6, 2.8], [24.6, 3.3]].forEach(function (rg) {
        trace3(ringX(s * rg[0], y, zp, rg[1]), { seg: 3, n: 1, normal: around(y, zp), color: bright(.9) });
      });
      trace3(thumb.map(function (q) { return [s * q[0], y + q[1], zp + 1.3]; }), { seg: 4, n: 1, overlap: .3, normal: nrm([0, 0, 1]), color: bright(.9) });
      trace3(thumb.map(function (q) { return [s * q[0], y + q[1], zp - 1.3]; }), { seg: 5, n: 1, keep: .9, normal: nrm([0, 0, -1]), color: bright(.46) });
      trace3(ellipse(s * 34.5, y + .6, 4, 5.4, 0, 0, Math.PI * 2, 18).map(function (q) { return [q[0], q[1], zp + 1.6]; }),
        { seg: 4, n: 1, normal: nrm([0, 0, 1]), color: solid(.4, .08) });
      trace3(ringX(s * 42.6, y, zp, 1.3, 12), { seg: 2, n: 1, normal: around(y, zp), color: bright(.9) });
    });

    // strings over the nut, down into the box and wound onto their pegs (G and D on the left, A and E on the right)
    (function () {
      var g = groupCount++, ranks = pickRanks(4), ends = [[-3, 65], [-3.4, 91], [3, 55], [3.4, 78]];
      ends.forEach(function (e, j) {
        var ez = zMid(e[1]) + 4.6;
        emit(nutX[j], 107, e[0], e[1], (27.5 + ez) / 2, jitter(shade(.9), 10), g, ranks[j], (ez - 27.5) / 2, [0, 0, 1]);
        for (var wnd = 0; wnd < 3; wnd++) {
          trace3(ringX(e[0] + (e[0] < 0 ? -1 : 1) * wnd * .9, e[1], zMid(e[1]) + 2, 3.2, 12), { seg: 3, n: 1, normal: around(e[1], zMid(e[1]) + 2), color: bright(.78) });
        }
      });
    })();

    // scroll: the volute (geometry above). Side faces carry the spiral; the outer face of the first turn is fluted.
    var scrollPath = function (phi0, phi1, fx, dr) {
      var pts = [];
      for (var q = phi0; q <= phi1 + 1e-6; q += .05) pts.push(scrollAt(q, fx(q), dr));
      return pts;
    };
    [1, -1].forEach(function (s) {
      trace3(scrollPath(0, PHI, function (q) { return s * scrollW(q); }, -.8), { seg: 4, n: 1, overlap: .3, normal: nrm([s, 0, 0]), color: bright(.95) });
      trace3(scrollPath(.1, PHI - .4, function (q) { return s * (scrollW(q) - 1.3); }, 0), { seg: 4, n: 1, overlap: .3, normal: radial, color: bright(.72) });
      trace3(scrollPath(.9, PHI - 1.4, function (q) { return s * scrollW(q); }, function (r) { return -r * .3; }),
        { seg: 5, n: 1, overlap: .2, keep: .8, normal: nrm([s, 0, 0]), color: solid(.26, .06) });
      trace3(ringX(s * (scrollW(PHI) + .8), SCY, SCZ, 3.1, 16), { seg: 2.5, n: 1, normal: nrm([s, 0, 0]), color: bright(.97) });
      trace3(ringX(s * (scrollW(PHI) + 1.3), SCY, SCZ, 1.4, 10), { seg: 2, n: 1, normal: nrm([s, 0, 0]), color: bright(.9) });
    });
    // where each inner turn rolls over at its top and bottom; seen from the front these close off the ears
    [0, 1, 2].forEach(function (n) {
      [(1.5 * Math.PI - SA) + TAU * n, (.5 * Math.PI - SA + TAU) + TAU * n].forEach(function (q) {
        if (q < 6.5 || q > PHI - .3) return;   // the first turn's top and chin come from the fluting
        var w = scrollW(q), pts = [];
        for (var xx = -w; xx <= w + .01; xx += 1.5) pts.push(scrollAt(q, xx, 0));
        trace3(pts, { seg: 4, n: 1, normal: radial, color: bright(.82) });
      });
    });
    // fluting along the outer face of the first turn: a centre ridge between two grooves, ridges at the sides
    trace3(scrollPath(0, 5.6, function () { return 0; }, 0), { seg: 4, n: 1, overlap: .3, normal: radial, color: bright(.92) });
    [1, -1].forEach(function (s) {
      trace3(scrollPath(0, 5.6, function () { return s * 3.6; }, -.5), { seg: 4, n: 1, overlap: .3, normal: radial, color: solid(.34, .06) });
      trace3(scrollPath(0, 5.7, function (q) { return s * Math.min(7.2, scrollW(q) - 2.8); }, 0), { seg: 4, n: 1, overlap: .3, normal: radial, color: bright(.76) });
    });
    // chin: the rounded lower end of the fluted face, just above the opening
    var chin = [];
    for (var cx3 = -10.5; cx3 <= 10.51; cx3 += 1.5) chin.push([cx3, 29.6 + 2.3 * (1 - (cx3 / 10.5) * (cx3 / 10.5)), 6.5]);
    trace3(chin, { seg: 4, n: 2, gap: .9, off: [0, 1, 0], normal: nrm([0, .6, .8]), color: bright(.88) });
    setFace(0, 0, 1, 0);

    // ---- dots: light on the strings and the rim, glints on the body, a faint halo around ----
    function dot(x, y, z, b) { dots.push([x, y, z, clamp(b, 0, 255)]); }
    for (k = 0; k < 4; k++) {
      for (var sy = 112; sy < BRIDGE_Y; sy += 7) {
        if (rand() < .55) {
          var st = (sy - 107) / (BRIDGE_Y - 107);
          dot(nutX[k] + (brX[k] - nutX[k]) * st + (rand() - .5) * 1.5, sy + rand() * 6, 32 + st * 4, 150 + rand() * 90);
        }
      }
    }
    for (i = 0; i < outlineDense.length; i += 5) {
      if (rand() < .4) dot(outlineDense[i][0] + (rand() - .5) * 4, outlineDense[i][1] + (rand() - .5) * 4, 2 + (rand() - .5) * 10, 110 + rand() * 110);
    }
    for (i = 0; i < fN; i += 4) {
      var fo = fAt(i / (fN - 1), fW[i] + .6);
      dot(fo[0], fo[1], 10, 120 + rand() * 90);
      dot(-fo[0], fo[1], 10, 120 + rand() * 90);
    }
    for (var dp = 0; dp < PHI; dp += .5) {
      var ds = scrollAt(dp, (dp * 7 % 2 < 1 ? 1 : -1) * scrollW(dp), 0);
      dot(ds[0], ds[1], ds[2], 110 + rand() * 100);
    }
    for (k = 0; k < 420; k++) {
      var gx = (rand() * 2 - 1) * 100, gy = BODY_TOP + rand() * 356;
      if (insideBody(gx, gy)) dot(gx, gy, arch(gx, gy) + (rand() - .5) * 30, 50 + rand() * 110 * bodyLight(gx, gy));
    }
    for (k = 0; k < 520; k++) {
      var ha = rand() * Math.PI * 2, hr = Math.sqrt(rand());
      var hx = Math.cos(ha) * hr * 250, hy = 330 + Math.sin(ha) * hr * 400;
      if (insideBody(hx, hy) || (Math.abs(hx) < 30 && hy < BODY_TOP)) continue;
      dot(hx, hy, (rand() * 2 - 1) * 90, 30 + rand() * 90 * (1 - hr * .6));
    }
  }
  buildViolin();

  // ========================================
  // Per-stroke state
  // ========================================
  var nS = strokes.length, nD = dots.length;
  function F(n) { return new Float32Array(n); }
  var sMx = F(nS), sMy = F(nS), sMz = F(nS), sHx = F(nS), sHy = F(nS), sHz = F(nS);
  var sLen = F(nS), sStartX = F(nS), sStartY = F(nS), sOx = F(nS), sOy = F(nS), sVx = F(nS), sVy = F(nS);
  var sGroup = new Int32Array(nS), sRank = new Int32Array(nS);
  var X1 = F(nS), Y1 = F(nS), X2 = F(nS), Y2 = F(nS), VIS = new Uint8Array(nS), DEPTH = new Uint8Array(nS);
  var NX = F(nS), NY = F(nS), NZ = F(nS), MODE = new Uint8Array(nS), HID = new Uint8Array(nS), headIdx = [];
  var DEPTH_ALPHA = [.16, .38, .7, 1];   // facing away ... facing the viewer
  var nG = groupCount, gDelay = F(nG), gBendX = F(nG), gBendY = F(nG), gSlot = F(nG);
  var gFx = F(nG), gFy = F(nG), gFz = F(nG), gN = F(nG), gCx = F(nG), gCy = F(nG);
  var dDelay = F(nD), dBendX = F(nD), dBendY = F(nD), dStartX = F(nD), dRow = new Int8Array(nD);
  var dOx = F(nD), dOy = F(nD), dVx = F(nD), dVy = F(nD), dPhase = F(nD), dTwinkle = F(nD);

  (function () {
    var i, k, order = [];
    for (i = 0; i < nG; i++) {
      order.push(i); gDelay[i] = rand(); gBendX[i] = rand() * 2 - 1; gBendY[i] = rand() * 2 - 1;
    }
    for (i = nG - 1; i > 0; i--) { var j = Math.floor(rand() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; }
    for (i = 0; i < nG; i++) gSlot[order[i]] = i / nG;
    for (k = 0; k < nS; k++) {
      var s = strokes[k], g = s[8];
      sMx[k] = (s[0] + s[2]) / 2; sMy[k] = (s[1] + s[3]) / 2; sMz[k] = s[4];
      sHx[k] = (s[2] - s[0]) / 2; sHy[k] = (s[3] - s[1]) / 2; sHz[k] = s[10] || 0;
      sGroup[k] = g; sRank[k] = s[9];
      NX[k] = s[11]; NY[k] = s[12]; NZ[k] = s[13]; MODE[k] = s[14];
      if (s[14] === 1) headIdx.push(k);
      gFx[g] += sMx[k]; gFy[g] += sMy[k]; gFz[g] += sMz[k]; gN[g]++;
    }
    for (i = 0; i < nG; i++) { gFx[i] /= gN[i] || 1; gFy[i] /= gN[i] || 1; gFz[i] /= gN[i] || 1; }
    for (k = 0; k < nD; k++) {
      dDelay[k] = rand(); dBendX[k] = rand() * 2 - 1; dBendY[k] = rand() * 2 - 1;
      dStartX[k] = rand(); dRow[k] = Math.floor(rand() * 5);
      dPhase[k] = rand() * Math.PI * 2; dTwinkle[k] = .6 + rand() * 2;
    }
  })();

  // A head stroke is hidden when a ray from it towards the viewer runs into the pegbox or the scroll
  function headHidden(k, sT, cT) {
    var ux = -sT, uz = cT;   // towards the viewer, in the violin's own coordinates
    var x = sMx[k] + NX[k] * .9 + ux * .4, y = sMy[k] + NY[k] * .9, z = sMz[k] + NZ[k] * .9 + uz * .4;
    for (var i = 0; i < 70; i++) {
      if (insideHead(x, y, z)) return 1;
      x += ux; z += uz;
      if (x > 46 || x < -46 || z > 46 || z < -44) return 0;
    }
    return 0;
  }

  // colour batches: one canvas stroke() per colour
  var batches = [];
  (function () {
    var map = {};
    for (var k = 0; k < nS; k++) {
      var s = strokes[k], q = function (v) { return (clamp(Math.round(v), 0, 255) >> 4 << 4) + 8; };
      var key = q(s[5]) + ',' + q(s[6]) + ',' + q(s[7]);
      if (!map[key]) { map[key] = { rgb: key, idx: [] }; batches.push(map[key]); }
      map[key].idx.push(k);
    }
  })();
  var dotBatches = [];
  (function () {
    var map = {};
    for (var k = 0; k < nD; k++) {
      var key = dots[k][3] >> 5;
      if (!map[key]) { map[key] = { a: Math.min(1, .4 + dots[k][3] / 160), idx: [] }; dotBatches.push(map[key]); }
      map[key].idx.push(k);
    }
  })();

  var sprite = document.createElement('canvas');
  sprite.width = sprite.height = 32;
  (function () {
    var c = sprite.getContext('2d'), g = c.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(.25, 'rgba(236,238,255,.85)');
    g.addColorStop(.55, 'rgba(176,192,255,.28)');
    g.addColorStop(1, 'rgba(176,192,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, 32, 32);
  })();

  // ========================================
  // Layout
  // ========================================
  var W = 0, H = 0, dpr = 1, mobile = false, SC = 1, OX = 0, OY = 0, staffY = 0, staffGap = 30, reach = 150;
  var FIG_TOP = -6, FIG_BOTTOM = 604, FIG_CENTER = 430;

  function layout() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, W < 900 ? 3 : 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    mobile = W < 900;
    reach = mobile ? 100 : 150;
    if (mobile) {
      SC = Math.min(H * .9 / (FIG_BOTTOM - FIG_TOP), W * .52 / 210);
      OX = W * .65; OY = H * .05 - FIG_TOP * SC;
    } else {
      SC = H * .95 / (FIG_BOTTOM - FIG_TOP);
      OX = Math.max(W * .71, Math.min(W * .75, W - 190 * SC)); OY = H * .035 - FIG_TOP * SC;
    }
    // phone: start the lead text just under the violin
    if (leadEl) {
      if (mobile && titleEl) {
        var titleBottom = titleEl.offsetTop + titleEl.offsetHeight;
        leadEl.style.marginTop = Math.max(24, OY + FIG_BOTTOM * SC + 18 - titleBottom) + 'px';
      } else {
        leadEl.style.marginTop = '';
      }
    }
    staffGap = Math.max(H * .04, 24);
    staffY = mobile ? Math.min(window.innerHeight * .45, H * .6) : H * .5;
    for (var k = 0; k < nS; k++) {
      sLen[k] = Math.hypot(sHx[k], sHy[k]) * 2 * SC + 3;
      sStartX[k] = gSlot[sGroup[k]] * W * 1.12 - W * .04;
      sStartY[k] = staffY + (sRank[k] - 2) * staffGap;
    }
  }

  // ========================================
  // Pointer forces
  // ========================================
  var px = -9999, py = -9999, hover = false, active = 0;
  var rippleX = 0, rippleY = 0, rippleT = -99, IX = 0, IY = 0;
  function force(x, y, T, dt, k) {
    var fx = 0, fy = 0, dx, dy, d, w;
    if (active > .01) {
      dx = x - px; dy = y - py; d = Math.sqrt(dx * dx + dy * dy) + .001;
      if (d < reach) {
        w = 1 - d / reach; w *= w * active * k * 3.4;
        fx += dx / d * w - dy / d * w * .55; fy += dy / d * w + dx / d * w * .55;
      }
    }
    var tau = T - rippleT;
    if (tau >= 0 && tau < 2.2) {
      dx = x - rippleX; dy = y - rippleY; d = Math.sqrt(dx * dx + dy * dy) + .001;
      var q = (d - tau * 560) / 90;
      w = Math.exp(-q * q) * (1 - tau / 2.2) * 3.2 * k;
      fx += dx / d * w; fy += dy / d * w;
    }
    IX = fx * dt; IY = fy * dt;
  }

  // ========================================
  // Frame
  // ========================================
  // `turn` is free (any number of full turns by dragging), `lean` follows the cursor's side, `sway` is the idle motion
  var turn = 0, spin = 0, lean = 0, leanV = 0, dragging = false, dragLast = 0, lastTouch = -99, lastT = 0, occTh = 1e9;

  function frame(t) {
    var dt = reduceMotion ? 0 : Math.min(2, Math.max(.3, (t - lastT) * 60));
    lastT = t;

    // turning: a slow sway, the cursor's side, and drags (which keep spinning a little after release,
    // then the violin comes back round to the front)
    var sway = reduceMotion ? 0 : .28 * Math.sin(.3 * Math.max(0, t - 3.8));
    if (dt > 0) {
      var target = (active > .01 && t > 4.6 && !dragging) ? clamp((px - OX) / (W * .5), -1, 1) * .42 * active : 0;
      leanV += (target - lean) * .016 * dt; leanV *= Math.pow(.9, dt); lean += leanV * dt;
      if (dragging) {
        spin *= Math.pow(.8, dt);
      } else {
        turn += spin * dt; spin *= Math.pow(.95, dt);
        if (Math.abs(spin) < .004 && t - lastTouch > 2.5) {
          var front = Math.round(turn / (Math.PI * 2)) * Math.PI * 2;
          turn += (front - turn) * .025 * dt;
        }
      }
    }
    var th = sway + lean + turn, cT = Math.cos(th), sT = Math.sin(th);
    if (Math.abs(th - occTh) > .012) {
      occTh = th;
      for (var hk = 0; hk < headIdx.length; hk++) HID[headIdx[hk]] = headHidden(headIdx[hk], sT, cT);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, W, H);

    // glow behind the violin
    var settle = ease((t - 2.6) / 1.6), gcx = OX, gcy = OY + FIG_CENTER * SC, R = Math.max(SC * 250, 80) * 1.6;
    var glow = ctx.createRadialGradient(gcx, gcy, 0, gcx, gcy, R);
    glow.addColorStop(0, 'rgba(64,84,206,' + (.22 * (.5 + .5 * settle)) + ')');
    glow.addColorStop(.6, 'rgba(40,56,160,' + (.08 * settle) + ')');
    glow.addColorStop(1, 'rgba(40,56,160,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

    var drawn = ease(t / 1.2), k, i, e;

    // where each fragment gathers on the way: its place on the violin, laid flat as a little staff
    if (t < 6) {
      for (i = 0; i < nG; i++) { gCx[i] = OX + (gFx[i] * cT + gFz[i] * sT) * SC; gCy[i] = OY + gFy[i] * SC; }
    }
    var fragGap = SC * 3 + 2;

    for (k = 0; k < nS; k++) {
      var g = sGroup[k];
      e = ease((t - 1.1 - gDelay[g] * 1.3) / 1.5);
      var mx = sMx[k] * cT + sMz[k] * sT, hx = sHx[k] * cT + sHz[k] * sT;
      var fx1 = OX + (mx - hx) * SC, fx2 = OX + (mx + hx) * SC;
      var fy1 = OY + (sMy[k] - sHy[k]) * SC, fy2 = OY + (sMy[k] + sHy[k]) * SC;
      var x1, y1, x2, y2;
      if (e <= 0) {
        x1 = sStartX[k]; y1 = sStartY[k]; x2 = x1 + sLen[k]; y2 = y1;
      } else {
        var e1 = ease(e / .55), e2 = ease((e - .45) / .55);
        var arc = Math.sin(Math.PI * e1), bx = arc * gBendX[g] * W * .05, by = arc * gBendY[g] * H * .12;
        var half = sLen[k] / 2, qy = gCy[g] + (sRank[k] - 2) * fragGap;
        var a1x = sStartX[k] + (gCx[g] - half - sStartX[k]) * e1 + bx;
        var a1y = sStartY[k] + (qy - sStartY[k]) * e1 + by;
        var a2x = sStartX[k] + sLen[k] + (gCx[g] + half - sStartX[k] - sLen[k]) * e1 + bx;
        x1 = a1x + (fx1 - a1x) * e2; y1 = a1y + (fy1 - a1y) * e2;
        x2 = a2x + (fx2 - a2x) * e2; y2 = a1y + (fy2 - a1y) * e2;
      }
      if (e >= 1 && dt > 0) {
        if (active > .01 || t - rippleT < 2.2) {
          force((x1 + x2) / 2 + sOx[k], (y1 + y2) / 2 + sOy[k], t, dt, 1);
          sVx[k] += IX; sVy[k] += IY;
        }
        sVx[k] = (sVx[k] - .05 * sOx[k] * dt) * Math.pow(.9, dt);
        sVy[k] = (sVy[k] - .05 * sOy[k] * dt) * Math.pow(.9, dt);
        sOx[k] += sVx[k] * dt; sOy[k] += sVy[k] * dt;
      }
      X1[k] = x1 + sOx[k]; Y1[k] = y1 + sOy[k]; X2[k] = x2 + sOx[k]; Y2[k] = y2 + sOy[k];
      // brightness by how much the surface faces the viewer; hidden head strokes fade out as they land
      var bin, land = e <= 0 ? 0 : ease((e - .45) / .55);
      if (MODE[k] === 1) bin = HID[k] ? -1 : 3;
      else { var f = -sT * NX[k] + cT * NZ[k]; bin = f > .35 ? 3 : f > .05 ? 2 : f > -.3 ? 1 : 0; }
      if (land < 1) { var cap = 3 - Math.floor(land * 4); if (cap > bin) bin = cap; }
      DEPTH[k] = bin < 0 ? 0 : bin;
      VIS[k] = bin >= 0 && (e > 0 || sStartX[k] <= drawn * W * 1.05 - W * .05) ? 1 : 0;
    }

    ctx.lineCap = 'round';
    ctx.lineWidth = mobile ? 1 : 1.3;
    var alpha = (mobile ? .8 : .92) * (.6 + .4 * settle);
    for (i = 0; i < batches.length; i++) {
      var idx = batches[i].idx;
      for (var b4 = 0; b4 < 4; b4++) {
        var any = false;
        ctx.beginPath();
        for (var q = 0; q < idx.length; q++) {
          k = idx[q];
          if (!VIS[k] || DEPTH[k] !== b4) continue;
          ctx.moveTo(X1[k], Y1[k]); ctx.lineTo(X2[k], Y2[k]); any = true;
        }
        if (!any) continue;
        ctx.strokeStyle = 'rgba(' + batches[i].rgb + ',' + alpha * DEPTH_ALPHA[b4] + ')';
        ctx.stroke();
      }
    }

    // dots: sit on the staff while it is drawn, then fly to the violin and twinkle
    var dotsIn = ease((t - .2) / 1.4);
    if (dotsIn > 0) {
      ctx.globalCompositeOperation = 'lighter';
      var size = Math.max(.8, Math.min(1.3, SC * 1.5)) * (mobile ? .8 : 1);
      for (i = 0; i < dotBatches.length; i++) {
        var di = dotBatches[i].idx, da = dotBatches[i].a;
        for (q = 0; q < di.length; q++) {
          k = di[q];
          var d = dots[k];
          e = ease((t - 1.4 - dDelay[k] * 1.4) / 1.5);
          var dxr = d[0] * cT + d[2] * sT, dzr = -d[0] * sT + d[2] * cT;
          var hxp = OX + dxr * SC, hyp = OY + d[1] * SC, sx = dStartX[k] * W * 1.1 - W * .05, sy = staffY + (dRow[k] - 2) * staffGap;
          if (e <= 0 && sx > drawn * W * 1.05 - W * .05) continue;
          var ppx, ppy;
          if (e <= 0) { ppx = sx; ppy = sy; }
          else {
            var arc2 = Math.sin(Math.PI * e);
            ppx = sx + (hxp - sx) * e + arc2 * dBendX[k] * W * .05;
            ppy = sy + (hyp - sy) * e + arc2 * dBendY[k] * H * .12;
          }
          if (e >= 1 && dt > 0) {
            if (active > .01 || t - rippleT < 2.2) { force(ppx + dOx[k], ppy + dOy[k], t, dt, 1.5); dVx[k] += IX; dVy[k] += IY; }
            dVx[k] = (dVx[k] - .04 * dOx[k] * dt) * Math.pow(.92, dt);
            dVy[k] = (dVy[k] - .04 * dOy[k] * dt) * Math.pow(.92, dt);
            dOx[k] += dVx[k] * dt; dOy[k] += dVy[k] * dt;
            ppx += Math.sin(t * 5.9 + dPhase[k] * 9) * .8; ppy += Math.cos(t * 5.3 + dPhase[k] * 7) * .8;
          }
          var depth = clamp(.5 + dzr / 220, 0, 1);
          var a = da * dotsIn * (.7 + .3 * depth) * (e >= 1 ? (.55 + .45 * Math.sin(t * dTwinkle[k] + dPhase[k])) : .5);
          var sz = (2.6 + d[3] / 60) * size;
          ctx.globalAlpha = a > 1 ? 1 : a;
          ctx.drawImage(sprite, ppx + dOx[k] - sz / 2, ppy + dOy[k] - sz / 2, sz, sz);
        }
      }
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }

    if (mobile) {
      var f0 = Math.min(OY + FIG_BOTTOM * SC, H * .86), fade = ctx.createLinearGradient(0, f0, 0, H);
      fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = fade; ctx.fillRect(0, f0, W, H - f0);
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  // ========================================
  // Run
  // ========================================
  var start = 0, raf = 0, onScreen = true, ready = false;
  function setReady() { if (!ready) { ready = true; body.classList.add('is-ready'); } }
  function loop(now) {
    if (!start) start = now;
    var t = (now - start) / 1000;
    active += ((hover ? 1 : 0) - active) * .1;
    frame(t);
    if (t > 1.5) setReady();
    raf = onScreen && !document.hidden ? requestAnimationFrame(loop) : 0;
  }
  function wake() { if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(loop); }

  layout();
  if (reduceMotion) {
    frame(99); setReady();
    window.addEventListener('resize', function () { layout(); frame(99); });
    return;
  }
  raf = requestAnimationFrame(loop);
  setTimeout(setReady, 4500);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  window.addEventListener('resize', layout);

  hero.addEventListener('pointermove', function (e) {
    var r = canvas.getBoundingClientRect(), x = e.clientX - r.left;
    if (dragging) { var dx = x - dragLast; dragLast = x; turn += dx * .0075; spin = dx * .0075; lastTouch = lastT; }
    px = x; py = e.clientY - r.top; hover = true;
  }, { passive: true });
  hero.addEventListener('pointerleave', function () { hover = false; if (dragging) { dragging = false; lastTouch = lastT; } });
  hero.addEventListener('pointerdown', function (e) {
    if (e.target.closest && e.target.closest('a, button')) return;
    var r = canvas.getBoundingClientRect();
    rippleX = e.clientX - r.left; rippleY = e.clientY - r.top; rippleT = lastT;
    dragging = true; dragLast = rippleX; spin = 0; lastTouch = lastT;
  }, { passive: true });
  window.addEventListener('pointerup', function () { if (dragging) { dragging = false; lastTouch = lastT; } });
  document.addEventListener('visibilitychange', wake);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { onScreen = entries[0].isIntersecting; wake(); }, { threshold: 0 }).observe(hero);
  }
})();
