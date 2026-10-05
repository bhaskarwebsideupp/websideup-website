/**
 * about.js
 * Handles scroll animations and reveals for the About page.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initial load animations
  setTimeout(() => {
    document.body.classList.add('is-loaded');
  }, 100);

  // Scroll animations
  const animatedElements = document.querySelectorAll('.about-mark-section, .philosophy-statement, .facts-grid, .about-outro');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-view');
        obs.unobserve(entry.target); // Reveal once
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
});

