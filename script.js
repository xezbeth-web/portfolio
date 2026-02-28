const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const revealTargets = document.querySelectorAll('.reveal');
const scrollBtn = document.querySelector('.scroll-top');
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
  let dotX = window.innerWidth / 2;
  let dotY = window.innerHeight / 2;
  let ringX = dotX;
  let ringY = dotY;

  window.addEventListener('mousemove', event => {
    dotX = event.clientX;
    dotY = event.clientY;
    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
  });

  function animateRing() {
    ringX += (dotX - ringX) * 0.2;
    ringY += (dotY - ringY) * 0.2;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const interactiveElements = document.querySelectorAll('a, button, .code-row, .project-showcase, .hover-target');
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      if (element.classList.contains('project-showcase') || element.classList.contains('hover-target')) {
        document.body.classList.add('cursor-project');
      }
    });
    element.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
      document.body.classList.remove('cursor-project');
    });
  });
}

if (cursorDot && cursorRing) {
  let dotX = window.innerWidth / 2;
  let dotY = window.innerHeight / 2;
  let ringX = dotX;
  let ringY = dotY;

  window.addEventListener('mousemove', event => {
    dotX = event.clientX;
    dotY = event.clientY;
    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
  });

  function animateRing() {
    ringX += (dotX - ringX) * 0.2;
    ringY += (dotY - ringY) * 0.2;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const interactiveElements = document.querySelectorAll('a, button, .project-showcase');
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

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
  grad.addColorStop(0, 'rgba(47,120,255,0.45)');
  grad.addColorStop(1, 'rgba(122,91,255,0.25)');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  ctx.stroke();
  requestAnimationFrame(renderTrail);
}
renderTrail();
