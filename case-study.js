/**
 * WEBSIDEUP — CASE STUDY ENGINE
 * Dynamic hydration from projects-data.js based on ?id=slug or /work/slug
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function hide(sec) { if (sec) sec.setAttribute('hidden', ''); }
  function show(sec) { if (sec) sec.removeAttribute('hidden'); }

  // 1. Get Project ID from URL query param or path
  const params = new URLSearchParams(window.location.search);
  let id = params.get('id') || '';

  if (!id) {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0 && pathParts[pathParts.length - 2] === 'work') {
      id = pathParts[pathParts.length - 1];
    } else if (pathParts.length > 0 && pathParts[0] === 'work') {
      id = pathParts[1];
    }
  }

  // Fallback to first project in PROJECT_ORDER
  if (!id || typeof PROJECTS === 'undefined' || !PROJECTS[id]) {
    id = (typeof PROJECT_ORDER !== 'undefined' && PROJECT_ORDER[0]) ? PROJECT_ORDER[0] : 'social';
  }

  const p = PROJECTS[id];
  if (!p) {
    document.title = 'Work — WebsideUp';
    return;
  }

  // 2. SEO Meta
  document.title = `${p.title} — WebsideUp Case Study`;
  const metaDesc = el('pageDesc');
  if (metaDesc) metaDesc.content = p.overview || 'WebsideUp case study.';

  // 3. Hero
  const catEl = el('csCategory');
  if (catEl) catEl.textContent = p.category || '';

  const line1 = el('csTitleLine1');
  const line2 = el('csTitleLine2');
  if (line1) line1.textContent = p.titleLine1 || p.title || '';
  if (line2) line2.textContent = p.titleLine2 || '';

  // Meta: Services
  const servicesEl = el('metaServices');
  const servicesWrapper = el('metaServicesWrapper');
  if (p.services && p.services.length > 0) {
    const serviceText = Array.isArray(p.services) ? p.services.join(', ') : p.services;
    if (servicesEl) servicesEl.textContent = serviceText;
  } else {
    hide(servicesWrapper);
  }

  // 4. Hero Media (Video or Image)
  const heroMedia = el('csHeroMedia');
  const heroImg = el('csHeroImg');
  if (p.heroMedia && heroMedia && heroImg) {
    if (p.heroMedia.type === 'video' && p.heroMedia.src) {
      const video = document.createElement('video');
      video.src = p.heroMedia.src;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.className = 'cs-hero-img';
      if (p.poster) video.poster = p.poster;
      
      video.onerror = function () {
        const fallbackImg = document.createElement('img');
        fallbackImg.src = p.poster || p.heroMedia.src;
        fallbackImg.alt = `${p.title} — WebsideUp`;
        fallbackImg.className = 'cs-hero-img';
        if (video.parentNode) {
          video.parentNode.replaceChild(fallbackImg, video);
        }
      };

      heroImg.parentNode.replaceChild(video, heroImg);
    } else if (p.heroMedia.src) {
      heroImg.src = p.heroMedia.src;
      heroImg.alt = `${p.title} — WebsideUp`;
    } else {
      heroMedia.style.display = 'none';
    }
  } else if (heroMedia) {
    heroMedia.style.display = 'none';
  }

  // 5. Editorial Text Sections
  function populateSection(text, textId, sectionId) {
    const sec = el(sectionId);
    const textEl = el(textId);
    if (text && text.trim()) {
      if (textEl) textEl.textContent = text;
      show(sec);
    } else {
      hide(sec);
    }
  }

  populateSection(p.overview, 'csOverviewText', 'sectionOverview');
  populateSection(p.challenge, 'csChallengeText', 'sectionChallenge');
  populateSection(p.approach, 'csApproachText', 'sectionApproach');

  // 6. Gallery
  const gallery = el('csGallery');
  const gallerySection = el('sectionWork');
  if (p.gallery && p.gallery.length > 0 && gallery) {
    p.gallery.forEach(function (media) {
      const item = document.createElement('div');
      item.className = 'cs-gallery-item layout-' + (media.layout || 'full') + ' reveal';

      if (media.type === 'video' && media.src) {
        const video = document.createElement('video');
        video.src = media.src;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.loading = 'lazy';
        item.appendChild(video);
      } else if (media.src) {
        const img = document.createElement('img');
        img.src = media.src;
        img.alt = 'Project creative asset';
        img.loading = 'lazy';
        item.appendChild(img);
      }
      gallery.appendChild(item);
    });
    show(gallerySection);
  } else {
    hide(gallerySection);
  }

  // 7. Results
  const resultsGrid = el('csResultsGrid');
  const resultsSection = el('sectionResults');
  if (p.results && Object.keys(p.results).length > 0 && resultsGrid) {
    Object.entries(p.results).forEach(function (entry) {
      const label = entry[0];
      const value = entry[1];
      const item = document.createElement('div');
      item.className = 'result-item reveal';
      item.innerHTML =
        '<span class="result-value">' + value + '</span>' +
        '<span class="result-label">' + label + '</span>';
      resultsGrid.appendChild(item);
    });
    show(resultsSection);
  } else {
    hide(resultsSection);
  }

  // 8. Next Project Loop
  const nextLink = el('csNextLink');
  const nextTitle = el('csNextTitle');
  const nextSection = el('sectionNextProject');
  if (p.nextProject && PROJECTS[p.nextProject]) {
    const next = PROJECTS[p.nextProject];
    if (nextTitle) nextTitle.textContent = next.title || (`${next.titleLine1} ${next.titleLine2}`);
    if (nextLink) nextLink.href = `case-study.html?id=${next.id}`;
    show(nextSection);
  } else {
    hide(nextSection);
  }

})();
