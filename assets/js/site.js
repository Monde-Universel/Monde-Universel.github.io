// =============================
// Sélecteurs globaux + état
// =============================
const htmlEl = document.documentElement;
const langBtn = document.getElementById("langBtn");
const brandLogo = document.querySelector(".site-brand__logo");
const brandLink = document.querySelector(".site-brand__link");

let currentLang = htmlEl.lang === "en" ? "en" : "fr";

// =============================
// Textes spécifiques marque
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
// Logo selon la langue
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
// Traductions data-i18n (tolérant)
// =============================
function applyTranslations(lang) {
  // Si translations n’existe pas sur cette page, on ne casse rien.
  if (typeof window.translations === "undefined") {
    if (langBtn) langBtn.textContent = lang === "fr" ? "EN" : "FR";
    return;
  }

  const dict = window.translations[lang];
  if (!dict) {
    if (langBtn) langBtn.textContent = lang === "fr" ? "EN" : "FR";
    return;
  }

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key || !(key in dict)) return;

    if (key === "siteTitle") {
      el.innerHTML = dict[key];
    } else {
      el.textContent = dict[key];
    }
  });

  // Titre de page basique (on évite les trucs trop spécifiques)
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

  if (langBtn) {
    langBtn.textContent = lang === "fr" ? "EN" : "FR";
  }
}

// =============================
// Application globale de la langue
// =============================
function applyLang(lang) {
  currentLang = lang;
  htmlEl.lang = lang;

  // On encapsule pour ne jamais casser à cause d’une page
  try {
    applyTranslations(lang);
  } catch (e) {
    // On ne log rien, on se contente de ne pas bloquer
  }

  try {
    applyLogo(lang);
  } catch (e) {}

  // Notifier les pages qui écoutent
  try {
    const event = new CustomEvent("umLangChange", { detail: { lang } });
    document.dispatchEvent(event);
  } catch (e) {}
}

// =============================
// Fonction globale pour onclick="toggleLang()"
// =============================
window.toggleLang = function () {
  const next = currentLang === "fr" ? "en" : "fr";
  applyLang(next);
};

// =============================
// Sécurité : clic direct sur le bouton aussi
// =============================
if (langBtn) {
  langBtn.addEventListener("click", function () {
    window.toggleLang();
  });
}

// =============================
// Initialisation
// =============================
document.addEventListener("DOMContentLoaded", function () {
  applyLang(currentLang);
});
