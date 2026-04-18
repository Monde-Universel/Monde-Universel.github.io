(function () {
  const root = document.documentElement;
  const langToggle = document.querySelector("[data-lang-toggle]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const navLinks = Array.from(document.querySelectorAll(".site-nav__link"));

  const T = {
    fr: {
      brandTitle: 'UN MONDE <span class="site-brand__hl">UNIVERSEL</span>',
      slogan: 'Parce que personne ne devrait être laissé derrière',
      footer: 'Parce que personne ne devrait être laissé derrière',
      langBtn: 'EN'
    },
    en: {
      brandTitle: 'ONE <span class="site-brand__hl">UNIVERSAL</span> WORLD',
      slogan: 'Because no one should be left behind',
      footer: 'Because no one should be left behind',
      langBtn: 'FR'
    }
  };

  function getLangFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("lang");
    return value === "en" ? "en" : "fr";
  }

  function setUrlLang(lang) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url);
  }

  function withLang(href, lang) {
    const url = new URL(href, window.location.origin);
    url.searchParams.set("lang", lang);

    if (url.origin === window.location.origin) {
      return url.pathname + url.search + url.hash;
    }
    return url.toString();
  }

  function applyLang(lang) {
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
        const cleanHref = rawHref.replace(/[?&]lang=(fr|en)/g, "").replace(/\?$/, "");
        link.setAttribute("href", withLang(cleanHref, lang));
      }
    });

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
    if (root.dataset.theme) return root.dataset.theme;
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

  applyLang(currentLang);
  setUrlLang(currentLang);
  markCurrentLink();
  applyTheme(currentTheme);

  if (langToggle) {
    langToggle.addEventListener("click", function () {
      currentLang = currentLang === "fr" ? "en" : "fr";
      setUrlLang(currentLang);
      applyLang(currentLang);
      markCurrentLink();
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(currentTheme);
    });
  }

  window.umGetLang = function () {
    return currentLang;
  };

  window.toggleLang = function () {
    if (langToggle) langToggle.click();
  };
})();

