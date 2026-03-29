(function(){
  const page = window.SITE_PAGE || {};
  const currentPage = page.key || 'index';

  const i18n = {
    fr: {
      siteTitle: 'UN MONDE <span>UNIVERSEL</span>',
      siteSlogan: 'Parce que personne ne devrait être laissé derrière',
      footerText: 'Parce que personne ne devrait être laissé derrière',
      navvision: 'La Vision',
      navdiscussion: 'Discussion',
      navthese: '📖 Un peu plus…',
      navtheorie: 'Nouvelle Approche',
      navguerre: '⚔️ Guerre',
      navchomage: '📉 Chômage',
      navrub: 'RUB',
      navabout: 'À propos',
      navcontact: 'Contact'
    },
    en: {
      siteTitle: 'A <span>UNIVERSAL</span> WORLD',
      siteSlogan: 'Because no one should be left behind',
      footerText: 'Because no one should be left behind',
      navvision: 'Our Vision',
      navdiscussion: 'Discussion',
      navthese: '📖 Learn More',
      navtheorie: 'New Approach',
      navguerre: '⚔️ War',
      navchomage: '📉 Unemployment',
      navrub: 'UBI',
      navabout: 'About',
      navcontact: 'Contact'
    }
  };

  const navItems = [
    { key: 'navvision', href: 'index.html#vision', page: 'index' },
    { key: 'navdiscussion', href: 'index.html#discussion', page: 'discussion' },
    { key: 'navthese', href: 'these.html', page: 'these' },
    { key: 'navtheorie', href: 'theorie.html', page: 'theorie' },
    { key: 'navguerre', href: 'guerre.html', page: 'guerre', className: 'alert-link' },
    { key: 'navchomage', href: 'chomage.html', page: 'chomage' },
    { key: 'navrub', href: 'rub.html', page: 'rub' },
    { key: 'navabout', href: 'index.html#apropos', page: 'about' },
    { key: 'navcontact', href: 'index.html#contact', page: 'contact' }
  ];

  let currentLang = document.documentElement.lang === 'en' ? 'en' : 'fr';

  function renderHeader(){
    const t = i18n[currentLang];
    const title = document.getElementById('site-title');
    const slogan = document.getElementById('site-slogan');
    if (title) title.innerHTML = t.siteTitle;
    if (slogan) slogan.textContent = t.siteSlogan;
  }

  function renderFooter(){
    const t = i18n[currentLang];
    const footer = document.getElementById('footer-text');
    if (footer) footer.textContent = t.footerText;
  }

  function renderNav(){
    const nav = document.getElementById('site-nav');
    if (!nav) return;
    const t = i18n[currentLang];
    nav.innerHTML = navItems.map(item => {
      const active = currentPage === item.page ? 'active-page' : '';
      const extra = item.className || '';
      return `<a href="${item.href}" class="${extra} ${active}" data-key="${item.key}">${t[item.key]}</a>`;
    }).join('') + `<button class="lang-btn" id="langBtn">${currentLang === 'fr' ? 'EN' : 'FR'}</button>`;

    const btn = document.getElementById('langBtn');
    if (btn) btn.addEventListener('click', toggleLang);
  }

  function renderContent(){
    const frBlocks = document.querySelectorAll('[data-lang="fr"]');
    const enBlocks = document.querySelectorAll('[data-lang="en"]');
    frBlocks.forEach(el => el.classList.toggle('hidden-lang', currentLang !== 'fr'));
    enBlocks.forEach(el => el.classList.toggle('hidden-lang', currentLang !== 'en'));
  }

  function toggleLang(){
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    document.documentElement.lang = currentLang;
    renderAll();
    window.scrollTo(0, 0);
  }

  function renderAll(){
    renderHeader();
    renderNav();
    renderFooter();
    renderContent();
  }

  window.toggleLang = toggleLang;
  document.addEventListener('DOMContentLoaded', renderAll);
})();
