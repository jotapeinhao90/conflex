/* =====================
   Nav scroll shadow
   ===================== */
const nav = document.getElementById('nav');
const tick = () => nav.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', tick, { passive: true });
tick();

/* =====================
   Nav search
   ===================== */
function handleSearch(e) {
  e.preventDefault();
  window.location.href = 'productos.html';
}

/* =====================
   Mobile burger
   ===================== */
document.getElementById('burger').addEventListener('click', () => {
  document.getElementById('drawer').classList.toggle('open');
});
document.getElementById('drawer').querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('drawer').classList.remove('open'));
});

/* =====================
   Smooth scroll (offset nav)
   ===================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
    }
  });
});

/* =====================
   Intersection reveal
   ===================== */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up, .fade-left, .fade-right, .fade-3d').forEach(el => io.observe(el));

/* =====================
   Counter animation
   ===================== */
const cio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const end = +el.dataset.to;
    const dur = 1200;
    const step = end / (dur / 16);
    let cur = 0;
    const run = () => { cur = Math.min(cur + step, end); el.textContent = Math.floor(cur); if (cur < end) requestAnimationFrame(run); };
    requestAnimationFrame(run);
    cio.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.count').forEach(c => cio.observe(c));

/* =====================
   3D tilt on cards
   ===================== */
document.querySelectorAll('.prod, .ind, .nos-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-5px) perspective(600px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* =====================
   YouTube lazy player
   ===================== */
function loadVideo() {
  const thumb  = document.getElementById('vp-thumb');
  const iframe = document.getElementById('vp-iframe');
  const yt     = document.getElementById('yt-iframe');
  yt.src = 'https://www.youtube-nocookie.com/embed/3n8QQg7Dyl0?autoplay=1&rel=0&modestbranding=1';
  thumb.style.display  = 'none';
  iframe.style.display = 'block';
}

/* =====================
   Nav cart badge (all pages)
   ===================== */
(function navCart() {
  function getCount() {
    try { return (JSON.parse(localStorage.getItem('conflex_cart'))||[]).reduce((s,i)=>s+(i.qty||1),0); } catch { return 0; }
  }
  function render() {
    const count = getCount();
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  }
  render();
  window.addEventListener('storage', render);
  setInterval(render, 1500);
})();

/* =====================
   Contact form
   ===================== */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  btn.textContent = 'Enviando…';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('cform').style.display = 'none';
    document.getElementById('form-ok').style.display = 'block';
  }, 1100);
}

/* =====================
   Catalog filter bar (shared by conduit/schedule/hidraulico pages)
   ===================== */
const PLF_ICONS = {
  all:        '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
  curvas:     '<path d="M4 20V10a6 6 0 016-6h10"/>',
  coplas:     '<path d="M10 13a5 5 0 007.07 0l1.41-1.41a5 5 0 00-7.07-7.07L10 6"/><path d="M14 11a5 5 0 00-7.07 0l-1.41 1.41a5 5 0 007.07 7.07L14 18"/>',
  terminales: '<path d="M5 21V4a1 1 0 011-1h13l-4 5 4 5H6"/>',
  reducciones:'<path d="M4 4h16l-6 8v8h-4v-8z"/>',
  tapagorros: '<path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/>',
  adaptadores:'<path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/>',
  espigas:    '<path d="M12 2l4 13H8z"/><path d="M8 15h8l-1 6H9z"/>',
  layflat:    '<path d="M4 9h16"/><path d="M4 15h16"/>',
  salidas:    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>',
  camaras:    '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12a8 3 0 0016 0V6"/>'
};

const PLF_TYPE_ICONS = {
  hidraulica: '<path d="M12 2C6 9.5 4 13 4 16a8 8 0 0016 0c0-3-2-6.5-8-14z"/>',
  electrica:  '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>'
};

function initCatalogFilters(opts) {
  const { lineSlug, lineTitle, accent, accentTint, groups, gridEl, filtersEl } = opts;
  const allIds = LINES[lineSlug].products;
  const title  = lineTitle || (LINES[lineSlug] || {}).title || '';
  const resolved = groups
    .map(g => ({ ...g, ids: allIds.filter(g.match) }))
    .filter(g => g.ids.length);

  if (accent) document.documentElement.style.setProperty('--plf-accent', accent);
  if (accentTint) document.documentElement.style.setProperty('--plf-accent-tint', accentTint);

  let selected = new Set(); // vacío = ver todas las categorías agrupadas; puede tener 1+ ids

  function cardHtml(id) {
    const p = PRODUCTS[id];
    return `
      <a href="producto.html?id=${id}" class="pl-card fade-3d">
        <div class="pl-photo">
          <img src="img/products/${id}.png" alt="${p.name}" loading="lazy"
            onerror="if(this.src.endsWith('.png')){this.src=this.src.replace('.png','.jpg')}else{this.style.display='none';var ph=this.parentElement.querySelector('.pl-photo-ph');if(ph)ph.style.display='flex'}" />
          <div class="pl-photo-ph">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span>Foto próximamente</span>
          </div>
        </div>
        <div class="pl-body">
          <div class="pl-name">${p.name}</div>
          <div class="pl-desc">${p.desc.split('.')[0]}.</div>
          <div class="pl-tags">${p.specs.map(s=>`<span class="pl-tag">${s}</span>`).join('')}</div>
          <div class="pl-cta">
            <span>Ver medidas y cotizar</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </a>`;
  }

  function groupBlockHtml(g) {
    return `
      <div id="${g.id}" class="plf-group-head">
        <span class="plf-group-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${PLF_ICONS[g.id] || PLF_ICONS.curvas}</svg>
          ${g.label}
        </span>
        <div class="plf-group-line"></div>
      </div>
      <div class="plf-group-grid">${g.ids.map(cardHtml).join('')}</div>`;
  }

  function contextHtml(g) {
    return `
      <div class="plf-context">
        <span class="plf-context-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${PLF_ICONS[g.id] || PLF_ICONS.curvas}</svg>
        </span>
        <span class="plf-context-text"><strong>${title}</strong> <span class="plf-context-sep">›</span> ${g.label}</span>
        <span class="plf-context-count">${g.ids.length} ${g.ids.length === 1 ? 'producto' : 'productos'}</span>
      </div>`;
  }

  function renderGrid() {
    if (selected.size === 0) {
      gridEl.innerHTML = resolved.map(groupBlockHtml).join('');
    } else {
      const chosen = resolved.filter(g => selected.has(g.id));
      if (chosen.length === 1) {
        const g = chosen[0];
        gridEl.innerHTML = contextHtml(g) + `<div class="plf-group-grid">${g.ids.map(cardHtml).join('')}</div>`;
      } else {
        gridEl.innerHTML = chosen.map(groupBlockHtml).join('');
      }
    }
    gridEl.querySelectorAll('.fade-3d').forEach(el => {
      const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { el.classList.add('in'); io.unobserve(el); } }, { threshold: .1 });
      io.observe(el);
    });
  }

  function tabHtml(g) {
    return `
      <button class="plf-tab" type="button" data-id="${g.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${PLF_ICONS[g.id] || PLF_ICONS.curvas}</svg>
        <span>${g.label}</span>
        <span class="plf-tab-count">${g.ids.length}</span>
      </button>`;
  }

  function renderTabs() {
    filtersEl.querySelectorAll('.plf-tab').forEach(btn => {
      const id = btn.dataset.id;
      btn.classList.toggle('active', id === 'all' ? selected.size === 0 : selected.has(id));
    });
  }

  function syncHash() {
    if (selected.size === 0) history.replaceState(null, '', location.pathname);
    else history.replaceState(null, '', '#' + [...selected].join(','));
  }

  function scrollToFilters() {
    const navH = document.querySelector('.nav')?.getBoundingClientRect().height || 0;
    const rect = filtersEl.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - navH - 12;
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
  }

  function lineBtnHtml(slug, line) {
    const active = slug === lineSlug;
    return `
      <a class="plf-line-btn plf-line-btn--${line.type}${active ? ' active' : ''}" href="${line.url}">
        <span class="plf-line-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PLF_TYPE_ICONS[line.type]}</svg>
        </span>
        <span class="plf-line-text">
          <span class="plf-line-name">${line.short}</span>
          <span class="plf-line-type">${active ? 'Estás aquí' : line.typeLabel}</span>
        </span>
      </a>`;
  }

  const currentLine = LINES[lineSlug];
  const otherTypeLabel = currentLine.type === 'hidraulica' ? 'Eléctrica' : 'Hidráulica';
  const switchTarget = currentLine.type === 'hidraulica' ? LINES['conduit'] : LINES['hidraulico'];

  filtersEl.className = 'pf-side';
  filtersEl.innerHTML = `
    <div class="plf-current plf-current--${currentLine.type}">
      <span class="plf-current-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PLF_TYPE_ICONS[currentLine.type]}</svg>
      </span>
      <span class="plf-current-text">
        <span class="plf-current-label">Estás viendo la línea</span>
        <span class="plf-current-name">${currentLine.type === 'hidraulica' ? 'Hidráulica' : 'Eléctrica'}</span>
      </span>
    </div>
    <a class="plf-switch" href="${switchTarget.url}">
      <span>¿Buscas fitting ${otherTypeLabel.toLowerCase()}? Ir a ${otherTypeLabel}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </a>
    <div class="plf-lineswitch">
      <div class="plf-side-title">Hidráulica</div>
      ${Object.entries(LINES).filter(([,l]) => l.type === 'hidraulica').map(([slug,l]) => lineBtnHtml(slug,l)).join('')}
      <div class="plf-side-title" style="margin-top:8px">Eléctrica e industrial</div>
      ${Object.entries(LINES).filter(([,l]) => l.type === 'electrica').map(([slug,l]) => lineBtnHtml(slug,l)).join('')}
    </div>
    <div class="plf-tabbar">
      <div class="plf-side-title">Categorías <span class="plf-side-hint">(elige varias)</span></div>
      <button class="plf-tab" type="button" data-id="all">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${PLF_ICONS.all}</svg>
        <span>Todos</span>
        <span class="plf-tab-count">${allIds.length}</span>
      </button>
      ${resolved.map(tabHtml).join('')}
    </div>`;

  filtersEl.addEventListener('click', e => {
    const btn = e.target.closest('.plf-tab');
    if (!btn) return;
    const id = btn.dataset.id;
    if (id === 'all') {
      selected.clear();
    } else if (selected.has(id)) {
      selected.delete(id);
    } else {
      selected.add(id);
    }
    renderTabs();
    renderGrid();
    syncHash();
    scrollToFilters();
  });

  const hashIds = location.hash.replace('#', '').split(',').filter(id => resolved.find(g => g.id === id));
  if (hashIds.length) {
    hashIds.forEach(id => selected.add(id));
    renderTabs();
    renderGrid();
    setTimeout(scrollToFilters, 80);
  } else {
    renderTabs();
    renderGrid();
  }
}
