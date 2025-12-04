const smoothAnchors = document.querySelectorAll('a[href^="#"]');

smoothAnchors.forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
revealElements.forEach((el) => revealObserver.observe(el));

const track = document.querySelector('.reviews-track');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let sliderTimer;

const setSlide = (index) => {
  if (!track) return;
  currentSlide = index;
  track.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
};

const nextSlide = () => {
  const total = track ? track.children.length : 0;
  if (!total) return;
  const next = (currentSlide + 1) % total;
  setSlide(next);
};

const startAutoplay = () => {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(nextSlide, 6000);
};

if (track && dots.length) {
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      setSlide(Number(dot.dataset.index));
      startAutoplay();
    });
  });
  startAutoplay();
}
