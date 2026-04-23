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
