const doc = document;

// Smooth scroll for internal anchors
const scrollLinks = doc.querySelectorAll('a[href^="#"]');
scrollLinks.forEach(link => {
    link.addEventListener('click', evt => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = doc.querySelector(targetId);
        if (target) {
            evt.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Reveal on scroll
const revealItems = doc.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

revealItems.forEach(el => observer.observe(el));

// Testimonial slider
const slider = doc.querySelector('.slider');
if (slider) {
    const viewport = slider.querySelector('.slider__viewport');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const prevBtn = slider.querySelector('.slider__control--prev');
    const nextBtn = slider.querySelector('.slider__control--next');
    let current = 0;
    let autoPlay;

    const showSlide = index => {
        slides.forEach((slide, i) => {
            slide.classList.toggle('is-active', i === index);
        });
        viewport.style.transform = `translateX(-${index * 100}%)`;
    };

    const next = () => {
        current = (current + 1) % slides.length;
        showSlide(current);
    };

    const prev = () => {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
    };

    const startAuto = () => {
        clearInterval(autoPlay);
        autoPlay = setInterval(next, 5200);
    };

    prevBtn?.addEventListener('click', () => { prev(); startAuto(); });
    nextBtn?.addEventListener('click', () => { next(); startAuto(); });

    showSlide(current);
    startAuto();
}


