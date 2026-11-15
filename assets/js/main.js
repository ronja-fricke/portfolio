(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 900px)');
  document.documentElement.classList.toggle('motion', !reduce.matches);

  /* Einblenden beim Scrollen */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* Lupen: zeigen dieselbe Bilddatei vergrößert */
  document.querySelectorAll('.zoom__media').forEach((media) => {
    const img = media.querySelector('img');
    const loupe = media.querySelector('.loupe');
    const set = () => {
      const src = img.currentSrc || img.src;
      const big = img.srcset ? img.srcset.split(',').map((s) => s.trim().split(' ')[0]).pop() : src;
      loupe.style.backgroundImage = `url("${new URL(big, document.baseURI).href}")`;
    };
    if (img.complete) set(); else img.addEventListener('load', set, { once: true });
  });

  /* Lightbox für weitere Arbeiten */
  const box = document.querySelector('.lightbox');
  if (box && box.showModal) {
    const bImg = box.querySelector('img'), bCap = box.querySelector('figcaption');
    let group = [], idx = 0, opener = null;
    const show = (i) => {
      idx = (i + group.length) % group.length;
      const a = group[idx];
      bImg.src = a.getAttribute('href');
      const im = a.querySelector('img');
      bImg.alt = im ? im.alt : a.dataset.caption;
      bCap.textContent = `${a.dataset.caption} (${idx + 1} von ${group.length})`;
    };
    document.querySelectorAll('[data-gallery] a[data-caption]').forEach((a) => {
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        opener = a;
        group = [...a.closest('[data-gallery]').querySelectorAll('a[data-caption]')];
        show(group.indexOf(a));
        box.showModal();
        box.querySelector('.lightbox__close').focus();
      });
    });
    box.querySelector('.lightbox__prev').addEventListener('click', () => show(idx - 1));
    box.querySelector('.lightbox__next').addEventListener('click', () => show(idx + 1));
    box.querySelector('.lightbox__close').addEventListener('click', () => box.close());
    box.addEventListener('click', (ev) => { if (ev.target === box) box.close(); });
    box.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowLeft') show(idx - 1);
      if (ev.key === 'ArrowRight') show(idx + 1);
    });
    box.addEventListener('close', () => { bImg.removeAttribute('src'); opener && opener.focus(); });
  }

  /* Video erst nach Klick laden */
  document.querySelectorAll('.player__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const stage = btn.closest('.player__stage');
      const video = document.createElement('video');
      video.src = btn.dataset.video;
      video.controls = true;
      video.playsInline = true;
      video.muted = 'muted' in btn.dataset;
      video.setAttribute('aria-label', btn.dataset.label);
      if (btn.dataset.track) {
        const tr = document.createElement('track');
        Object.assign(tr, { kind: 'captions', srclang: 'de', label: 'Deutsch', src: btn.dataset.track, default: true });
        video.appendChild(tr);
      }
      stage.replaceChildren(video);
      video.play().catch(() => {});
      video.focus();
    });
  });

  /* Szenen, die am Scrollfortschritt hängen */
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const ease = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
  const motion = () => !reduce.matches;
  const progress = (el) => {
    const r = el.getBoundingClientRect();
    const t = r.height - innerHeight;
    return t > 0 ? clamp(-r.top / t) : (r.top < 0 ? 1 : 0);
  };
  const scenes = [];

  /* Kapitel 1: Flug durch den Werdegang */
  const journey = document.querySelector('.journey');
  if (journey) {
    const stages = [...journey.querySelectorAll('.stage')];
    const hud = journey.querySelector('.hud');
    journey.style.setProperty('--n', stages.length);
    let last = -1;
    scenes.push(() => {
      if (!motion()) { stages.forEach((st) => { st.style.transform = ''; st.style.opacity = ''; }); return; }
      const p = progress(journey);
      const t = p * (stages.length - 0.3);
      const k = Math.floor(t), f = t - k;
      const tt = k + (f < 0.45 ? 0 : ease((f - 0.45) / 0.55));
      const D = narrow.matches ? 900 : 1300;
      stages.forEach((st, i) => {
        const z = (tt - i) * D - 120;
        let o = 1;
        if (z < -1.2 * D) o = clamp((z + 2.6 * D) / (1.4 * D));
        if (z > -100) o = clamp(1 - (z + 100) / 420);
        const x = 0;
        st.style.opacity = o.toFixed(3);
        st.style.visibility = o < 0.01 ? 'hidden' : 'visible';
        st.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${(i % 2 ? -1 : 1) * 30}px, ${z.toFixed(0)}px)`;
      });
      const idx = Math.min(stages.length - 1, Math.max(0, Math.round(tt)));
      if (idx !== last && hud) {
        last = idx;
        hud.querySelector('.hud__station b').textContent = idx + 1;
        hud.querySelector('.hud__title').textContent = stages[idx].dataset.title;
        hud.querySelector('.hud__year').textContent = stages[idx].dataset.year;
      }
      hud && hud.style.setProperty('--hp', p.toFixed(3));
    });
  }

  /* Portal: die Karte wird zum ganzen Bild */
  const portal = document.querySelector('.portal');
  if (portal) scenes.push(() => {
    if (!motion()) return;
    const p = progress(portal);
    const e = ease(p / 0.8);
    portal.style.setProperty('--s', (0.3 + 0.7 * e).toFixed(3));
    portal.style.setProperty('--r', ((1 - e) * 28).toFixed(1) + 'px');
    portal.style.setProperty('--lo', (1 - ease(p / 0.35)).toFixed(3));
  });

  /* YADORE: der gelbe Kreis wächst */
  const burst = document.querySelector('.burst');
  if (burst) scenes.push(() => {
    if (!motion()) return;
    const p = progress(burst);
    burst.style.setProperty('--s', (0.012 + ease((p - 0.05) / 0.5)).toFixed(3));
    burst.style.setProperty('--t', (ease((p - 0.4) / 0.15) - ease((p - 0.82) / 0.12)).toFixed(3));
    burst.style.setProperty('--o', (1 - ease((p - 0.8) / 0.18)).toFixed(3));
  });

  /* Web: Kamerafahrt in die Seite */
  const dolly = document.querySelector('.dolly');
  if (dolly) {
    const screen = dolly.querySelector('.dolly__screen');
    const img = screen.querySelector('img');
    scenes.push(() => {
      if (!motion()) { dolly.style.cssText = ''; return; }
      const p = progress(dolly);
      const a = ease(p / 0.35), b = clamp((p - 0.38) / 0.58);
      dolly.style.setProperty('--rx', ((1 - a) * 52).toFixed(2) + 'deg');
      dolly.style.setProperty('--sc', (0.62 + 0.38 * a).toFixed(3));
      dolly.style.setProperty('--ty', ((1 - a) * 12).toFixed(2) + 'vh');
      dolly.style.setProperty('--iy', (-b * Math.max(0, img.offsetHeight - screen.clientHeight)).toFixed(0) + 'px');
    });
  }

  /* Seitwärts-Strecken */
  const hscrolls = [...document.querySelectorAll('.hscroll')].map((el) => ({
    el, sticky: el.querySelector('.hscroll__sticky'), track: el.querySelector('.hscroll__track')
  }));
  const hActive = () => motion() && !narrow.matches;
  function sizeHscrolls() {
    hscrolls.forEach((h) => {
      h.track.style.setProperty('--x', '0px');
      if (!hActive()) { h.el.style.height = ''; return; }
      const dist = Math.max(0, h.track.scrollWidth - h.sticky.clientWidth);
      h.dist = dist;
      h.el.style.height = (dist + innerHeight) + 'px';
    });
  }
  hscrolls.forEach((h) => {
    h.track.addEventListener('focusin', (ev) => {
      if (!hActive()) return;
      const el = ev.target.closest('.hscroll__track > *') || ev.target;
      const top = h.el.getBoundingClientRect().top + scrollY;
      const want = clamp((el.offsetLeft - innerWidth * 0.2) / (h.dist || 1));
      scrollTo({ top: top + want * h.dist, behavior: 'instant' });
    });
    scenes.push(() => {
      if (!hActive()) { h.track.style.removeProperty('--x'); return; }
      const p = progress(h.el);
      h.track.style.setProperty('--x', (-p * h.dist).toFixed(1) + 'px');
    });
  });

  /* Ebenen-Szene: Abstand der Ebenen folgt dem Scrollen */
  const layers = document.querySelector('.layers');
  const stage = layers && layers.querySelector('.layers__stage');
  function updateLayers() {
    if (!stage || reduce.matches) return;
    const r = layers.getBoundingClientRect();
    const total = r.height - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / (total * 0.55)));
    stage.style.setProperty('--e', (p * p * (3 - 2 * p)).toFixed(3));
  }

  /* Einstieg: verstreute Motive fügen sich zusammen */
  const hero = document.querySelector('.hero');
  const board = hero && hero.querySelector('.hero__board');
  if (board) scenes.push(() => {
    if (!motion()) { board.style.removeProperty('--e'); hero.style.removeProperty('--e'); return; }
    let p;
    if (narrow.matches) {
      const top = board.getBoundingClientRect().top;
      p = clamp((innerHeight * 0.95 - top) / (innerHeight * 0.65));
    } else p = clamp(progress(hero) / 0.8);
    const e = ease(p).toFixed(3);
    board.style.setProperty('--e', e);
    hero.style.setProperty('--e', e);
  });

  /* Kapitel-Anzeige statt Faden */
  const chapters = [...document.querySelectorAll('[data-chapter]')];
  const chip = document.createElement('div');
  chip.className = 'chapter';
  chip.setAttribute('aria-hidden', 'true');
  chip.innerHTML = '<span class="chapter__no"></span><span class="chapter__name"></span><span class="chapter__bar"><i></i></span>';
  document.body.appendChild(chip);
  let curCh = -1, awake = false, sleepT;
  /* nur beim Scrollen sichtbar, damit sie keinen Text dauerhaft verdeckt */
  addEventListener('scroll', () => {
    awake = true;
    clearTimeout(sleepT);
    sleepT = setTimeout(() => { awake = false; chip.classList.remove('is-on'); }, 1400);
  }, { passive: true });
  scenes.push(() => {
    let k = 0;
    chapters.forEach((c, i) => { if (c.getBoundingClientRect().top <= innerHeight * 0.5) k = i; });
    const inJourney = motion() && chapters[k].id === 'werdegang';
    chip.classList.toggle('is-on', k > 0 && !inJourney && awake);
    if (k !== curCh) {
      curCh = k;
      chip.querySelector('.chapter__no').textContent = String(k).padStart(2, '0');
      chip.querySelector('.chapter__name').textContent = chapters[k].dataset.chapter;
    }
    const max = document.documentElement.scrollHeight - innerHeight;
    chip.style.setProperty('--cp', max > 0 ? (scrollY / max).toFixed(3) : 0);
  });

  /* Gemeinsame Inhaltskante, exakt gemessen (ohne Scrollbalken-Abweichung) */
  const sec = document.querySelector('.section');
  function setEdge() {
    if (!sec) return;
    const edge = sec.getBoundingClientRect().left + parseFloat(getComputedStyle(sec).paddingLeft);
    document.documentElement.style.setProperty('--edge', edge.toFixed(1) + 'px');
  }
  function build() { setEdge(); sizeHscrolls(); runScenes(); }

  function runScenes() { updateLayers(); scenes.forEach((f) => f()); }
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { runScenes(); ticking = false; });
  }

  let rebuild;
  function scheduleBuild() { clearTimeout(rebuild); rebuild = setTimeout(build, 120); }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', scheduleBuild);
  narrow.addEventListener('change', scheduleBuild);
  reduce.addEventListener('change', () => { document.documentElement.classList.toggle('motion', !reduce.matches); build(); });
  if ('ResizeObserver' in window) new ResizeObserver(scheduleBuild).observe(document.body);
  document.fonts && document.fonts.ready.then(scheduleBuild);

  build();
})();
