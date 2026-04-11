/*!
 * UN MONDE UNIVERSEL — nav.js  v2.1
 * ─────────────────────────────────────────────────────────────────────
 * • Injecte automatiquement header, nav et footer sur chaque page
 * • Persistance de langue via localStorage (clé : "umLang")
 * • Pour AJOUTER une page : ajouter UNE ligne dans NAV_LINKS ci-dessous
 * ─────────────────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════════
     1. CONFIGURATION CENTRALE — modifier ici pour ajouter une page
     ══════════════════════════════════════════════════════════════════ */
  var NAV_LINKS = [
    { href: 'index.html',             key: 'navhome'        },
    { href: 'index.html#vision',      key: 'navvision'      },
    { href: 'index.html#discussion',  key: 'navdiscussion'  },
    { href: 'these.html',             key: 'navthese'       },
    { href: 'theorie.html',           key: 'navtheorie'     },
    { href: 'vie.html',               key: 'navvie'         },
    { href: 'guerre.html',            key: 'navguerre',     color: '#ff9090' },
    { href: 'chomage.html',           key: 'navchomage'     },
    { href: 'rub.html',               key: 'navrub'         },
    { href: 'education.html',         key: 'naveducation'   },
    { href: 'evolution.html',         key: 'navevolution'   },
    { href: 'votez.html',             key: 'navvote',       vote: true },
    { href: 'index.html#apropos',     key: 'navabout'       },
    { href: 'index.html#contact',     key: 'navcontact'     },
  ];

  /* ══════════════════════════════════════════════════════════════════
     2. TRADUCTIONS COMMUNES (nav, en-tête, pied de page)
     ══════════════════════════════════════════════════════════════════ */
  var T = {
    fr: {
      before:      'UN MONDE ',
      hl:          'UNIVERSEL',
      after:       '',
      slogan:      'Parce que personne ne devrait être laissé derrière',
      navhome:     'Accueil',
      navvision:   'La Vision',
      navdiscussion:'Discussion',
      navthese:    'Un peu plus',
      navtheorie:  'Nouvelle Approche',
      navvie:      'Vie',
      navguerre:   'Guerre',
      navchomage:  'Chômage',
      navrub:      'RUB',
      naveducation:'Éducation',
      navevolution:'Évolution',
      navvote:     'Le Vote',
      navabout:    'À propos',
      navcontact:  'Contact',
      footer:      'Parce que personne ne devrait être laissé derrière',
    },
    en: {
      before:      'ONE ',
      hl:          'UNIVERSAL',
      after:       ' WORLD',
      slogan:      'Because no one should be left behind',
      navhome:     'Home',
      navvision:   'The Vision',
      navdiscussion:'Discussion',
      navthese:    'A Little More',
      navtheorie:  'New Approach',
      navvie:      'Life',
      navguerre:   'War',
      navchomage:  'Unemployment',
      navrub:      'UBI',
      naveducation:'Education',
      navevolution:'Evolution',
      navvote:     'The Vote',
      navabout:    'About',
      navcontact:  'Contact',
      footer:      'Because no one should be left behind',
    },
  };

  /* ══════════════════════════════════════════════════════════════════
     3. CSS PARTAGÉ
     ══════════════════════════════════════════════════════════════════ */
  var SHARED_CSS = '\
/* ── UM shared styles ── */\n\
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n\
html { scroll-behavior: smooth; }\n\
body { font-family: Georgia, serif; background: #f0f7ff; color: #1a1a2e; }\n\
\n\
.um-header {\n\
  background: linear-gradient(160deg, #0d2257 0%, #1a3a6b 45%, #1b5e8a 100%);\n\
  text-align: center; padding: 42px 20px 36px;\n\
  position: relative; overflow: hidden;\n\
}\n\
.um-header::before {\n\
  content: ""; position: absolute; inset: 0; pointer-events: none;\n\
  background:\n\
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(135,206,235,.12) 0%, transparent 70%),\n\
    radial-gradient(ellipse 40% 40% at 20% 100%, rgba(135,206,235,.07) 0%, transparent 60%);\n\
}\n\
.um-site-title {\n\
  font-family: "Cinzel", Georgia, serif; font-weight: 900;\n\
  font-size: clamp(2rem, 6vw, 4.2rem);\n\
  color: #fff; letter-spacing: .10em;\n\
  text-shadow: 0 2px 24px rgba(135,206,235,.5), 0 0 60px rgba(135,206,235,.2);\n\
  line-height: 1.1; margin-bottom: 14px;\n\
  position: relative; z-index: 1;\n\
}\n\
.um-site-title .um-hl { color: #87CEEB; }\n\
.um-slogan {\n\
  font-family: "Lato", Arial, sans-serif; font-weight: 300;\n\
  font-size: clamp(.95rem, 2.2vw, 1.35rem);\n\
  color: #cce4f7; letter-spacing: .18em; text-transform: uppercase;\n\
  position: relative; z-index: 1;\n\
}\n\
.um-slogan::before { content: "— "; color: #87CEEB; opacity: .7; }\n\
.um-slogan::after  { content: " —"; color: #87CEEB; opacity: .7; }\n\
\n\
.um-nav {\n\
  background: #1a3a6b;\n\
  display: flex; justify-content: center; align-items: center;\n\
  gap: 20px; padding: 14px 20px; flex-wrap: wrap;\n\
}\n\
.um-nav a {\n\
  color: #fff; text-decoration: none;\n\
  font-family: "Lato", Arial, sans-serif;\n\
  font-size: .88rem; font-weight: 700;\n\
  letter-spacing: .04em; transition: color .2s;\n\
  white-space: nowrap;\n\
}\n\
.um-nav a:hover { color: #87CEEB; }\n\
.um-nav a[aria-current="page"] { color: #87CEEB; }\n\
.um-lang-btn {\n\
  background: #87CEEB; color: #1a3a6b; border: none;\n\
  border-radius: 20px; padding: 6px 16px;\n\
  font-family: "Lato", Arial, sans-serif;\n\
  font-size: .9rem; font-weight: 700; cursor: pointer;\n\
  transition: all .2s; letter-spacing: .05em;\n\
}\n\
.um-lang-btn:hover { background: #fff; }\n\
\n\
.um-footer {\n\
  background: #1a3a6b; color: #cce4f7;\n\
  text-align: center; padding: 24px 20px;\n\
  font-family: Arial, sans-serif; font-size: .88rem;\n\
}\n\
.um-footer span { color: #87CEEB; font-weight: bold; }\n\
\n\
@media (max-width: 640px) {\n\
  .um-nav { gap: 12px; padding: 12px 14px; }\n\
  .um-nav a { font-size: .80rem; }\n\
}\n\
';

  /* ══════════════════════════════════════════════════════════════════
     4. ÉTAT — langue persistante
     ══════════════════════════════════════════════════════════════════ */
  var lang = 'fr';
  try { lang = localStorage.getItem('umLang') || 'fr'; } catch (e) {}

  function saveLang(l) {
    try { localStorage.setItem('umLang', l); } catch (e) {}
  }

  /* ══════════════════════════════════════════════════════════════════
     5. UTILITAIRES
     ══════════════════════════════════════════════════════════════════ */
  function getPageFile() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  function buildTitle(l) {
    var t = T[l];
    return t.before + '<span class="um-hl">' + t.hl + '</span>' + t.after;
  }

  /* ══════════════════════════════════════════════════════════════════
     6. CONSTRUCTION DU HTML
     ══════════════════════════════════════════════════════════════════ */
  function buildHeader(l) {
    return '<header class="um-header">'
      + '<h1 class="um-site-title" data-um="title">' + buildTitle(l) + '</h1>'
      + '<p class="um-slogan" data-um="slogan">' + T[l].slogan + '</p>'
      + '</header>';
  }

  function buildNav(l) {
    var page = getPageFile();
    var html = '<nav class="um-nav">';

    NAV_LINKS.forEach(function (lnk) {
      var file    = lnk.href.split('#')[0];
      var current = !lnk.href.includes('#') && file === page;
      var label   = T[l][lnk.key] || lnk.key;

      if (lnk.vote) {
        html += '<a href="' + lnk.href + '" data-um="' + lnk.key + '"'
          + (current ? ' aria-current="page"' : '')
          + ' style="display:inline-block;padding:8px 18px;border-radius:999px;background:#ffd54f;'
          + 'color:#1a3a6b;font-weight:900;letter-spacing:.06em;white-space:nowrap;'
          + 'box-shadow:0 0 0 2px rgba(255,255,255,.55),0 6px 18px rgba(0,0,0,.18);'
          + 'text-transform:uppercase;">' + label + '</a>';
      } else {
        var style = lnk.color ? ' style="color:' + lnk.color + '"' : '';
        html += '<a href="' + lnk.href + '" data-um="' + lnk.key + '"'
          + style
          + (current ? ' aria-current="page"' : '')
          + '>' + label + '</a>';
      }
    });

    html += '<button class="um-lang-btn" onclick="window.toggleLang()" id="umLangBtn">'
      + (l === 'fr' ? 'EN' : 'FR') + '</button>';
    html += '</nav>';
    return html;
  }

  function buildFooter(l) {
    return '<footer class="um-footer">'
      + '<p>2026 <span>Universel</span> — <span data-um="footer">' + T[l].footer + '</span></p>'
      + '</footer>';
  }

  /* ══════════════════════════════════════════════════════════════════
     7. MISE À JOUR DES ÉLÉMENTS COMMUNS
     ══════════════════════════════════════════════════════════════════ */
  function applyShared(l) {
    document.querySelectorAll('[data-um]').forEach(function (el) {
      var key = el.getAttribute('data-um');
      if (key === 'title') {
        el.innerHTML = buildTitle(l);
      } else if (T[l][key] !== undefined) {
        el.textContent = T[l][key];
      }
    });
    var btn = document.getElementById('umLangBtn');
    if (btn) btn.textContent = l === 'fr' ? 'EN' : 'FR';
    document.documentElement.lang = l;
  }

  /* ══════════════════════════════════════════════════════════════════
     8. API PUBLIQUE
     ══════════════════════════════════════════════════════════════════ */
  window.toggleLang = function () {
    lang = lang === 'fr' ? 'en' : 'fr';
    saveLang(lang);
    applyShared(lang);
    document.dispatchEvent(new CustomEvent('umLangChange', { detail: { lang: lang } }));
  };

  window.umGetLang = function () { return lang; };

  /* ══════════════════════════════════════════════════════════════════
     9. INJECTION AU CHARGEMENT
     ══════════════════════════════════════════════════════════════════ */
  function injectFonts() {
    if (document.getElementById('um-fonts')) return;
    ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].forEach(function (u, i) {
      var pc = document.createElement('link');
      pc.rel = 'preconnect'; pc.href = u;
      if (i === 1) pc.crossOrigin = 'anonymous';
      document.head.insertBefore(pc, document.head.firstChild);
    });
    var lnk = document.createElement('link');
    lnk.id = 'um-fonts'; lnk.rel = 'stylesheet';
    lnk.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Lato:wght@300;400;700&display=swap';
    document.head.appendChild(lnk);
  }

  function injectStyles() {
    if (document.getElementById('um-shared-css')) return;
    var s = document.createElement('style');
    s.id = 'um-shared-css';
    s.textContent = SHARED_CSS;
    document.head.insertBefore(s, document.head.firstChild);
  }

  function init() {
    injectFonts();
    injectStyles();
    document.body.insertAdjacentHTML('afterbegin', buildHeader(lang) + buildNav(lang));
    document.body.insertAdjacentHTML('beforeend',  buildFooter(lang));
    setTimeout(function () {
      document.dispatchEvent(new CustomEvent('umLangChange', { detail: { lang: lang } }));
    }, 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
