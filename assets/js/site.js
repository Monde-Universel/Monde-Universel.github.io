// assets/js/site.js — gestion globale langue + nav + logo

(function() {
  // Langue de départ = <html lang>, sinon fr
  var currentLang = (document.documentElement.lang === "en") ? "en" : "fr";

  function applyLang(lang) {
    currentLang = lang;
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

          // Certains éléments (ex : siteTitle) peuvent contenir du HTML
          if (key === "siteTitle") {
            el.innerHTML = value;
          } else {
            el.textContent = value;
          }
        }
      }
    }

    // 3) Bascule le logo en fonction des data-* du header
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
          brandLink.setAttribute(
            "aria-label",
            "Accueil - Un Monde Universel"
          );
        }
      } else {
        if (srcEn) { logo.src = srcEn; }
        if (altEn) { logo.alt = altEn; }
        if (brandLink) {
          brandLink.setAttribute(
            "aria-label",
            "Home - A Universal World"
          );
        }
      }
    }

    // 4) Notifier les scripts de page (votez, etc.) qu'on a changé de langue
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

  // Initialisation globale
  document.addEventListener("DOMContentLoaded", function() {
    // Clic sur tous les boutons de langue
    var langButtons = document.querySelectorAll("[data-lang-toggle]");
    for (var i = 0; i < langButtons.length; i++) {
      langButtons[i].addEventListener("click", function() {
        window.toggleLang();
      });
    }

    // Applique la langue initiale
    applyLang(currentLang);
  });
})();
