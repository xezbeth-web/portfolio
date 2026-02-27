const revealTargets = document.querySelectorAll('.reveal');
const scrollBtn = document.querySelector('.scroll-top');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
const glows = document.querySelectorAll('.ambient-glow');
const tiltCards = document.querySelectorAll('[data-tilt]');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach(target => observer.observe(target));

window.addEventListener('scroll', () => {
  if (scrollBtn) scrollBtn.classList.toggle('visible', window.scrollY > 320);
});

if (scrollBtn) {
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;
const particles = [];

function createParticle() {
  const particle = document.createElement('span');
  particle.className = 'cursor-particle';
  document.body.appendChild(particle);
  return { el: particle, x: 0, y: 0 };
}

for (let i = 0; i < 10; i += 1) {
  particles.push(createParticle());
}

function animateCursor() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;

  if (cursorRing && cursorDot) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }

  particles.forEach((particle, index) => {
    const ease = 0.08 + index * 0.012;
    particle.x += (ringX - particle.x) * ease;
    particle.y += (ringY - particle.y) * ease;
    particle.el.style.left = `${particle.x}px`;
    particle.el.style.top = `${particle.y}px`;
    particle.el.style.opacity = `${(index + 1) / particles.length}`;
    particle.el.style.transform = `translate(-50%, -50%) scale(${0.4 + (index / particles.length) * 0.8})`;
  });

  requestAnimationFrame(animateCursor);
}
animateCursor();

window.addEventListener('mousemove', event => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  const offsetX = (mouseX / window.innerWidth - 0.5) * 28;
  const offsetY = (mouseY / window.innerHeight - 0.5) * 28;

  glows.forEach((glow, i) => {
    const sign = i === 0 ? 1 : -1;
    glow.style.transform = `translate(${offsetX * sign}px, ${offsetY * sign}px)`;
  });
});

['a', 'button', '.card'].forEach(selector => {
  document.querySelectorAll(selector).forEach(element => {
    element.addEventListener('mouseenter', () => {
      if (cursorRing) cursorRing.classList.add('active');
    });
    element.addEventListener('mouseleave', () => {
      if (cursorRing) cursorRing.classList.remove('active');
    });
  });
});

tiltCards.forEach(card => {
  card.addEventListener('mousemove', event => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 9;
    const rotateX = ((y / rect.height) - 0.5) * -9;
    card.style.transform = `perspective(960px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(960px) rotateX(0) rotateY(0)';
  });
});
