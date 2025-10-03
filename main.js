/* ==========================
   Smooth scrolling (liens internes)
   ========================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });

    // Ferme le menu mobile après un clic
    const nav = document.getElementById('siteNav');
    if (nav) nav.classList.remove('open');
    document.documentElement.classList.remove('nav-open');
  });
});

/* ==========================
   Menu actif au scroll
   ========================== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

const byHref = (id) => [...navLinks].find(a => a.getAttribute('href') === `#${id}`);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const link = byHref(entry.target.id);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 });

sections.forEach(sec => observer.observe(sec));

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
