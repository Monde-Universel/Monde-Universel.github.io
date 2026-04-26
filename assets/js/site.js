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
// ATTENTION : on suppose qu’un objet global `translations` existe,
// défini dans chaque page (comme dans vie.html / votez.html).
function applyTranslations(lang) {
  if (typeof translations === "undefined") return;
  const dict = translations[lang];
  if (!dict) return;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key || !(key in dict)) return;

    if (key === "siteTitle") {
      // Certains titres utilisent du HTML (ex: UN MONDE <span>UNIVERSEL</span>)
      el.innerHTML = dict[key];
    } else {
      el.textContent = dict[key];
    }
  });

  // Mise à jour éventuelle du titre de la page
  if (lang === "fr") {
    document.title = document.title.replace(
      "A UNIVERSAL WORLD",
      "UN MONDE UNIVERSEL"
    );
  } else if (lang === "en") {
    document.title = document.title.replace(
      "UN MONDE UNIVERSEL",
      "A UNIVERSAL WORLD"
    );
  }

  // Bouton de langue (FR affiche EN, EN affiche FR)
  if (langBtn) {
    langBtn.textContent = lang === "fr" ? "EN" : "FR";
  }

  // Exemple : back-to-top si présent et traduit dans `translations`
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
// Gestion du bouton de langue
// =============================
if (langBtn) {
  langBtn.addEventListener("click", () => {
    const next = currentLang === "fr" ? "en" : "fr";
    applyLang(next);
  });
}

// =============================
// Initialisation au chargement
// =============================
document.addEventListener("DOMContentLoaded", () => {
  applyLang(currentLang);
});
