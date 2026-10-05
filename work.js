/**
 * WEBSIDEUP — WORK PAGE CONTROLLER
 * Project index smooth anchor jump and active state tracking
 */
(function () {
  'use strict';

  const projectSections = document.querySelectorAll('.project-section[id]');
  const indexItems = document.querySelectorAll('.project-index-item[href]');

  if (projectSections.length > 0 && indexItems.length > 0) {
    // Smooth scroll on click with header offset
    indexItems.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const headerOffset = 110;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            indexItems.forEach(function (i) { i.classList.remove('active'); });
            this.classList.add('active');
          }
        }
      });
    });

    // Scroll spy for index pills
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const targetId = entry.target.id;
            indexItems.forEach(function (link) {
              const href = link.getAttribute('href').replace('#', '');
              if (href === targetId) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, {
        rootMargin: '-20% 0px -50% 0px',
        threshold: 0.1
      });

      projectSections.forEach(function (sec) {
        sectionObserver.observe(sec);
      });
    }
  }

})();
