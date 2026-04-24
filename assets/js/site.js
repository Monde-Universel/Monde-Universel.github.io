(function () {
  function init() {
    const root = document.documentElement;
    const langToggle = document.querySelector("[data-lang-toggle]");
    const themeToggle = document.querySelector("[data-theme-toggle]");
    const navLinks = Array.from(document.querySelectorAll(".site-nav__link"));
    const brandLogo = document.querySelector(".site-brand__logo");
    const brandLink = document.querySelector(".site-brand--logo");

    const T = {
      fr: {
        brandTitle: 'UN MONDE <span class="site-brand__hl">UNIVERSEL</span>',
        slogan: 'Parce que personne ne devrait être laissé derrière',
        footer: 'Parce que personne ne devrait être laissé derrière',
        langBtn: 'EN',
        brandAlt: 'Un Monde Universel — Parce que personne ne devrait être laissé derrière',
        brandAria: 'Accueil - Un Monde Universel'
      },
      en: {
        brandTitle: 'A <span class="site-brand__hl">UNIVERSAL</span> WORLD',
        slogan: 'Because no one should be left behind',
        footer: 'Because no one should be left behind',
        langBtn: 'FR',
        brandAlt: 'A Universal World — Because no one should be left behind',
        brandAria: 'Home - A Universal World'
      }
    };

    function getLangFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const value = params.get("lang");
      return value === "en" ? "en" : "fr";
    }

    function getThemeFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const value = params.get("theme");
      return value === "dark" || value === "light" ? value : null;
    }

    function buildUrl(lang, theme, baseHref) {
      const url = new URL(baseHref || window.location.href, window.location.origin);
      url.searchParams.set("lang", lang);
      url.searchParams.set("theme", theme);

      if (url.origin === window.location.origin) {
        return url.pathname + url.search + url.hash;
      }
      return url.toString();
    }

    function setUrlState(lang, theme) {
      const next = buildUrl(lang, theme, window.location.href);
      window.history.replaceState({}, "", next);
    }

    function cleanHref(href) {
      return href
        .replace(/[?&]lang=(fr|en)/g, "")
        .replace(/[?&]theme=(light|dark)/g, "")
        .replace(/\?&/, "?")
        .replace(/\?$/, "")
        .replace(/&$/, "");
    }

    function applyLogo(lang) {
      if (!brandLogo) return;

      const logoFr = brandLogo.getAttribute("data-logo-fr");
      const logoEn = brandLogo.getAttribute("data-logo-en");
      const nextSrc = lang === "en" ? logoEn : logoFr;

      if (nextSrc) {
        brandLogo.src = nextSrc;
      }

      brandLogo.alt = T[lang].brandAlt;

      if (brandLink) {
        brandLink.setAttribute("aria-label", T[lang].brandAria);
      }
    }

    function syncLanguageBlocks(lang) {
      document.querySelectorAll("[data-lang-block]").forEach((block) => {
        block.hidden = block.getAttribute("data-lang-block") !== lang;
      });
    }

    function applyLang(lang, theme) {
      root.lang = lang;
      root.setAttribute("data-lang", lang);

      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (!T[lang][key]) return;
        if (key === "brandTitle") {
          el.innerHTML = T[lang][key];
        } else {
          el.textContent = T[lang][key];
        }
      });

      if (langToggle) {
        langToggle.textContent = T[lang].langBtn;
        langToggle.setAttribute(
          "aria-label",
          lang === "fr" ? "Switch to English" : "Basculer en français"
        );
      }

      navLinks.forEach((link) => {
        const fr = link.getAttribute("data-label-fr");
        const en = link.getAttribute("data-label-en");
        const rawHref = link.getAttribute("href");

        if (fr && en) {
          link.textContent = lang === "fr" ? fr : en;
        }

        if (rawHref) {
          link.setAttribute("href", buildUrl(lang, theme, cleanHref(rawHref)));
        }
      });

      applyLogo(lang);
      syncLanguageBlocks(lang);

      document.dispatchEvent(
        new CustomEvent("umLangChange", { detail: { lang } })
      );
    }

    function normalizePath(path) {
      return path.replace(/\/index\.html$/, "/").replace(/index\.html$/, "/");
    }

    function markCurrentLink() {
      const current = new URL(window.location.href);
      const currentPath = normalizePath(current.pathname);
      const currentHash = current.hash || "";

      navLinks.forEach((link) => {
        link.removeAttribute("aria-current");

        const linkUrl = new URL(link.href, window.location.origin);
        const linkPath = normalizePath(linkUrl.pathname);
        const linkHash = linkUrl.hash || "";

        const samePath = linkPath === currentPath;
        const sameHash = linkHash === currentHash;

        if (!linkHash && samePath) {
          link.setAttribute("aria-current", "page");
        }

        if (linkHash && samePath && sameHash) {
          link.setAttribute("aria-current", "page");
        }
      });
    }

    function getPreferredTheme() {
      const urlTheme = getThemeFromUrl();
      if (urlTheme) return urlTheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function applyTheme(theme) {
      root.setAttribute("data-theme", theme);

      if (!themeToggle) return;

      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"
      );

      themeToggle.innerHTML =
        theme === "dark"
          ? '<span aria-hidden="true">☀︎</span>'
          : '<span aria-hidden="true">◐</span>';
    }

    let currentLang = getLangFromUrl();
    let currentTheme = getPreferredTheme();

    applyTheme(currentTheme);
    applyLang(currentLang, currentTheme);
    setUrlState(currentLang, currentTheme);
    markCurrentLink();

    window.addEventListener("hashchange", function () {
      markCurrentLink();
    });

    window.addEventListener("popstate", function () {
      currentLang = getLangFromUrl();
      currentTheme = getPreferredTheme();
      applyTheme(currentTheme);
      applyLang(currentLang, currentTheme);
      markCurrentLink();
    });

    if (langToggle) {
      langToggle.addEventListener("click", function () {
        currentLang = currentLang === "fr" ? "en" : "fr";
        setUrlState(currentLang, currentTheme);
        applyLang(currentLang, currentTheme);
        markCurrentLink();
      });
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        currentTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(currentTheme);
        setUrlState(currentLang, currentTheme);
        applyLang(currentLang, currentTheme);
        markCurrentLink();
      });
    }

    window.umGetLang = function () {
      return currentLang;
    };

    window.umGetTheme = function () {
      return currentTheme;
    };

    window.toggleLang = function () {
      if (langToggle) langToggle.click();
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

/* ═══════════════════════════════════════════════════════
   PAGE VOTEZ — logique de vote, feedback bilingue, back-to-top
   À coller dans assets/js/site.js (à la fin du fichier existant)
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Labels bilingues des 16 factions
  const voteChoiceLabels = {
    fr: {
      capitalism: 'Capitalisme',
      universalism: 'Universalisme',
      communism: 'Communisme',
      fascism: 'Fascisme',
      authoritarian: 'Authoritarisme',
      liberalism: 'Libéralisme',
      anarchism: 'Anarchisme',
      ecologism: 'Écologisme',
      conservatism: 'Conservatisme',
      nationalism: 'Nationalisme',
      libertarianism: 'Libertarianisme',
      progressism: 'Progressisme',
      socialism: 'Socialisme',
      transhumanism: 'Transhumanisme',
      coherentism: 'Cohérentisme',
      veritism: 'Véritisme'
    },
    en: {
      capitalism: 'Capitalism',
      universalism: 'Universalism',
      communism: 'Communism',
      fascism: 'Fascism',
      authoritarian: 'Authoritarism',
      liberalism: 'Liberalism',
      anarchism: 'Anarchism',
      ecologism: 'Ecologism',
      conservatism: 'Conservatism',
      nationalism: 'Nationalism',
      libertarianism: 'Libertarianism',
      progressism: 'Progressivism',
      socialism: 'Socialism',
      transhumanism: 'Transhumanism',
      coherentism: 'Coherentism',
      veritism: 'Truthnism'
    }
  };

document.querySele

  // Gestionnaire de clic sur les boutons de vote
  document.querySelectorAll('[data-vote-key]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = (typeof currentLang !== 'undefined' && translations[currentLang])
        ? currentLang
        : (document.documentElement.lang === 'en' ? 'en' : 'fr');
      const key  = btn.getAttribute('data-vote-key');
      const choice = (voteChoiceLabels[lang] && voteChoiceLabels[lang][key])
        || btn.getAttribute('data-vote');
      const box  = document.getElementById('voteFeedback');
      const text = document.getElementById('voteFeedbackText');

      if (box)  box.setAttribute('data-selected-key', key);
      if (text && typeof translations !== 'undefined'
          && translations[lang] && translations[lang].feedbackSelected) {
        text.textContent = translations[lang].feedbackSelected.replace('{choice}', choice);
      }
      if (box) {
        box.classList.add('active');
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Mise à jour du feedback quand la langue change (événement umLangChange de nav.js)
  document.addEventListener('umLangChange', function (e) {
    const lang = e.detail.lang;
    const box  = document.getElementById('voteFeedback');
    const feedbackText = document.getElementById('voteFeedbackText');
    if (feedbackText && typeof translations !== 'undefined') {
      if (box && box.classList.contains('active')) {
        const activeKey = box.getAttribute('data-selected-key');
        if (activeKey && translations[lang] && translations[lang].feedbackSelected) {
          const localizedChoice = (voteChoiceLabels[lang] && voteChoiceLabels[lang][activeKey]) || activeKey;
          feedbackText.textContent = translations[lang].feedbackSelected.replace('{choice}', localizedChoice);
        }
      } else if (translations[lang] && translations[lang].feedbackDefault) {
        feedbackText.textContent = translations[lang].feedbackDefault;
      }
    }
  });

  // Bouton retour en haut
  const backToTopBtn = document.getElementById('backToTopBtn');
  function toggleBackToTop() {
    if (!backToTopBtn) return;
    backToTopBtn.classList.toggle('is-visible', window.scrollY > 420);
  }
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
  }

})();

/* ═══════════════════════════════════════
   BOUTON RETOUR EN HAUT — global
═══════════════════════════════════════ */
(function () {
  var btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  function toggleBtn() {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleBtn, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggleBtn(); // état initial au chargement
})();


