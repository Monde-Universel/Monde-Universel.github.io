// site.js minimal et compatible pour le bouton de langue

var currentLang = (document.documentElement.lang === "en") ? "en" : "fr";

window.toggleLang = function() {
  // Bascule FR/EN
  currentLang = (currentLang === "fr") ? "en" : "fr";
  document.documentElement.lang = currentLang;

  // Met à jour le label du bouton (EN quand on est en FR, FR quand on est en EN)
  var btn = document.getElementById("langBtn");
  if (btn) {
    btn.textContent = (currentLang === "fr") ? "EN" : "FR";
  }

  // Applique les traductions data-i18n si l'objet global translations est défini sur la page
  if (typeof window.translations !== "undefined") {
    var dict = window.translations[currentLang];
    if (dict) {
      var els = document.querySelectorAll("[data-i18n]");
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
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

  // Prévenir les autres scripts qui écoutent la langue (votez, évolution, etc.)
  try {
    document.dispatchEvent(
      new CustomEvent("umLangChange", { detail: { lang: currentLang } })
    );
  } catch (e) {
    // Certains vieux navigateurs n'ont pas CustomEvent, mais ça ne doit pas casser le reste
  }
};
