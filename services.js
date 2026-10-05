/**
 * WEBSIDEUP — SERVICES PAGE SPECIFIC CONTROLLER
 * Motion-first editorial experience, scroll-spy sticky navigation,
 * and expandable deliverable accordions.
 */

(function () {
  'use strict';

  const serviceCards = document.querySelectorAll('.service-entry-card');
  const stickyItems = document.querySelectorAll('.sticky-service-item');
  const deliverableButtons = document.querySelectorAll('.deliverables-toggle-btn');
  const stickyProgressBar = document.getElementById('stickyProgressBar');
  const activeCounterNum = document.getElementById('activeCounterNum');

  /* --------------------------------------------------------------------------
     1. EDITORIAL SCROLL-SPY FOR SERVICES INDEX
     -------------------------------------------------------------------------- */
  let currentActiveIndex = -1;
  let scrollSpyTicking = false;

  function updateActiveServiceOnScroll() {
    if (!serviceCards.length) return;

    const viewportHeight = window.innerHeight;
    const triggerOffset = viewportHeight * 0.35;
    let activeIdx = 0;

    serviceCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (rect.top <= triggerOffset) {
        activeIdx = index;
      }
    });

    if (activeIdx !== currentActiveIndex) {
      currentActiveIndex = activeIdx;
      applyActiveService(activeIdx);
    }
  }

  function applyActiveService(index) {
    const activeCard = serviceCards[index];
    if (!activeCard) return;

    const serviceId = activeCard.id;
    const serviceNum = activeCard.getAttribute('data-service-index') || `0${index + 1}`;

    // Active state toggles
    serviceCards.forEach((c, i) => {
      if (i === index) {
        c.classList.add('is-active-service');
      } else {
        c.classList.remove('is-active-service');
      }
    });

    // Sticky nav sync
    stickyItems.forEach((item) => {
      if (item.getAttribute('data-target') === serviceId) {
        item.classList.add('active');
        if (window.innerWidth <= 1024) {
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      } else {
        item.classList.remove('active');
      }
    });

    if (activeCounterNum) {
      activeCounterNum.textContent = serviceNum;
    }

    if (stickyProgressBar && serviceCards.length) {
      const percent = ((index + 1) / serviceCards.length) * 100;
      stickyProgressBar.style.height = `${percent}%`;
    }
  }

  function onScroll() {
    if (!scrollSpyTicking) {
      requestAnimationFrame(() => {
        updateActiveServiceOnScroll();
        scrollSpyTicking = false;
      });
      scrollSpyTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Smooth scroll click handler for sticky nav items
  stickyItems.forEach((item) => {
    const link = item.querySelector('a');
    if (!link) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-target');
      const targetElem = document.getElementById(targetId);
      if (targetElem) {
        const headerOffset = 90;
        const elemPosition = targetElem.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elemPosition - headerOffset,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
     2. EXPANDABLE DELIVERABLES ACCORDION ("WHAT WE HANDLE")
     -------------------------------------------------------------------------- */
  deliverableButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const targetId = btn.getAttribute('aria-controls');
      const targetDrawer = document.getElementById(targetId);
      const stateText = btn.querySelector('.toggle-state-text');

      if (!targetDrawer) return;

      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        targetDrawer.classList.remove('is-expanded');
        if (stateText) {
          stateText.textContent = stateText.textContent.replace('COLLAPSE', 'EXPAND');
        }
      } else {
        btn.setAttribute('aria-expanded', 'true');
        targetDrawer.classList.add('is-expanded');
        if (stateText) {
          stateText.textContent = stateText.textContent.replace('EXPAND', 'COLLAPSE');
        }
      }
    });
  });

  // Initial trigger after DOM loads
  setTimeout(updateActiveServiceOnScroll, 100);

})();
