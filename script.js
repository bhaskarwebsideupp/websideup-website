/**
 * WEBSIDEUP — CONSOLIDATED MASTER INTERACTION & MOTION CONTROLLER
 * Senior Creative Frontend & Motion System Repair Pass
 * Zero-bloat, 60fps single rAF loop, pointer-fine cursor, conservative magnetic CTAs,
 * non-blocking haptics, and IntersectionObserver reveals.
 */

(function () {
  'use strict';

  // 1. Accessibility and hardware checks
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  // DOM Elements
  const body = document.body;
  const siteHeader = document.getElementById('siteHeader');
  const customCursor = document.getElementById('customCursor');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const liveClock = document.getElementById('liveClock');
  const scrollProgress = document.getElementById('scrollProgressBar');

  // --- 2. HAPTIC FEEDBACK HELPER (Discrete user gestures ONLY, max 12ms) ---
  function triggerHaptic(duration = 8) {
    if ('vibrate' in navigator && navigator.maxTouchPoints > 0) {
      try {
        navigator.vibrate(Math.min(12, duration));
      } catch (_) {}
    }
  }

  // --- 3. PAGE ENTRANCE & OVERFLOW SAFETY ---
  function initEntrance() {
    requestAnimationFrame(() => {
      body.classList.add('is-loaded');
    });
  }

  // --- 4. FLOATING NAVBAR & SCROLL PROGRESS (Single rAF throttled scroll handler) ---
  let lastScrollY = 0;
  let scrollTicking = false;

  function onScroll() {
    lastScrollY = window.scrollY || window.pageYOffset;
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        // Site Header glassmorphic background toggle
        if (siteHeader) {
          if (lastScrollY > 25) {
            siteHeader.classList.add('is-scrolled');
          } else {
            siteHeader.classList.remove('is-scrolled');
          }
        }

        // Scroll Progress Bar fill
        if (scrollProgress) {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) {
            const pct = Math.min(100, Math.max(0, (lastScrollY / docHeight) * 100));
            scrollProgress.style.width = `${pct}%`;
          }
        }

        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // --- 5. UNIFIED REFINED DESKTOP CURSOR (Mouse/Trackpad fine pointer ONLY) ---
  if (customCursor && isFinePointer && !prefersReducedMotion) {
    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    // Single requestAnimationFrame interpolation loop
    function renderCursor() {
      // Direct fast spring interpolation (ease 0.28 for immediate feel, zero visible lag)
      cursorX += (mouseX - cursorX) * 0.28;
      cursorY += (mouseY - cursorY) * 0.28;

      customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Contextual cursor labels on hover
    const hoverTargets = document.querySelectorAll('a, button, .work-video-component, .service-entry-card, .gallery-item, .category-btn');
    hoverTargets.forEach((el) => {
      el.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse') return;
        customCursor.classList.add('cursor-hover');
        
        if (el.classList.contains('work-video-component') || el.classList.contains('gallery-item')) {
          customCursor.innerHTML = '<span class="cursor-label">PLAY</span>';
        } else if (el.tagName.toLowerCase() === 'a' || el.tagName.toLowerCase() === 'button') {
          customCursor.innerHTML = '<span class="cursor-label">VIEW ↗</span>';
        }
      });

      el.addEventListener('pointerleave', (e) => {
        if (e.pointerType !== 'mouse') return;
        customCursor.classList.remove('cursor-hover');
        customCursor.innerHTML = '';
      });
    });
  } else if (customCursor) {
    customCursor.style.display = 'none';
  }

  // --- 6. MAGNETIC BUTTONS (Desktop fine pointer ONLY, conservative 6-10px max) ---
  if (isFinePointer && !prefersReducedMotion) {
    const magneticTargets = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta-btn, .mobile-cta-btn, .service-cta-btn, .cta-primary-btn, .btn-next');
    
    magneticTargets.forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Gentle attraction offset (capped at ~8px)
        const moveX = (e.clientX - centerX) * 0.08;
        const moveY = (e.clientY - centerY) * 0.08;
        
        btn.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`;
      });

      btn.addEventListener('pointerleave', (e) => {
        if (e.pointerType !== 'mouse') return;
        btn.style.transform = 'translate3d(0, 0, 0)';
        btn.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      });

      btn.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse') return;
        btn.style.transition = 'none';
      });
    });
  }

  // --- 7. MOBILE NAVIGATION DRAWER & ACCESSIBILITY ---
  if (mobileToggle && mobileDrawer) {
    function toggleMobileMenu() {
      const isOpen = mobileDrawer.classList.contains('is-open');
      triggerHaptic(8);

      if (isOpen) {
        mobileDrawer.classList.remove('is-open');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        body.style.overflow = '';
      } else {
        mobileDrawer.classList.add('is-open');
        mobileToggle.classList.add('is-active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        body.style.overflow = 'hidden';
      }
    }

    mobileToggle.addEventListener('click', toggleMobileMenu);

    // Close on link click inside drawer
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('is-open')) {
          toggleMobileMenu();
        }
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        toggleMobileMenu();
      }
    });
  }

  // --- 8. GLOBAL REVEAL ANIMATIONS (INTERSECTION OBSERVER) ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-item, .scroll-reveal-text, .section-title, .work-project-section');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view', 'is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -10% 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // --- 9. LIVE IST DELHI CLOCK ---
  function updateDelhiClock() {
    if (!liveClock) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      liveClock.textContent = new Intl.DateTimeFormat('en-GB', options).format(now);
    } catch (_) {
      const now = new Date();
      liveClock.textContent = now.toTimeString().split(' ')[0];
    }
  }

  if (liveClock) {
    updateDelhiClock();
    setInterval(updateDelhiClock, 1000);
  }

  // --- 10. LIGHTWEIGHT SUBTLE PAGE TRANSITIONS ---
  document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', function (e) {
      triggerHaptic(8);
      const href = this.getAttribute('href');
      if (!href) return;

      const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
      const isHash = href.startsWith('#') || href.includes('#');
      const isNewTab = this.getAttribute('target') === '_blank';

      if (!isExternal && !isNewTab && !isHash && href !== '') {
        e.preventDefault();
        body.classList.add('is-exiting');
        setTimeout(() => {
          window.location.href = href;
        }, 220); // Fast 220ms exit feel
      }
    });
  });

  // Init entrance on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEntrance);
  } else {
    initEntrance();
  }

})();
