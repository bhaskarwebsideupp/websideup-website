/**
 * WEBSIDEUP — UNIFIED INTERACTION ENGINE
 * Navigation, Viewport-based Video Autoplay / Pause, Smooth Scroll, and Interactive Elements
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. CONSTANTS & INITIALIZATION
  ------------------------------------------------------------------ */
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_FINE_POINTER = window.matchMedia('(pointer: fine)').matches;
  const IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  function initEntrance() {
    document.body.classList.add('page-loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEntrance);
  } else {
    initEntrance();
  }

  /* ------------------------------------------------------------------
     1.5 DARK MODE TOGGLE
  ------------------------------------------------------------------ */
  const themeToggleBtn = document.getElementById('themeToggle');
  const moonIcon = document.querySelector('.moon-icon');
  const sunIcon = document.querySelector('.sun-icon');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if(moonIcon) moonIcon.style.display = 'none';
    if(sunIcon) sunIcon.style.display = 'block';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if(moonIcon) moonIcon.style.display = 'block';
        if(sunIcon) sunIcon.style.display = 'none';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if(moonIcon) moonIcon.style.display = 'none';
        if(sunIcon) sunIcon.style.display = 'block';
      }
    });
  }


  /* ------------------------------------------------------------------
     2. SCROLL PROGRESS BAR, HEADER SCROLL STATE & ACTIVE NAV SPY
  ------------------------------------------------------------------ */
  const progressBar = document.getElementById('scrollProgress');
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-links .nav-link, .mobile-nav-links .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  let scrollTicking = false;

  function updateScrollState() {
    const scrollY = window.scrollY;

    // Header background & elevation
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll progress indicator
    if (progressBar) {
      const doc = document.documentElement;
      const totalH = doc.scrollHeight - window.innerHeight;
      const pct = totalH > 0 ? (scrollY / totalH) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, pct)).toFixed(1) + '%';
    }

    // Active navigation scroll spy
    if (sections.length > 0 && navLinks.length > 0) {
      let currentId = '';
      sections.forEach(function (sec) {
        const top = sec.offsetTop - 120;
        const height = sec.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentId = sec.getAttribute('id');
        }
      });

      if (currentId) {
        navLinks.forEach(function (link) {
          const href = link.getAttribute('href');
          if (href === '#' + currentId || href === currentId) {
            link.classList.add('active');
          } else if (href && href.startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    }

    scrollTicking = false;
  }

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      requestAnimationFrame(updateScrollState);
      scrollTicking = true;
    }
  }, { passive: true });

  /* ------------------------------------------------------------------
     3. SMOOTH ANCHOR SCROLLING WITH HEADER OFFSET
  ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 84;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ------------------------------------------------------------------
     4. MOBILE NAVIGATION DRAWER
  ------------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (navToggle && mobileDrawer) {
    function toggleMenu(open) {
      const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
      navToggle.classList.toggle('open', isOpen);
      mobileDrawer.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    navToggle.addEventListener('click', function () {
      toggleMenu();
    });

    // Close mobile drawer on link click
    mobileDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggleMenu(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  /* ------------------------------------------------------------------
     5. VIEWPORT-BASED VIDEO AUTOPLAY / PAUSE (IntersectionObserver)
     - Plays when entering viewport
     - Pauses when leaving viewport
     - Saves laptop & mobile battery & GPU performance
  ------------------------------------------------------------------ */
  const portfolioVideos = document.querySelectorAll('video');

  if (portfolioVideos.length > 0) {
    portfolioVideos.forEach(function (v) {
      v.muted = true;
      v.playsInline = true;
      v.loop = true;
      v.setAttribute('playsinline', '');
      v.setAttribute('muted', '');

      // Inject Mute Toggle Button
      const parent = v.parentElement;
      if (parent && parent.classList.contains('media-box')) {
        const btn = document.createElement('button');
        btn.className = 'video-mute-btn';
        btn.setAttribute('aria-label', 'Toggle sound');
        btn.innerHTML = '<span class="mute-icon">🔇</span><span class="unmute-icon" style="display:none;">🔊</span>';
        
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          v.muted = !v.muted;
          const mIcon = btn.querySelector('.mute-icon');
          const uIcon = btn.querySelector('.unmute-icon');
          
          if (v.muted) {
            mIcon.style.display = 'block';
            uIcon.style.display = 'none';
          } else {
            mIcon.style.display = 'none';
            uIcon.style.display = 'block';
            
            // Auto-mute all other videos to prevent overlapping audio
            portfolioVideos.forEach(otherV => {
              if (otherV !== v && !otherV.muted) {
                otherV.muted = true;
                const otherBtn = otherV.parentElement.querySelector('.video-mute-btn');
                if (otherBtn) {
                  otherBtn.querySelector('.mute-icon').style.display = 'block';
                  otherBtn.querySelector('.unmute-icon').style.display = 'none';
                }
              }
            });
          }
        });
        parent.appendChild(btn);
      }
    });

    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          const video = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(function () {
                // Autoplay handled on user interaction
              });
            }
          } else {
            if (!video.paused) {
              video.pause();
            }
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px 50px 0px',
        threshold: [0, 0.25, 0.5, 0.75]
      });

      portfolioVideos.forEach(function (v) {
        videoObserver.observe(v);
      });
    } else {
      portfolioVideos.forEach(function (v) {
        v.play().catch(function () {});
      });
    }

    // User interaction unlock for mobile browsers
    const unlockEvents = ['touchstart', 'pointerdown', 'scroll', 'click'];
    function unlockAutoplay() {
      portfolioVideos.forEach(function (v) {
        const rect = v.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          v.play().catch(function () {});
        }
      });
      unlockEvents.forEach(function (evt) {
        window.removeEventListener(evt, unlockAutoplay, { passive: true });
      });
    }
    unlockEvents.forEach(function (evt) {
      window.addEventListener(evt, unlockAutoplay, { passive: true, once: true });
    });

    // Tab visibility handling
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        portfolioVideos.forEach(function (v) {
          if (!v.paused) v.pause();
        });
      } else {
        portfolioVideos.forEach(function (v) {
          const rect = v.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            v.play().catch(function () {});
          }
        });
      }
    });
  }

  /* ------------------------------------------------------------------
     6. SERVICES INTERACTIVE PREVIEW (Capabilities Roster)
  ------------------------------------------------------------------ */
  const serviceRows = document.querySelectorAll('.service-nav-row[data-service]');
  const previewCard = document.getElementById('servicePreviewCard');

  const SERVICES_DATA = {
    web: {
      badge: "01 · CORE ARCHITECTURE",
      title: "Web Design & Development",
      desc: "High-performance digital flagship websites engineered for brand authority, fluid responsive motion, and commercial conversions.",
      deliverables: ["Custom UI/UX Architecture", "Responsive Web Engineering", "Performance Optimization", "Interaction & Motion Systems"]
    },
    seo: {
      badge: "02 · ORGANIC VISIBILITY",
      title: "Search Engine Optimization",
      desc: "Technical SEO and content architecture designed to build high-intent search visibility and compound organic traffic.",
      deliverables: ["Technical SEO & Schema", "Search Intent Architecture", "Local Search Dominance", "Performance & Core Web Vitals"]
    },
    social: {
      badge: "03 · SOCIAL & MOTION",
      title: "Social Media & Reels",
      desc: "High-impact social media management and cinematic short-form video production built to capture attention and build genuine community.",
      deliverables: ["Short-form Video Production", "Content Strategy & Calendar", "Community Engagement", "Visual Brand Systems"]
    },
    paid: {
      badge: "04 · ACQUISITION",
      title: "Paid Advertising (Meta & Google)",
      desc: "Data-driven multi-channel advertising campaigns built for efficient customer acquisition and measurable return on ad spend.",
      deliverables: ["Meta Ads (Instagram / FB)", "Google Search & Performance Max", "Creative Testing Framework", "Full Funnel Tracking"]
    },
    ppc: {
      badge: "05 · HIGH INTENT PPC",
      title: "Pay-Per-Click Marketing",
      desc: "Hyper-targeted search and shopping campaigns that capture active demand at the exact moment of purchase intent.",
      deliverables: ["Search Campaign Architecture", "Negative Keyword Matrix", "High-Converting Landing Pages", "Bid Strategy Optimization"]
    },
    email: {
      badge: "06 · AUDIENCE RETENTION",
      title: "Email Marketing & Automation",
      desc: "Bespoke lifecycle marketing and automated nurture funnels that transform one-time visitors into repeat lifelong customers.",
      deliverables: ["Automated Onboarding Flows", "Behavioral Segmentation", "Editorial Campaign Design", "Deliverability & List Health"]
    },
    content: {
      badge: "07 · BRAND NARRATIVE",
      title: "Content Creation & Production",
      desc: "End-to-end creative production from studio motion shoots to strategic brand copywriting that makes your business unforgettable.",
      deliverables: ["Cinematic Video Production", "Studio Photography", "Editorial Copywriting", "Multi-Format Asset Suites"]
    }
  };

  if (serviceRows.length > 0 && previewCard) {
    serviceRows.forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        const key = this.getAttribute('data-service');
        if (SERVICES_DATA[key]) {
          serviceRows.forEach(function (r) { r.classList.remove('is-active'); });
          this.classList.add('is-active');
          renderPreview(SERVICES_DATA[key]);
        }
      });
      row.addEventListener('click', function () {
        const key = this.getAttribute('data-service');
        if (SERVICES_DATA[key]) {
          serviceRows.forEach(function (r) { r.classList.remove('is-active'); });
          this.classList.add('is-active');
          renderPreview(SERVICES_DATA[key]);
        }
      });
    });

    function renderPreview(data) {
      const badge = previewCard.querySelector('.preview-badge');
      const title = previewCard.querySelector('.preview-title');
      const desc = previewCard.querySelector('.preview-desc');
      const list = previewCard.querySelector('.preview-deliverables');

      if (badge) badge.textContent = data.badge;
      if (title) title.textContent = data.title;
      if (desc) desc.textContent = data.desc;
      if (list) {
        list.innerHTML = data.deliverables.map(function (d) {
          return '<li>' + d + '</li>';
        }).join('');
      }
    }
  }

  /* ------------------------------------------------------------------
     7. SCROLL REVEAL OBSERVER
  ------------------------------------------------------------------ */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0 && 'IntersectionObserver' in window && !REDUCED_MOTION) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  /* ------------------------------------------------------------------
     8. CUSTOM CURSOR (Desktop Fine Pointer Only)
  ------------------------------------------------------------------ */
  const cursor = document.getElementById('cursor');

  if (cursor && IS_FINE_POINTER && !IS_TOUCH && !REDUCED_MOTION) {
    let mouseX = -100, mouseY = -100;
    let isMouseActive = false;

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMouseActive) {
        isMouseActive = true;
        document.body.classList.add('has-custom-cursor');
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      mouseX = -100;
      mouseY = -100;
      cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function () {
      cursor.style.opacity = '1';
    });

    function renderCursor() {
      if (isMouseActive) {
        cursor.style.transform = 'translate3d(' + mouseX + 'px,' + mouseY + 'px,0) translate(-50%,-50%)';
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    document.addEventListener('mouseover', function (e) {
      const target = e.target;
      const mediaEl = target.closest('.media-box, .video-card, .project-media-frame');
      const actionEl = target.closest('a, button, .service-nav-row');

      if (mediaEl) {
        cursor.classList.remove('cursor-hover');
        cursor.classList.add('cursor-view');
      } else if (actionEl) {
        cursor.classList.remove('cursor-view');
        cursor.classList.add('cursor-hover');
      } else {
        cursor.classList.remove('cursor-hover', 'cursor-view');
      }
    });
  }

})();
