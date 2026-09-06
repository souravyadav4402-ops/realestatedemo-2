/* ==========================================================================
   Meridian Estates — shared behaviour
   Vanilla JS, no dependencies. Loaded on every page.
   ========================================================================== */

/* ---------------------------------------------------------------- icons */
const ICON = {
  bed: '<svg viewBox="0 0 24 24"><path d="M2 17v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5M2 17h20M2 17v3M22 17v3M6 10V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  bath: '<svg viewBox="0 0 24 24"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM7 12V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2M6 19l-1 2M18 19l1 2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  area: '<svg viewBox="0 0 24 24"><path d="M3 3h18v18H3zM3 9h6V3M21 15h-6v6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  car: '<svg viewBox="0 0 24 24"><path d="M5 17h14M3 17v-4l2-5h14l2 5v4M6 17v2M18 17v2M7 13h2M15 13h2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.6-7-9.6A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 7 3.4c0 5-7 9.6-7 9.6Z" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M4 12.5 9 17.5 20 6.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrow: '<svg class="arw" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L15 13l5 2v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.2 2 2 0 0 1 5 3Z" stroke-linejoin="round"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><path d="M3 6h18v12H3zM3 7l9 6 9-6" stroke-linejoin="round"/></svg>',
};

/* ---------------------------------------------------------- favourites */
const FAV_KEY = 'meridian:saved';
const getFavs = () => {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; }
};
const toggleFav = (id) => {
  const favs = getFavs();
  const i = favs.indexOf(id);
  if (i > -1) favs.splice(i, 1); else favs.push(id);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  paintFavCount();
  return i === -1;
};
const paintFavCount = () => {
  const n = getFavs().length;
  document.querySelectorAll('[data-fav-count]').forEach((el) => {
    el.textContent = n ? `(${n})` : '';
  });
};

/* --------------------------------------------------------- card template */
function propertyCard(p, opts = {}) {
  const saved = getFavs().includes(p.id);
  const fresh = daysOnMarket(p.listed) <= 14;
  const badges = [];
  if (p.exclusive) badges.push('<span class="badge badge-brass">Exclusive</span>');
  if (fresh) badges.push('<span class="badge badge-new">New</span>');
  if (p.status === 'rent') badges.push('<span class="badge badge-ink">For Lease</span>');
  if (opts.badge) badges.push(`<span class="badge">${opts.badge}</span>`);

  return `
  <article class="card" data-reveal ${opts.delay ? `style="--d:${opts.delay}ms"` : ''}>
    <div class="card-media">
      <img src="${p.images[0]}" alt="${p.title}, ${p.city}" loading="lazy" decoding="async">
      <div class="card-badges">${badges.join('')}</div>
      <button class="fav ${saved ? 'is-on' : ''}" data-fav="${p.id}"
              aria-label="Save ${p.title}" aria-pressed="${saved}">${ICON.heart}</button>
      <div class="card-price">${fmtPrice(p.price, p.status)}</div>
    </div>
    <div class="card-body">
      <h3 class="card-title">${p.title}</h3>
      <p class="card-loc">${ICON.pin} ${p.address} · ${p.city}</p>
      <p class="card-tagline">${p.tagline}</p>
      <div class="card-specs">
        <span>${ICON.bed} ${p.beds} bd</span>
        <span>${ICON.bath} ${p.baths} ba</span>
        <span>${ICON.area} ${p.sqft.toLocaleString()} sq ft</span>
        <span>${ICON.car} ${p.parking}</span>
      </div>
    </div>
    <a class="card-link" href="property.html?id=${p.slug}">
      <span class="sr-only">View ${p.title}</span>
    </a>
  </article>`;
}

/* -------------------------------------------------------- reveal on scroll */
const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
  : null;

function observeReveals(scope = document) {
  const items = scope.querySelectorAll('[data-reveal]:not(.in), .split-lines:not(.in)');
  if (!revealObserver) { items.forEach((i) => i.classList.add('in')); return; }
  items.forEach((i) => revealObserver.observe(i));
}

/* --------------------------------------------------------- image fade-in */
function watchImages(scope = document) {
  scope.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    img.style.opacity = '0';
    img.style.transition = 'opacity .7s ease';
    const show = () => { img.style.opacity = '1'; };
    img.addEventListener('load', show, { once: true });
    img.addEventListener('error', () => {
      img.style.opacity = '0';
      img.setAttribute('data-failed', 'true');
    }, { once: true });
  });
}

/* --------------------------------------------------------------- header */
function initHeader() {
  const header = document.querySelector('.header');
  const burger = document.querySelector('.burger');
  const mnav = document.querySelector('.mobile-nav');
  if (!header) return;

  if (!header.classList.contains('force-solid')) {
    const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (burger && mnav) {
    burger.addEventListener('click', () => {
      const open = mnav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-open', open);
    });
    mnav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        mnav.classList.remove('is-open');
        burger.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      })
    );
  }
}

/* ------------------------------------------------------- favourite clicks */
function initFavs() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-fav]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const on = toggleFav(btn.dataset.fav);
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', String(on));
  });
  paintFavCount();
}

/* ---------------------------------------------------------- count-up stats */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach((el) => {
      const dec = (el.dataset.count.split('.')[1] || '').length;
      el.textContent = parseFloat(el.dataset.count)
        .toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    });
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const dec = (el.dataset.count.split('.')[1] || '').length;
      const dur = 1600;
      const t0 = performance.now();
      const fmt = (v) =>
        v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = fmt(target * eased);
        if (k < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(target);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------- form handling */
function initForms() {
  document.querySelectorAll('form[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending…'; }
      setTimeout(() => {
        if (status) {
          status.textContent = form.dataset.demoForm ||
            'Thank you — a member of the team will be in touch within one business hour.';
          status.classList.add('show');
        }
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; }
      }, 700);
    });
  });
}

/* --------------------------------------------------------------- boot */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initFavs();
  initCounters();
  initForms();
  observeReveals();
  watchImages();
  document.documentElement.classList.add('js-ready');
});
