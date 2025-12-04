const selectAll = (q, ctx = document) => Array.from(ctx.querySelectorAll(q));

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  const overlay = document.querySelector(".nav__overlay");
  const burger = document.querySelector(".nav__burger");
  const spotlight = document.querySelector(".cursor-spotlight");
  const counters = selectAll(".stat");
  const showreelTrack = document.querySelector("[data-scroll-track]");
  const splitTargets = selectAll("[data-split]");

  // Split text for staggered reveal
  splitTargets.forEach((el) => {
    const words = el.textContent.trim().split(" ");
    el.textContent = "";
    words.forEach((word, i) => {
      const wrapper = document.createElement("span");
      wrapper.className = "word";
      const span = document.createElement("span");
      span.textContent = word;
      span.style.animationDelay = `${i * 80}ms`;
      wrapper.appendChild(span);
      el.appendChild(wrapper);
      el.appendChild(document.createTextNode(" "));
    });
  });

  // Sticky nav state
  const onScrollNav = () => {
    nav.classList.toggle("is-solid", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScrollNav);
  onScrollNav();

  // Reveal on scroll
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -20px 0px" }
  );
  selectAll(".reveal").forEach((el) => io.observe(el));

  // Hero parallax
  const heroTitle = document.querySelector("[data-parallax]");
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (heroTitle) heroTitle.style.transform = `translateY(${y * -0.08}px)`;
  });

  // Spotlight cursor with easing
  let targetX = window.innerWidth * 0.5;
  let targetY = window.innerHeight * 0.5;
  let spotX = targetX;
  let spotY = targetY;

  document.addEventListener("pointermove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  const animateSpotlight = () => {
    spotX += (targetX - spotX) * 0.12;
    spotY += (targetY - spotY) * 0.12;
    spotlight.style.setProperty("--x", `${spotX}px`);
    spotlight.style.setProperty("--y", `${spotY}px`);
    requestAnimationFrame(animateSpotlight);
  };
  animateSpotlight();

  // Smooth anchor scroll
  selectAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Burger menu with stagger overlay
  const toggleMenu = () => overlay.classList.toggle("is-open");
  burger.addEventListener("click", toggleMenu);
  selectAll(".overlay__link").forEach((link, idx) => {
    link.style.transitionDelay = `${idx * 60}ms`;
    link.addEventListener("click", toggleMenu);
  });

  // Counter animation
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          let start = 0;
          const step = () => {
            start += Math.max(1, Math.floor(target / 60));
            if (start >= target) {
              el.textContent = target;
            } else {
              el.textContent = start;
              requestAnimationFrame(step);
            }
          };
          requestAnimationFrame(step);
          countObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((el) => countObserver.observe(el));

  // Showreel horizontal motion and dynamics
  let lastScrollY = window.scrollY;
  let velocity = 0;

  const handleShowreel = () => {
    if (!showreelTrack) return;
    const rect = showreelTrack.getBoundingClientRect();
    const progress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
    const translate = (progress - 0.5) * 140;
    showreelTrack.style.transform = `translate3d(${translate}px, 0, 0)`;

    const currentY = window.scrollY;
    velocity = currentY - lastScrollY;
    lastScrollY = currentY;

    selectAll(".showreel__item").forEach((item, idx) => {
      const active = Math.abs(progress - idx * 0.18 - 0.2) < 0.3;
      item.classList.toggle("is-active", active);
      const sat = Math.max(0.7, 1 - Math.abs(velocity) * 0.01);
      item.style.filter = active ? `blur(0px) saturate(${sat})` : `blur(6px) saturate(${sat * 0.7})`;
      item.style.transform = active
        ? `rotate(0deg) translateZ(0)`
        : `rotate(-1.5deg) translateZ(0) perspective(800px) rotateY(${velocity * 0.03}deg)`;
    });
  };
  window.addEventListener("scroll", () => requestAnimationFrame(handleShowreel), { passive: true });
  handleShowreel();
});
