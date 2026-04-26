// =============================
// Sélecteurs globaux
// =============================
const htmlEl = document.documentElement;
const langBtn = document.getElementById("langBtn");
const brandLogo = document.querySelector(".site-brand__logo");
const brandLink = document.querySelector(".site-brand__link");

// Langue courante (FR par défaut si autre chose)
let currentLang = htmlEl.lang === "en" ? "en" : "fr";

// =============================
// Textes spécifiques à la marque (logo)
// =============================
const BrandTexts = {
  fr: {
    brandAlt: "Logo Un Monde Universel (version française)",
    brandAria:
      "Retour à la page d’accueil Un Monde Universel (français)",
  },
  en: {
    brandAlt: "Un Monde Universel logo (English version)",
    brandAria:
      "Back to Un Monde Universel home page (English)",
  },
};

// =============================
// Application du logo selon la langue
// =============================
function applyLogo(lang) {
  if (!brandLogo) return;

  const logoFr = brandLogo.getAttribute("data-logo-fr");
  const logoEn = brandLogo.getAttribute("data-logo-en");
  const nextSrc = lang === "en" ? logoEn : logoFr;

  if (nextSrc) {
    brandLogo.src = nextSrc;
  }

  if (BrandTexts[lang]) {
    brandLogo.alt = BrandTexts[lang].brandAlt;
  }

  if (brandLink && BrandTexts[lang]) {
    brandLink.setAttribute("aria-label", BrandTexts[lang].brandAria);
  }
}

// =============================
// Application des traductions data-i18n
// =============================
// On suppose qu’un objet global `translations` existe
// (défini dans chaque page : vie, votez, évolution, etc.).
function applyTranslations(lang) {
  if (typeof translations === "undefined") return;
  const dict = translations[lang];
  if (!dict) return;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key || !(key in dict)) return;

    if (key === "siteTitle") {
      el.innerHTML = dict[key];
    } else {
      el.textContent = dict[key];
    }
  });

  // Mise à jour éventuelle du titre de la page
  if (lang === "fr") {
    document.title = document.title
      .replace("A UNIVERSAL WORLD", "UN MONDE UNIVERSEL")
      .replace("Evolution", "Évolution");
  } else if (lang === "en") {
    document.title = document.title
      .replace("UN MONDE UNIVERSEL", "A UNIVERSAL WORLD")
      .replace("Évolution", "Evolution");
  }

  // Bouton de langue (FR affiche EN, EN affiche FR) si présent
  if (langBtn) {
    langBtn.textContent = lang === "fr" ? "EN" : "FR";
  }

  // Bouton back-to-top global si la clé existe
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (backToTopBtn && dict.backToTop) {
    backToTopBtn.setAttribute("aria-label", dict.backToTop);
    const textSpan = backToTopBtn.querySelector("[data-i18n='backToTop']");
    if (textSpan) textSpan.textContent = dict.backToTop;
  }
}

// =============================
// Application globale de la langue
// =============================
function applyLang(lang) {
  currentLang = lang;
  htmlEl.lang = lang;

  applyTranslations(lang);
  applyLogo(lang);

  // Notifier les autres scripts (votez, évolution, etc.)
  const event = new CustomEvent("umLangChange", {
    detail: { lang },
  });
  document.dispatchEvent(event);
}

// =============================
// Fonction globale pour l’ancien HTML
// =============================
// IMPORTANT : ton HTML appelle encore `onclick="toggleLang()"`,
// donc on expose cette fonction sur window.
window.toggleLang = function () {
  const next = currentLang === "fr" ? "en" : "fr";
  applyLang(next);
};

// =============================
// Gestion du bouton de langue (au cas où pas d'onclick inline)
// =============================
// Ce bloc ne gêne pas l’existant : si onclick est présent,
// les deux pointent vers toggleLang → même comportement.
if (langBtn) {
  langBtn.addEventListener("click", () => {
    window.toggleLang();
  });
}

// =============================
// Initialisation au chargement
// =============================
document.addEventListener("DOMContentLoaded", () => {
  applyLang(currentLang);
});
