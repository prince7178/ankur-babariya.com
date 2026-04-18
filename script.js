/* ============================================
   Arnav & Netri — interactions
   ============================================ */

/* ===== floating hearts background ===== */
const heartsBg = document.getElementById('heartsBg');
const HEARTS = ['♡', '♥', '🌸', '✨', '💕', '🌙'];

function spawnHeart() {
  const h = document.createElement('span');
  h.className = 'heart';
  h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = (12 + Math.random() * 18) + 'px';
  const dur = 9 + Math.random() * 8;
  h.style.animationDuration = dur + 's';
  h.style.opacity = (0.35 + Math.random() * 0.5).toString();
  heartsBg.appendChild(h);
  setTimeout(() => h.remove(), dur * 1000);
}
setInterval(spawnHeart, 750);
for (let i = 0; i < 10; i++) setTimeout(spawnHeart, i * 250);

/* ===== scroll progress bar ===== */
const progress = document.getElementById('scrollProgress');
function updateProgress() {
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
  progress.style.width = (scrolled * 100) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

/* ===== shrinking nav on scroll ===== */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}, { passive: true });

/* ===== cursor glow (desktop only) ===== */
const cursor = document.getElementById('cursorGlow');
let cursorVisible = false;
if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', (e) => {
    if (!cursorVisible) {
      cursor.style.opacity = '1';
      cursorVisible = true;
    }
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorVisible = false;
  });
}

/* ===== days-together counter (animated) ===== */
const startDate = new Date('2024-06-14');
const dayEl = document.getElementById('daysCounter');
if (dayEl) {
  const days = Math.max(1, Math.floor((Date.now() - startDate) / (1000 * 60 * 60 * 24)));
  let n = 0;
  const step = Math.max(1, Math.floor(days / 60));
  const tick = () => {
    n = Math.min(days, n + step);
    dayEl.textContent = n.toLocaleString();
    if (n < days) requestAnimationFrame(tick);
  };
  setTimeout(tick, 600);
}

/* ===== stagger chat bubble entry per phone ===== */
document.querySelectorAll('.phone').forEach(phone => {
  const bubbles = phone.querySelectorAll('.bubble, .typing, .day');
  bubbles.forEach((b, i) => {
    b.style.animationDelay = (i * 0.12) + 's';
  });
});

/* ===== subtle phone parallax on mouse move ===== */
const phonesWrap = document.querySelector('.phones');
if (phonesWrap && window.matchMedia('(pointer: fine)').matches) {
  phonesWrap.addEventListener('mousemove', (e) => {
    const rect = phonesWrap.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    phonesWrap.querySelectorAll('.phone').forEach((p, i) => {
      const depth = (i - 1) * 6;
      p.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
    });
  });
  phonesWrap.addEventListener('mouseleave', () => {
    phonesWrap.querySelectorAll('.phone').forEach(p => p.style.transform = '');
  });
}

/* ===== hero parallax (moon + stars) ===== */
const moon = document.querySelector('.moon');
const stars = document.querySelector('.stars');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (moon) moon.style.transform = `translateY(${y * 0.25}px)`;
  if (stars) stars.style.transform = `translateY(${y * 0.15}px)`;
}, { passive: true });

/* ===== video play button toggle ===== */
document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = btn.textContent.trim() === '▶' ? '❚❚' : '▶';
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => btn.style.transform = '', 150);
  });
});

/* ===== voice note toggle ===== */
document.querySelectorAll('.bubble.voice .play').forEach(p => {
  p.addEventListener('click', () => {
    p.textContent = p.textContent.trim() === '▶' ? '❚❚' : '▶';
  });
});

/* ===== reveal-on-scroll ===== */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.polaroid, .video-card, .timeline li, .phone, .section-head').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i % 4) * 80 + 'ms';
  io.observe(el);
});

/* ===== gallery lightbox ===== */
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Close">✕</button>
  <div class="lightbox-inner">
    <div class="lightbox-photo"></div>
    <p class="lightbox-cap"></p>
  </div>
`;
document.body.appendChild(lightbox);

const lbPhoto = lightbox.querySelector('.lightbox-photo');
const lbCap = lightbox.querySelector('.lightbox-cap');
const lbClose = lightbox.querySelector('.lightbox-close');

document.querySelectorAll('.polaroid').forEach(card => {
  card.addEventListener('click', () => {
    const photo = card.querySelector('.photo');
    const cap = card.querySelector('figcaption');
    lbPhoto.style.background = window.getComputedStyle(photo).background;
    lbPhoto.innerHTML = photo.innerHTML;
    lbCap.textContent = cap ? cap.textContent : '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ===== smooth-scroll polish for in-page links ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});
