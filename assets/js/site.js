// site.js adapté au header avec data-lang-toggle et logo FR/EN

var currentLang = (document.documentElement.lang === "en") ? "en" : "fr";

// Applique la langue globale (HTML, textes, bouton, logo, éventuels listeners)
function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // 1) Met à jour tous les boutons de langue
  var langButtons = document.querySelectorAll("[data-lang-toggle]");
  for (var i = 0; i < langButtons.length; i++) {
    langButtons[i].textContent = (lang === "fr") ? "EN" : "FR";
  }

  // 2) Applique les traductions data-i18n si l'objet global translations est défini
  if (typeof window.translations !== "undefined") {
    var dict = window.translations[lang];
    if (dict) {
      var els = document.querySelectorAll("[data-i18n]");
      for (var j = 0; j < els.length; j++) {
        var el = els[j];
        var key = el.getAttribute("data-i18n");
        if (key && dict[key] !== undefined) {
          if (key === "siteTitle") {
            el.innerHTML = dict[key];
          } else {
            el.textContent = dict[key];
          }
        }
      }
    }
  }

  // 3) Bascule le logo en fonction des data-*
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

  // 4) Notifier les autres scripts qui écoutent la langue
  try {
    document.dispatchEvent(
      new CustomEvent("umLangChange", { detail: { lang: lang } })
    );
  } catch (e) {}
}

// Fonction globale pour compat éventuelle avec d’anciens onclick
window.toggleLang = function() {
  var next = (currentLang === "fr") ? "en" : "fr";
  applyLang(next);
};

// Initialisation : branche les boutons et applique la langue initiale
document.addEventListener("DOMContentLoaded", function() {
  // Clic sur tous les boutons de langue
  var langButtons = document.querySelectorAll("[data-lang-toggle]");
  for (var i = 0; i < langButtons.length; i++) {
    langButtons[i].addEventListener("click", function() {
      window.toggleLang();
    });
  }

  // Applique la langue initiale en fonction de <html lang="...">
  applyLang(currentLang);
});
