// assets/js/site.js — gestion globale langue + nav + logo + thème

// ─── THÈME : appliqué immédiatement (avant DOMContentLoaded) ─────────────────
// Lecture anticipée pour éviter le flash de thème au chargement.
(function() {
  var stored = localStorage.getItem("um-theme");
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var theme = stored || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
})();

// ─── LANGUE + NAV + LOGO + THÈME (DOMContentLoaded) ─────────────────────────
(function() {
  // Langue de départ : localStorage > html[lang] > fr
  var currentLang = localStorage.getItem("um-lang")
    || ((document.documentElement.lang === "en") ? "en" : "fr");

  // ── Langue ────────────────────────────────────────────────────────────────
  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem("um-lang", lang);
    document.documentElement.lang = lang;

    // 1) Met à jour tous les boutons de langue
    var langButtons = document.querySelectorAll("[data-lang-toggle]");
    for (var i = 0; i < langButtons.length; i++) {
      langButtons[i].textContent = (lang === "fr") ? "EN" : "FR";
    }

    // 2) Appliquer les traductions data-i18n si un bloc global translations existe
    if (typeof window.translations !== "undefined" && window.translations) {
      var dict = window.translations[lang];
      if (dict) {
        var els = document.querySelectorAll("[data-i18n]");
        for (var j = 0; j < els.length; j++) {
          var el = els[j];
          var key = el.getAttribute("data-i18n");
          if (!key) continue;
          var value = dict[key];
          if (typeof value === "undefined") continue;
          if (key === "siteTitle") {
            el.innerHTML = value;
          } else {
            el.textContent = value;
          }
        }
      }
    }

    // 3) Traduire la navigation via data-label-fr / data-label-en
    var navLinks = document.querySelectorAll(".site-nav__link");
    for (var k = 0; k < navLinks.length; k++) {
      var link = navLinks[k];
      var frLabel = link.getAttribute("data-label-fr");
      var enLabel = link.getAttribute("data-label-en");
      if (lang === "fr" && frLabel) {
        link.textContent = frLabel;
      } else if (lang === "en" && enLabel) {
        link.textContent = enLabel;
      }
    }

    // 4) Bascule le logo en fonction des data-* du header
    var logo = document.querySelector(".site-brand__logo");
    var brandLink = document.querySelector(".site-brand--logo");
    if (logo) {
      var srcFr = logo.getAttribute("data-logo-fr");
      var srcEn = logo.getAttribute("data-logo-en");
      var altFr = logo.getAttribute("data-alt-fr");
      var altEn = logo.getAttribute("data-alt-en");
      if (lang === "fr") {
        if (srcFr) { logo.src = srcFr; }
        if (altFr) { logo.alt = altFr; }
        if (brandLink) {
          brandLink.setAttribute("aria-label", "Accueil - Un Monde Universel");
        }
      } else {
        if (srcEn) { logo.src = srcEn; }
        if (altEn) { logo.alt = altEn; }
        if (brandLink) {
          brandLink.setAttribute("aria-label", "Home - A Universal World");
        }
      }
    }

    // 5) Afficher/masquer les blocs éditoriaux avec data-lang-block
    var blocks = document.querySelectorAll("[data-lang-block]");
    for (var b = 0; b < blocks.length; b++) {
      blocks[b].hidden = (blocks[b].getAttribute("data-lang-block") !== lang);
    }

    // 6) Notifier les scripts de page (votez, etc.) qu'on a changé de langue
    try {
      document.dispatchEvent(
        new CustomEvent("umLangChange", { detail: { lang: lang } })
      );
    } catch (e) {}
  }

  // API globale minimaliste
  window.toggleLang = function() {
    var next = (currentLang === "fr") ? "en" : "fr";
    applyLang(next);
  };

  // ── Thème ─────────────────────────────────────────────────────────────────
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("um-theme", theme);

    // Met à jour l'aria-label du bouton toggle
    var themeBtns = document.querySelectorAll("[data-theme-toggle]");
    for (var t = 0; t < themeBtns.length; t++) {
      if (theme === "dark") {
        themeBtns[t].setAttribute("aria-label", currentLang === "fr"
          ? "Basculer en mode jour"
          : "Switch to light mode");
      } else {
        themeBtns[t].setAttribute("aria-label", currentLang === "fr"
          ? "Basculer en mode nuit"
          : "Switch to dark mode");
      }
    }
  }

  window.toggleTheme = function() {
    var current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  };

  // ── Initialisation globale au DOMContentLoaded ────────────────────────────
  document.addEventListener("DOMContentLoaded", function() {

    // Boutons de langue
    var langButtons = document.querySelectorAll("[data-lang-toggle]");
    for (var i = 0; i < langButtons.length; i++) {
      langButtons[i].addEventListener("click", function() {
        window.toggleLang();
      });
    }

    // Boutons de thème
    var themeBtns = document.querySelectorAll("[data-theme-toggle]");
    for (var t = 0; t < themeBtns.length; t++) {
      themeBtns[t].addEventListener("click", function() {
        window.toggleTheme();
      });
    }

    // Applique la langue mémorisée ou par défaut
    applyLang(currentLang);

    // Synchronise l'aria-label du thème avec la langue courante
    var storedTheme = localStorage.getItem("um-theme")
      || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(storedTheme);
  });
})();
