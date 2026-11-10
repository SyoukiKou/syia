/**
 * Build - SYIA Portfolio
 *
 * js/concerts.js と js/information.js の内容を、HTML として書き出します。
 * JavaScript を動かさなくても中身が読めるので、検索エンジンや SNS のリンクプレビューにも届きます。
 *
 *   concert/<id>.html   公演ごとのページ（アドレスは /concert/<id>）。concert.html をひな形にして作ります
 *   concert.html        公演の一覧（<!-- build:concert --> のところ）
 *   information.html    お知らせの一覧と年の絞り込み（<!-- build:information... --> のところ）
 *   index.html          トップページの最新公演2件（<!-- build:home-latest --> のところ）
 *   sitemap.xml         検索エンジン向けのページ一覧（noindex のページは載せません）
 *
 * 公演やお知らせを書き換えたら、プレビューの前にこれを実行します:
 *   node scripts/build.mjs
 * Vercel でもデプロイのたびに自動で実行されます（vercel.json の buildCommand）。
 * そのときは --out public を付けて、公開するファイル一式を public/ にコピーします（Vercel は public/ を公開します）。
 * 書き出されたところは手で直さず、js/concerts.js・js/information.js か、このファイルを直してください。
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, unlinkSync, existsSync, rmSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://syiaviolin.com';
const TITLE_SUFFIX = ' | SYIA（しあ）ヴァイオリニスト';
const DEFAULT_IMAGE = 'images/ogp.jpg';
const HOME_LATEST = 2;   // concerts shown on the home page
const GENERATED = '<!-- This file is made by scripts/build.mjs from concert.html and js/concerts.js. Do not edit it by hand. -->';

const read = (file) => readFileSync(join(ROOT, file), 'utf8');
const warnings = [];
const warn = (msg) => warnings.push(msg);
let written = 0;
function write(file, text) {
  const path = join(ROOT, file);
  if (existsSync(path) && readFileSync(path, 'utf8') === text) return;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
  written++;
  console.log('  wrote ' + file);
}

// ----------------------------------------
// Data
// ----------------------------------------
const sandbox = { window: {} };
vm.runInNewContext(read('js/concerts.js') + '\n;\n' + read('js/information.js'), sandbox, { filename: 'js/concerts.js + js/information.js' });
const byDateDesc = (a, b) => String(b.date).localeCompare(String(a.date));
const concerts = (sandbox.window.SYIA_CONCERTS || []).filter((c) => c && c.id).sort(byDateDesc);
const news = (sandbox.window.SYIA_INFORMATION || []).filter((n) => n && n.date && n.title).sort(byDateDesc);

const seen = new Set();
for (const c of concerts) {
  if (!/^[A-Za-z0-9][A-Za-z0-9-]*$/.test(c.id)) throw new Error(`js/concerts.js: id "${c.id}" は半角英数字とハイフンだけにしてください`);
  if (seen.has(c.id)) throw new Error(`js/concerts.js: id "${c.id}" が2回使われています`);
  seen.add(c.id);
  if (!c.title) throw new Error(`js/concerts.js: ${c.id} に title がありません`);
}

// ----------------------------------------
// Text helpers (the same rules js/main.js used to follow in the browser)
// ----------------------------------------
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
// 2026-10-24 -> "2026.10/24 (Sat)"; with dateEnd, "2025.11/22 (Sat) – 12/25 (Thu)" (the year again only if it changes)
function concertDate(c) {
  if (c.dateText) return c.dateText;
  const day = (iso, withYear) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return iso || '';
    const wd = WEEKDAYS[new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).getUTCDay()];
    return (withYear ? m[1] + '.' : '') + m[2] + '/' + m[3] + ' (' + wd + ')';
  };
  let text = day(c.date, true);
  if (c.dateEnd) text += ' – ' + day(c.dateEnd, String(c.dateEnd).slice(0, 4) !== String(c.date).slice(0, 4));
  return text;
}
const concertPath = (id) => 'concert/' + id;
// links written the old way (concert#id) go to the concert's own page
const siteUrl = (url) => String(url).replace(/^\/?concert#([A-Za-z0-9-]+)$/, 'concert/$1');
function linkAttrs(url) {
  url = siteUrl(url);
  return 'href="' + url + '"' + (/^https?:/.test(url) ? ' target="_blank" rel="noopener noreferrer"' : '');
}
// text inside a paragraph: [text](url) links, <small> <b> <strong> <em>, line breaks
function inlineText(s) {
  return escapeHtml(s)
    .replace(/&lt;(\/?)(small|b|strong|em)&gt;/g, '<$1$2>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (all, text, url) => '<a ' + linkAttrs(url) + '>' + text + '</a>')
    .replace(/\n/g, '<br>');
}
// the same text without markup, for descriptions
function plainText(s) {
  return String(s || '').replace(/<\/?(small|b|strong|em)>/g, '').replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1').replace(/\s+/g, ' ').trim();
}
function cut(s, max) {
  const chars = Array.from(s);
  return chars.length > max ? chars.slice(0, max - 1).join('') + '…' : s;
}

// ----------------------------------------
// Image sizes (JPEG / PNG), so pages reserve the space and flyers get their narrower frame without JavaScript
// ----------------------------------------
const sizeCache = new Map();
function imageSize(src) {
  if (/^(https?:)?\/\//.test(src)) return null;
  const file = String(src).replace(/^\//, '').split(/[?#]/)[0];
  if (sizeCache.has(file)) return sizeCache.get(file);
  let size = null;
  if (!existsSync(join(ROOT, file))) warn(`画像が見つかりません: ${file}`);
  else {
    const b = readFileSync(join(ROOT, file));
    if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) size = { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    else if (b[0] === 0xff && b[1] === 0xd8) {
      for (let i = 2; i + 9 < b.length;) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1];
        if (m === 0xff) { i++; continue; }
        if (m === 0x01 || (m >= 0xd0 && m <= 0xd8)) { i += 2; continue; }
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) { size = { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) }; break; }
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
  }
  sizeCache.set(file, size);
  return size;
}
function img(src, alt, opts = {}) {
  const s = imageSize(src);
  return '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(alt) + '"' +
    (s ? ' width="' + s.w + '" height="' + s.h + '"' : '') +
    (opts.eager ? (opts.priority ? ' fetchpriority="high"' : '') : ' loading="lazy"') + '>';
}
// tall pictures (flyers) and middling ones are shown narrower than wide banners
function figureClass(src) {
  const s = imageSize(src);
  if (!s) return '';
  if (s.h > s.w * 1.1) return ' article__figure--portrait';
  if (s.w < s.h * 2.2) return ' article__figure--medium';
  return '';
}

// ----------------------------------------
// A concert's body, in the simple format described at the top of js/concerts.js
// ----------------------------------------
function renderBody(src) {
  const lines = String(src || '').replace(/\r/g, '').split('\n');
  let at = 0, images = 0;
  const IMAGE = /!\[([^\]]*)\]\(([^)\s]+)\)/g;
  const isImages = (l) => /^(!\[[^\]]*\]\([^)\s]+\)\s*)+$/.test(l);
  const isButton = (l) => /^\[[^\]]+\]\([^)\s]+\)$/.test(l);
  const isDirective = (l) => /^@(map|youtube|columns|next|end|profile)\b/.test(l) || /^#{2,4}\s/.test(l) || l === '---';
  const http = (u) => /^https:\/\//.test(u) ? escapeHtml(u) : '';
  // the first picture is usually in the first screen: load it at once, the rest as they come near
  const picture = (src, alt) => { const first = images++ === 0; return img(src, alt, { eager: first, priority: first }); };

  // inner: inside @columns / @profile (no text wrapper); stops at a line matching `until`
  function parse(inner, until) {
    let html = '', text = '', blanks = 0, m;
    const flush = () => { if (text) { html += inner ? text : '<div class="article__text reveal">' + text + '</div>'; text = ''; } };
    while (at < lines.length) {
      const line = lines[at].trim();
      if (until && until.test(line)) { flush(); return { html, stop: line }; }
      if (!line) { blanks++; at++; continue; }
      const gap = blanks >= 2 ? ' u-gap' : '';
      blanks = 0;
      if ((m = /^@map\s+(\S+)/.exec(line))) {
        flush(); at++;
        html += '<div class="article__embed reveal"><iframe src="' + http(m[1]) + '" title="Google マップ" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>';
      } else if ((m = /^@youtube\s+(\S+)/.exec(line))) {
        flush(); at++;
        html += '<div class="article__embed article__embed--video reveal"><iframe src="' + http(m[1]) + '" title="YouTube video player" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>';
      } else if (line === '@columns') {
        flush(); at++;
        const cols = []; let r;
        do { r = parse(true, /^@(next|end)$/); cols.push('<div>' + r.html + '</div>'); at++; } while (r.stop === '@next');
        html += '<div class="article__columns reveal">' + cols.join('') + '</div>';
      } else if ((m = /^@profile\s+(\S+)/.exec(line))) {
        flush(); at++;
        const p = parse(true, /^@end$/);
        at++;
        let name = '';
        const txt = p.html.replace(/^<h3 class="article__subheading">([\s\S]*?)<\/h3>/, (all, n) => { name = n; return ''; });
        const alt = name.replace(/<[^>]+>/g, '').replace(/\s*[(（][^)）]*[)）]\s*$/, '').replace(/&amp;/g, '&');
        html += '<div class="article__profile reveal"><figure class="article__profile__image">' + picture(m[1], alt) + '</figure>' +
          '<div class="article__profile__text">' + (name ? '<h3 class="article__profile__name">' + name + '</h3>' : '') + txt + '</div></div>';
      } else if (line === '---') {
        at++; text += '<hr class="article__divider">';
      } else if ((m = /^(#{2,4})\s+(.*)$/.exec(line))) {
        at++;
        const level = m[1].length, cls = level === 2 ? 'article__heading' : level === 3 ? 'article__subheading' : 'article__label';
        text += '<h' + level + ' class="' + cls + '">' + inlineText(m[2]) + '</h' + level + '>';
      } else {
        const block = [];
        while (at < lines.length && lines[at].trim() && !isDirective(lines[at].trim()) && !(until && until.test(lines[at].trim()))) {
          block.push(lines[at].trim()); at++;
        }
        if (block.every(isImages)) {
          flush();
          for (const l of block) {
            const found = [...l.matchAll(IMAGE)];
            html += found.length > 1
              ? '<div class="article__gallery reveal">' + found.map((f) => '<figure>' + picture(f[2], f[1]) + '</figure>').join('') + '</div>'
              : '<figure class="article__figure' + figureClass(found[0][2]) + ' reveal">' + picture(found[0][2], found[0][1]) + '</figure>';
          }
        } else if (block.every(isButton)) {
          flush();
          html += '<div class="article__buttons reveal">' + block.map((l) => {
            const b = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(l);
            return '<a class="link-underline article__button" ' + linkAttrs(escapeHtml(b[2])) + '>' + escapeHtml(b[1]) + '</a>';
          }).join('') + '</div>';
        } else {
          const note = block.every((l) => l.charAt(0) === '※');
          text += '<p' + (note || gap ? ' class="' + ((note ? 'article__note' : '') + gap).trim() + '"' : '') + '>' + inlineText(block.join('\n')) + '</p>';
        }
      }
    }
    flush();
    return { html, stop: null };
  }
  return parse(false, null).html;
}

// The opening sentences of a concert (plain paragraphs only), for its description
function leadText(src) {
  const out = [];
  let para = [];
  const end = () => { if (para.length) out.push(para.join('')); para = []; };
  for (const raw of String(src || '').split('\n')) {
    const l = raw.trim();
    if (!l) { end(); continue; }
    if (/^(!\[|#|@|---|※)/.test(l) || /^\[[^\]]+\]\([^)\s]+\)$/.test(l)) { end(); continue; }
    para.push(plainText(l));
    if (out.join('').length > 200) break;
  }
  end();
  return out.join(' ');
}

// ----------------------------------------
// Page pieces
// ----------------------------------------
function region(html, name, content, file) {
  const re = new RegExp('(<!-- build:' + name + ' -->)[\\s\\S]*?(\\n?[ \\t]*<!-- /build:' + name + ' -->)');
  if (!re.test(html)) throw new Error(`${file}: <!-- build:${name} --> … <!-- /build:${name} --> が見つかりません`);
  return html.replace(re, (all, open, close) => open + content + close);
}
function indent(lines, pad) { return lines.map((l) => '\n' + pad + l).join(''); }

function setHead(html, page) {
  const attr = escapeHtml;
  const replace = (re, value, what) => {
    if (!re.test(html)) throw new Error(`concert.html: ${what} が見つかりません`);
    html = html.replace(re, typeof value === 'function' ? value : () => value);
  };
  replace(/<title>[\s\S]*?<\/title>/, '<title>' + escapeHtml(page.title) + '</title>', '<title>');
  replace(/<meta name="description" content="[^"]*" \/>/, '<meta name="description" content="' + attr(page.description) + '" />', 'description');
  replace(/<link rel="canonical" href="[^"]*" \/>/, '<link rel="canonical" href="' + page.url + '" />', 'canonical');
  replace(/<meta property="og:title" content="[^"]*" \/>/, '<meta property="og:title" content="' + attr(page.title) + '" />', 'og:title');
  replace(/<meta property="og:description" content="[^"]*" \/>/, '<meta property="og:description" content="' + attr(page.description) + '" />', 'og:description');
  replace(/<meta property="og:url" content="[^"]*" \/>/, '<meta property="og:url" content="' + page.url + '" />', 'og:url');
  const size = imageSize(page.image);
  replace(/<meta property="og:image" content="[^"]*" \/>(\n\s*<meta property="og:image:(width|height)" content="\d+" \/>)*/,
    '<meta property="og:image" content="' + SITE + '/' + attr(page.image) + '" />' +
    (size ? '\n  <meta property="og:image:width" content="' + size.w + '" />\n  <meta property="og:image:height" content="' + size.h + '" />' : ''), 'og:image');
  // the page sits one folder down (/concert/<id>): every relative address still starts from the site root
  replace(/<meta name="viewport"[^>]*>/, (tag) => tag + '\n  <base href="/" />', 'viewport');
  return html;
}

function concertListItem(c, i) {
  return '<li class="reveal"><a class="exhibition-item" href="' + concertPath(c.id) + '">' +
    '<div class="exhibition-item__image">' + (c.cover ? img(c.cover, '', { eager: i < 2 }) : '') + '</div>' +
    '<div class="exhibition-item__content"><p class="exhibition-item__date"><time datetime="' + escapeHtml(c.date) + '">' + escapeHtml(concertDate(c)) + '</time></p>' +
    '<h2 class="exhibition-item__title">' + escapeHtml(c.title) + '</h2>' +
    (c.venue ? '<p class="exhibition-item__venue">' + escapeHtml(c.venue) + '</p>' : '') + '</div></a></li>';
}

function concertPage(template, c, i) {
  const prev = concerts[i - 1], next = concerts[i + 1];
  const description = c.description || cut([concertDate(c), c.venue].filter(Boolean).join('　') + '。' + leadText(c.body), 120);
  let html = setHead(template, {
    title: c.title + TITLE_SUFFIX,
    description,
    url: SITE + '/' + concertPath(c.id),
    image: c.cover || DEFAULT_IMAGE,
  });
  // the concert's title is the page's main heading; "Concert" above it is a label
  html = html.replace(/<h1 class="archive-header__title">([\s\S]*?)<\/h1>/, '<p class="archive-header__title">$1</p>');
  // concerts are newest first, so the left link goes to the newer concert and the right one to the older.
  // Each link shows where it leads (date and title), so the direction is clear without hovering.
  const pagerLink = (side, label, to) => {
    const name = '<span class="page-links__label">' + label + '</span>';
    if (!to) return '<span class="page-links__' + side + '">' + name + '</span>';
    return '<a class="page-links__' + side + '" href="' + concertPath(to.id) + '">' + name +
      '<span class="page-links__to"><time class="page-links__date" datetime="' + escapeHtml(to.date) + '">' + escapeHtml(String(to.date).replace(/-/g, '.')) + '</time>' +
      '<span class="page-links__title">' + escapeHtml(to.title) + '</span></span></a>';
  };
  const pager =
    pagerLink('prev', 'Newer', prev) +
    '<a class="page-links__index" href="concert">Concert</a>' +
    pagerLink('next', 'Older', next);
  html = region(html, 'concert', indent([
    '<article class="article" id="concertDetail">',
    '  <header class="article__header"><p class="article__date"><time datetime="' + escapeHtml(c.date) + '">' + escapeHtml(concertDate(c)) + '</time></p>' +
      '<h1 class="article__title">' + escapeHtml(c.title) + '</h1></header>',
    '  ' + renderBody(c.body),
    '</article>',
    '<div class="page-links">',
    '  <div class="page-links__content">' + pager + '</div>',
    '</div>',
  ], '  '), 'concert.html');
  return html.replace(/^<!DOCTYPE html>\n/i, (d) => d + GENERATED + '\n');
}

// ----------------------------------------
// Write
// ----------------------------------------
console.log(`Building from ${concerts.length} concerts and ${news.length} news items`);

// Concert list + one page per concert
let concertHtml = read('concert.html');
concertHtml = region(concertHtml, 'concert', indent([
  '<ul class="exhibition-list concert-list" id="concertList">',
  ...concerts.map((c, i) => '  ' + concertListItem(c, i)),
  '</ul>',
], '  '), 'concert.html');
write('concert.html', concertHtml);

concerts.forEach((c, i) => write(concertPath(c.id) + '.html', concertPage(concertHtml, c, i)));
for (const f of existsSync(join(ROOT, 'concert')) ? readdirSync(join(ROOT, 'concert')) : []) {
  if (f.endsWith('.html') && !seen.has(f.slice(0, -5))) {
    unlinkSync(join(ROOT, 'concert', f));
    written++;
    console.log('  removed concert/' + f + ' (no longer in js/concerts.js)');
  }
}

// Information: news and its years
let infoHtml = read('information.html');
const years = [...new Set(news.map((n) => String(n.date).slice(0, 4)))];
infoHtml = region(infoHtml, 'information-years', indent([
  '<li><a href="#" class="is-selected" data-year="ALL">ALL</a></li>',
  ...years.map((y) => '<li><a href="#" data-year="' + escapeHtml(y) + '">' + escapeHtml(y) + '</a></li>'),
], '      '), 'information.html');
infoHtml = region(infoHtml, 'information', indent(news.length ? news.map((n) => {
  // the title is the link (the text may hold links of its own, and links cannot nest)
  const title = n.link ? '<a ' + linkAttrs(escapeHtml(n.link)) + '>' + escapeHtml(n.title) + '</a>' : escapeHtml(n.title);
  return '<li data-year="' + escapeHtml(String(n.date).slice(0, 4)) + '"><div class="information-item">' +
    '<div class="information-item__content"><p class="information-item__date"><time datetime="' + escapeHtml(n.date) + '">' + escapeHtml(concertDate(n)) + '</time></p>' +
    '<h3 class="information-item__title">' + title + '</h3>' +
    (n.titleEn ? '<p class="information-item__en-title" lang="en">' + escapeHtml(n.titleEn) + '</p>' : '') +
    (n.text ? '<p class="information-item__text">' + inlineText(n.text) + '</p>' : '') + '</div></div></li>';
}) : ['<li class="information-empty">現在お知らせはありません。<br>演奏会の情報は <a href="concert">Concert</a> をご覧ください。</li>'], '    '), 'information.html');
infoHtml = infoHtml.replace(/<body class="([^"]*)"/, (all, cls) => {
  const list = cls.split(/\s+/).filter((k) => k && k !== 'is-information-empty');
  if (!news.length) list.push('is-information-empty');
  return '<body class="' + list.join(' ') + '"';
});
write('information.html', infoHtml);

// Home: the latest concerts
let homeHtml = read('index.html');
homeHtml = region(homeHtml, 'home-latest', indent([
  '<section class="hero__latest" aria-labelledby="heroLatestTitle">',
  '  <h2 class="hero__latest__title" id="heroLatestTitle">Latest Concerts</h2>',
  '  <ul class="hero__latest__list">',
  ...concerts.slice(0, HOME_LATEST).map((c) =>
    '    <li><a href="' + concertPath(c.id) + '"><time class="hero__latest__date" datetime="' + escapeHtml(c.date) + '">' + escapeHtml(concertDate(c)) + '</time>' +
    '<span class="hero__latest__name">' + escapeHtml(c.title) + '</span></a></li>'),
  '  </ul>',
  '</section>',
], '      '), 'index.html');
write('index.html', homeHtml);

// Sitemap: every page at the root (minus the 404 page and pages marked noindex), and every concert
const pages = readdirSync(ROOT).filter((f) => f.endsWith('.html') && f !== '404.html')
  .filter((f) => !/<meta name="robots" content="[^"]*noindex/.test(read(f)))
  .map((f) => f === 'index.html' ? '' : f.slice(0, -5))
  .sort((a, b) => (a === '' ? -1 : b === '' ? 1 : a === 'concert' ? -1 : b === 'concert' ? 1 : a.localeCompare(b)));
const urls = [...pages.map((p) => SITE + '/' + p), ...concerts.map((c) => SITE + '/' + concertPath(c.id))];
write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<!-- Made by scripts/build.mjs: the site\'s pages and every concert. Do not edit it by hand. -->\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => '  <url><loc>' + u + '</loc></url>\n').join('') +
  '</urlset>\n');

for (const w of warnings) console.warn('  ⚠ ' + w);
console.log(written ? `Done: ${written} file(s) updated.` : 'Done: everything was already up to date.');

// --out <folder> (Vercel): copy the site into one folder to publish, leaving out what is not part of the site
const outAt = process.argv.indexOf('--out');
if (outAt > 0) {
  const outName = process.argv[outAt + 1];
  if (!outName || !/^[A-Za-z0-9_-]+$/.test(outName)) throw new Error('--out には公開用フォルダの名前を付けてください（例: --out public）');
  const NOT_PUBLISHED = new Set([outName, '.git', '.github', '.vercel', '.gitignore', '.vercelignore', '.DS_Store',
    'node_modules', 'scripts', 'reference', 'README.md', 'vercel.json', 'package.json', 'package-lock.json',
    'api']); // api/ holds Vercel Functions (the contact form); Vercel runs them from the project root, so they are not published as files
  const out = join(ROOT, outName);
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out);
  let copied = 0;
  for (const name of readdirSync(ROOT)) {
    if (NOT_PUBLISHED.has(name)) continue;
    cpSync(join(ROOT, name), join(out, name), { recursive: true, filter: (src) => !src.endsWith('/.DS_Store') });
    copied++;
  }
  console.log(`Copied the site (${copied} top-level items) into ${outName}/ for publishing.`);
}
