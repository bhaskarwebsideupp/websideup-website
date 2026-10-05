/**
 * process.js
 * Handles the scroll-driven storytelling on the WebsideUp Process page.
 */

document.addEventListener('DOMContentLoaded', () => {
  const steps = document.querySelectorAll('.process-step');
  const visualCanvas = document.getElementById('visualCanvas');
  const progressFill = document.getElementById('progressFill');

  if (!steps.length || !visualCanvas || !progressFill) return;

  // Intersection Observer to detect which step is currently active
  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px', // Trigger when step is around the middle of the viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all
        steps.forEach(s => s.classList.remove('is-active'));
        
        // Add active class to intersecting step
        const activeStep = entry.target;
        activeStep.classList.add('is-active');

        // Update the visual canvas state
        const stepNum = activeStep.getAttribute('data-step');
        visualCanvas.setAttribute('data-active-state', stepNum);
      }
    });
  }, observerOptions);

  steps.forEach(step => observer.observe(step));

  // Scroll listener specifically for the progress line filling up
  // Calculate how far down the .process-left container we are
  const processLeft = document.querySelector('.process-left');
  
  if (processLeft) {
    window.addEventListener('scroll', () => {
      // Only do this on desktop where processLeft exists and is used for scrolling
      if (window.innerWidth < 992) return;

      const rect = processLeft.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate progress percentage
      // rect.top is 0 when processLeft touches top of viewport
      // rect.bottom is viewportHeight when processLeft bottom touches bottom of viewport
      
      // Total scrollable distance for this block
      const totalDistance = rect.height - viewportHeight;
      
      // Current scrolled distance within the block
      // Starts at 0 when rect.top = 20vh (approx when it begins)
      // Actually simpler: just map the scroll position to the container height
      
      let progress = 0;
      
      if (rect.top <= viewportHeight / 2) {
        const scrolled = (viewportHeight / 2) - rect.top;
        progress = (scrolled / rect.height) * 100;
        
        // Cap between 0 and 100
        progress = Math.max(0, Math.min(100, progress));
      }
      
      progressFill.style.height = `${progress}%`;
    });
  }
});

