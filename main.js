// ===== Smooth scrolling + activation immédiate =====
const headerEl = document.querySelector('header');
const getHeaderH = () =>
  headerEl ? Math.round(headerEl.getBoundingClientRect().height) : 0;

let clicking = false; // verrou pendant un scroll déclenché par clic

const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
const siteNav  = document.getElementById('siteNav');

navLinks.forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();

    // 1) on signale qu'on gère un clic
    clicking = true;

    // 2) on met tout de suite le bon lien en actif
    navLinks.forEach(l => l.classList.remove('active'));
    a.classList.add('active');

    // 3) on ferme le menu mobile si besoin
    if (siteNav) siteNav.classList.remove('open');
    document.documentElement.classList.remove('nav-open');

    // 4) scroll fluide avec offset du header (évite le titre coupé)
    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderH() - 8;
    window.scrollTo({ top, behavior: 'smooth' });

    // 5) déverrouiller après la fin du scroll
    setTimeout(() => { clicking = false; }, 500);

    // 6) mettre à jour l'URL sans recharger
    history.replaceState(null, '', id);
  });
});


/* ==========================
   Offset d'ancre dynamique selon la hauteur du header
   ========================== */
function updateAnchorOffset() {
  const header = document.querySelector('header, .site-header, #siteNav');
  const headerH = (header?.offsetHeight || 0) + 12; // petite marge
  document.documentElement.style.setProperty('--anchor-offset', `${headerH}px`);
  return headerH;
}



/* ==========================
   Menu actif au scroll — version robuste (desktop + mobile)
   ========================== */
const sections = [...document.querySelectorAll('section[id]')];
const byHref = (id) => navLinks.find(a => a.getAttribute('href') === `#${id}`);

function getHeaderOffset() {
  // hauteur réelle du header (fonctionne burger + desktop)
  const header = document.querySelector('header, .site-header, #siteNav');
  return (header?.offsetHeight || 0) + 12; // petite marge
}

function setActiveLinkOnScroll() {
  // si on est dans un scroll déclenché par CLIC, on ne touche pas (ton handler gère déjà)
  if (clicking) return;

  const y = window.scrollY + getHeaderOffset();
  let currentId = null;

  for (const sec of sections) {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if (y >= top && y < bottom) {
      currentId = sec.id;
      break;
    }
  }

  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
  });
}

// garder ta variable CSS d’ancre à jour (si tu l’utilises côté CSS)
function updateAnchorOffsetVar() {
  const px = getHeaderOffset();
  document.documentElement.style.setProperty('--anchor-offset', `${px}px`);
}

// Écouteurs
window.addEventListener('load', () => {
  updateAnchorOffsetVar();      // met à jour la var CSS
  setActiveLinkOnScroll();      // calcule une 1ère fois
});
window.addEventListener('resize', () => {
  updateAnchorOffsetVar();
  setActiveLinkOnScroll();
}, { passive: true });
window.addEventListener('scroll', setActiveLinkOnScroll, { passive: true });




/* ==========================
   Bouton "Copier l’e-mail"
   ========================== */
(() => {
  const btn = document.getElementById('copyMail');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const email = btn.dataset.mail || 'macdonald.domnic@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      const initial = btn.innerHTML;
      btn.innerHTML = '✅ Copié !';
      setTimeout(() => (btn.innerHTML = initial), 1600);
    } catch (e) {
      // Fallback
      prompt('Copiez l’adresse e-mail :', email);
    }
  });
})();

/* ==========================
   Menu burger (unique et propre)
   ========================== */
(() => {
  const btn = document.getElementById('menuToggle'); // bouton burger
  const nav = document.getElementById('siteNav');    // conteneur <nav>
  if (!btn || !nav) return;

  const toggle = (force) => {
    const isOpen = typeof force === 'boolean' ? force : !nav.classList.contains('open');
    nav.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    document.documentElement.classList.toggle('nav-open', isOpen);
  };

  // Ouvre/ferme au clic
  btn.addEventListener('click', () => toggle());

  // Ferme avec Échap
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });

  // Sécurité : si on repasse en desktop, on ferme le menu mobile
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) toggle(false);
  });
})();


// ===== Bouton retour en haut =====
(() => {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
