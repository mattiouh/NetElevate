const navbar = document.getElementById("navbar");
const animatedItems = document.querySelectorAll("[data-animate]");
const parallaxItems = document.querySelectorAll("[data-parallax]");

const setNavbarState = () => {
  if (window.scrollY > 24) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
};

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

animatedItems.forEach(el => observer.observe(el));

// Gentle parallax
let ticking = false;
const parallaxStrength = 14;

const handleParallax = () => {
  parallaxItems.forEach(el => {
    const rect = el.getBoundingClientRect();
    const offset = rect.top + rect.height * 0.5 - window.innerHeight * 0.5;
    const translate = Math.max(Math.min(offset * 0.05, parallaxStrength), -parallaxStrength);
    el.style.transform = `translateY(${translate}px)`;
  });
  ticking = false;
};

const onScroll = () => {
  setNavbarState();
  if (!ticking) {
    window.requestAnimationFrame(handleParallax);
    ticking = true;
  }
};

window.addEventListener("scroll", onScroll);
window.addEventListener("load", () => {
  setNavbarState();
  handleParallax();
});

// Testimonial slider
const slider = document.getElementById("testimonial-slider");
if (slider) {
  const slides = Array.from(slider.querySelectorAll(".slide"));
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");
  let index = 0;
  let timer;

  const showSlide = nextIndex => {
    slides[index].classList.remove("active");
    index = (nextIndex + slides.length) % slides.length;
    slides[index].classList.add("active");
  };

  const startAuto = () => {
    stopAuto();
    timer = setInterval(() => showSlide(index + 1), 6500);
  };

  const stopAuto = () => {
    if (timer) clearInterval(timer);
  };

  prevBtn.addEventListener("click", () => {
    showSlide(index - 1);
    startAuto();
  });

  nextBtn.addEventListener("click", () => {
    showSlide(index + 1);
    startAuto();
  });

  slider.addEventListener("mouseenter", stopAuto);
  slider.addEventListener("mouseleave", startAuto);

  startAuto();
}
