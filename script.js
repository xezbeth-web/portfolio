const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const revealTargets = document.querySelectorAll('.reveal');
const scrollBtn = document.querySelector('.scroll-top');

const typingVerb = document.getElementById('typing-verb');
const verbs = ['Building', 'Creating', 'Designing'];
let verbIndex = 0;
let charIndex = verbs[0].length;
let deleting = false;

function tickTyping() {
  if (!typingVerb) return;
  const word = verbs[verbIndex];

  if (!deleting) {
    charIndex += 1;
    if (charIndex >= word.length) {
      charIndex = word.length;
      deleting = true;
      setTimeout(tickTyping, 900);
      return;
    }
  } else {
    charIndex -= 1;
    if (charIndex <= 0) {
      deleting = false;
      verbIndex = (verbIndex + 1) % verbs.length;
      charIndex = 0;
    }
  }

  typingVerb.textContent = word.slice(0, charIndex);
  setTimeout(tickTyping, deleting ? 70 : 100);
}
if (typingVerb) setTimeout(tickTyping, 900);

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
}

const sectionObserver = new IntersectionObserver(entries => {
  const active = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!active) return;
  const id = active.target.id;
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
}, { threshold: [0.3, 0.55, 0.75] });
sections.forEach(section => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
revealTargets.forEach(node => revealObserver.observe(node));

if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 320);
  });
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const trailCanvas = document.getElementById('trail-canvas');
const ctx = trailCanvas ? trailCanvas.getContext('2d') : null;
let points = [];

function resizeCanvas() {
  if (!trailCanvas) return;
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mousemove', e => {
  points.push({ x: e.clientX, y: e.clientY, life: 1 });
  if (points.length > 90) points.shift();
});

function renderTrail() {
  if (!ctx || !trailCanvas) return;
  ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  ctx.beginPath();
  for (let i = 0; i < points.length; i += 1) {
    const p = points[i];
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
    p.life -= 0.014;
  }
  points = points.filter(p => p.life > 0);
  const grad = ctx.createLinearGradient(0, 0, trailCanvas.width, trailCanvas.height);
  grad.addColorStop(0, 'rgba(47,120,255,0.40)');
  grad.addColorStop(1, 'rgba(122,91,255,0.20)');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  ctx.stroke();
  requestAnimationFrame(renderTrail);
}
renderTrail();
