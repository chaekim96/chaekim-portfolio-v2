/* Palette trial (test site only): adds the glass to controls on any page and the switcher
   for the green accent. The choice is kept per browser and carries across pages.
   The <head> snippet applies the saved choice before first paint. */
(function () {
  const root = document.documentElement;
  root.setAttribute('data-theme', 'light');  // main.js may have restored a saved dark theme
  const ACCENTS = [['apple', 'Signal green', '#30d158'], ['emerald', 'Emerald', '#10b981'], ['jade', 'Jade', '#0fa37f'],
                   ['lime', 'Lime', '#9be22d'], ['forest', 'Forest', '#15803d'], ['sage', 'Sage', '#8fb996']];

  function save() {
    try { localStorage.setItem('ck-trial', JSON.stringify({ accent: root.dataset.accent })); } catch (e) {}
  }

  // Glass on the controls that float over the work.
  document.querySelectorAll('.tabs, .topnav, .stage .pill, .live-btn').forEach(el => {
    el.classList.add('lg'); el.setAttribute('data-lg', '');
    el.dataset.lgBezel = el.matches('.tabs, .topnav') ? '14' : '10';
  });

  const nav = document.createElement('nav');
  nav.className = 'pal-switch lg';
  nav.setAttribute('data-lg', ''); nav.dataset.lgBezel = '16';
  nav.setAttribute('aria-label', 'Palette trial');
  nav.innerHTML =
    '<div class="pal-dots" role="group" aria-label="Accent">' +
      ACCENTS.map(([v, l, c]) => `<button type="button" data-accent="${v}" style="background:${c}" aria-label="${l}" title="${l}"></button>`).join('') +
    '</div><span class="pal-sep" aria-hidden="true"></span><a href="/palettes">Compare</a>';
  document.body.appendChild(nav);

  function sync() {
    nav.querySelectorAll('[data-accent]').forEach(b => b.setAttribute('aria-pressed', b.dataset.accent === root.dataset.accent));
  }
  nav.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.accent) root.dataset.accent = b.dataset.accent;
    save(); sync();
  });
  sync();
})();
