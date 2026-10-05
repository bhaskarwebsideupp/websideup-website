/**
 * insights.js
 * Handles category filtering and animations on the Insights index page.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initial load animation
  setTimeout(() => {
    document.body.classList.add('is-loaded');
  }, 100);

  // Category Filtering
  const filterBtns = document.querySelectorAll('.category-btn');
  const articles = document.querySelectorAll('.index-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter articles
      articles.forEach((article, index) => {
        // Reset animation states for clean re-entry
        article.style.opacity = '0';
        article.style.transform = 'translateY(10px)';
        article.classList.remove('is-in-view');
        
        setTimeout(() => {
          if (filterValue === 'all' || article.getAttribute('data-category') === filterValue) {
            article.style.display = 'block';
            
            // Re-trigger animation
            setTimeout(() => {
              article.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
              article.style.opacity = '1';
              article.style.transform = 'translateY(0)';
              article.classList.add('is-in-view');
            }, 50 * index); // Stagger
            
          } else {
            article.style.display = 'none';
          }
        }, 300); // Wait for fade out
      });
    });
  });

  // Scroll animations for articles and CTA
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-view');
        
        const reveals = entry.target.querySelectorAll('.scroll-reveal-text');
        reveals.forEach((r, i) => {
          r.style.transitionDelay = `${i * 0.1}s`;
          r.classList.add('is-in-view');
        });

        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.index-item, .insights-outro-cta').forEach(el => observer.observe(el));
});

