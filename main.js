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
   Menu burger (optionnel)
   ========================== */
(() => {
  // Adapte ces sélecteurs à ton HTML
  const btn = document.getElementById('menuToggle'); // bouton burger
  const nav = document.getElementById('siteNav');    // conteneur <nav>
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    document.documentElement.classList.toggle('nav-open');
  });
})();

(() => {
  const btn = document.getElementById('menuToggle'); // bouton burger
  const nav = document.getElementById('siteNav');    // nav
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    document.documentElement.classList.toggle('nav-open', isOpen);
  });
})();


const nav = document.getElementById('siteNav');
if (nav) nav.classList.remove('open');
document.documentElement.classList.remove('nav-open');


