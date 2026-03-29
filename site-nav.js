
(function(){
  const page = window.SITE_PAGE || { key: 'index' };
  const links = [
    {key:'navvision',href:'index.html#vision',fr:'La Vision',en:'Our Vision',active:'index'},
    {key:'navdiscussion',href:'index.html#discussion',fr:'Discussion',en:'Discussion',active:'discussion'},
    {key:'navthese',href:'these.html',fr:'Un peu plus',en:'Learn More',active:'these'},
    {key:'navtheorie',href:'theorie.html',fr:'Nouvelle Approche',en:'New Approach',active:'theorie'},
    {key:'navguerre',href:'guerre.html',fr:'Guerre',en:'War',active:'guerre',extra:'alert-link'},
    {key:'navchomage',href:'chomage.html',fr:'Chômage',en:'Unemployment',active:'chomage'},
    {key:'navrub',href:'rub.html',fr:'RUB',en:'UBI',active:'rub'},
    {key:'navabout',href:'index.html#apropos',fr:'À propos',en:'About',active:'about'},
    {key:'navcontact',href:'index.html#contact',fr:'Contact',en:'Contact',active:'contact'}
  ];

  function lang(){ return document.documentElement.lang === 'en' ? 'en' : 'fr'; }

  function renderNav(){
    const nav = document.querySelector('nav');
    if(!nav) return;
    const current = lang();
    nav.innerHTML = links.map(item => {
      const txt = current === 'en' ? item.en : item.fr;
      const active = page.key === item.active ? 'active-page' : '';
      const extra = item.extra || '';
      return `<a href="${item.href}" class="${extra} ${active}" data-link="${item.key}">${txt}</a>`;
    }).join('') + `<button class="lang-btn" onclick="toggleLang()" id="langBtn">${current === 'fr' ? 'EN' : 'FR'}</button>`;
  }

  const oldApply = window.applyLang;
  if (typeof oldApply === 'function' && !window.__navPatched) {
    window.applyLang = function(l){ oldApply(l); renderNav(); };
    window.__navPatched = true;
  }

  document.addEventListener('DOMContentLoaded', renderNav);
})();
