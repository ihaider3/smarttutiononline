/**
 * SMART TUITION ONLINE - INTERACTIVE LOGIC & MOTION ENGINE
 * Features: Typewriter, Scroll Reveal, WhatsApp Trial Booking, Tier Filter,
 * Grade Calculator, FAQ Accordion, Mobile Drawer, Educator Modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initHeroCarousel();
  initStickyHeader();
  initScrollSpy();
  initMobileDrawer();
  initTierFilter();
  initStatCounters();
  initGradeCalculator();
  initFeaturesCarousel();
  initReviewsCarousel();
  initFaqAccordion();
  initBookingForm();
  initEducatorModal();
  initScrollAnimations();
});

/* ==========================================================================
   1. DYNAMIC TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const targetElement = document.getElementById('typewriter-text');
  if (!targetElement) return;

  const phrases = [
    'Maths, English & Science',
    'Secondary Students',
    'Sixth Form Students',
    'Primary (KS1 & KS2)'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 95;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      targetElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      targetElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at end of phrase
      isDeleting = true;
      typingSpeed = 2800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   1B. HERO ROTATING STAGES CAROUSEL (Primary, Secondary, Sixth Form, 1:1)
   ========================================================================== */
function initHeroCarousel() {
  const frame = document.getElementById('heroCarouselFrame');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const progressFill = document.getElementById('carouselProgressFill');
  const badgeTitle = document.getElementById('badgeTopTitle');
  const badgeDesc = document.getElementById('badgeTopDesc');

  if (!frame || !slides.length) return;

  let currentIndex = 0;
  const slideCount = slides.length;
  const slideInterval = 4200; // 4.2 seconds per slide
  let timer = null;
  let isPaused = false;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update floating badge dynamically to match the current stage
    const targetSlide = slides[index];
    if (badgeTitle && targetSlide) {
      const newTitle = targetSlide.getAttribute('data-badge-title');
      const newDesc = targetSlide.getAttribute('data-badge-desc');
      if (newTitle) badgeTitle.textContent = newTitle;
      if (newDesc) badgeDesc.textContent = newDesc;
    }

    currentIndex = index;
    resetProgress();
  }

  function nextSlide() {
    const next = (currentIndex + 1) % slideCount;
    showSlide(next);
  }

  function resetProgress() {
    if (progressFill) {
      progressFill.style.transition = 'none';
      progressFill.style.width = '0%';
      void progressFill.offsetWidth; // Force reflow
      progressFill.style.transition = `width ${slideInterval}ms linear`;
      progressFill.style.width = '100%';
    }

    clearInterval(timer);
    timer = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, slideInterval);
  }

  // Click on dot navigation
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetIdx = parseInt(dot.getAttribute('data-slide'), 10);
      showSlide(targetIdx);
    });
  });

  // Pause on hover
  frame.addEventListener('mouseenter', () => {
    isPaused = true;
    if (progressFill) {
      const computedWidth = window.getComputedStyle(progressFill).width;
      progressFill.style.transition = 'none';
      progressFill.style.width = computedWidth;
    }
  });

  frame.addEventListener('mouseleave', () => {
    isPaused = false;
    resetProgress();
  });

  // Start progress and show first slide
  resetProgress();
}

/* ==========================================================================
   2. STICKY HEADER & SCROLL BEHAVIOR
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 35) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   2B. ACTIVE SCROLLSPY (Cached Offsets + RAF for Zero-Lag 60/120fps Scrolling)
   ========================================================================== */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-menu .nav-link, .drawer-links .drawer-link');
  const sectionIds = ['hero', 'levels', 'subjects', 'how-it-works', 'testimonials', 'faq'];
  const sections = sectionIds
    .map(id => ({ id, el: document.getElementById(id) }))
    .filter(item => item.el !== null);

  if (!sections.length || !navLinks.length) return;

  let cachedOffsets = [];
  function measure() {
    cachedOffsets = sections.map(sec => ({
      id: sec.id,
      top: sec.el.offsetTop,
      height: sec.el.offsetHeight
    }));
  }

  measure();
  window.addEventListener('resize', measure, { passive: true });

  let ticking = false;
  function updateSpy() {
    const scrollPos = window.scrollY + 160;
    let currentId = cachedOffsets.length ? cachedOffsets[0].id : 'hero';

    for (let i = 0; i < cachedOffsets.length; i++) {
      const sec = cachedOffsets[i];
      if (scrollPos >= sec.top && scrollPos < sec.top + sec.height) {
        currentId = sec.id;
        break;
      }
    }

    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 80) {
      currentId = 'faq';
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateSpy();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateSpy();
}

/* ==========================================================================
   3. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-actions a');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   4. AGE TIERS FILTER TABS (Primary, Secondary, Sixth Form)
   ========================================================================== */
function initTierFilter() {
  const tabButtons = document.querySelectorAll('.tier-tab-btn');
  const tierCards = document.querySelectorAll('.tier-card');
  const grid = document.querySelector('.tier-cards-grid');

  if (!tabButtons.length || !tierCards.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      if (grid) {
        if (filter === 'all') {
          grid.classList.remove('filtered-single');
        } else {
          grid.classList.add('filtered-single');
        }
      }

      tierCards.forEach(card => {
        const tierType = card.getAttribute('data-tier');
        if (filter === 'all' || filter === tierType) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            const isDesktopSecondary = (filter === 'all' && tierType === 'secondary' && window.innerWidth > 860);
            card.style.transform = isDesktopSecondary ? 'translateY(-5px)' : 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 220);
        }
      });
    });
  });
}

/* ==========================================================================
   4B. STATS RIBBON COUNT-UP ANIMATION
   ========================================================================== */
function initStatCounters() {
  const statElements = document.querySelectorAll('.stat-number[data-target]');
  if (!statElements.length || !('IntersectionObserver' in window)) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statElements.forEach(el => animateCounter(el));
        obs.disconnect();
      }
    });
  }, { threshold: 0.25 });

  statElements.forEach(el => observer.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const isDecimal = el.getAttribute('data-decimal') === '1';
    const duration = 2600;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = target * easeProgress;

      if (isDecimal) {
        el.textContent = currentValue.toFixed(1) + suffix;
      } else if (target >= 1000) {
        el.textContent = Math.floor(currentValue).toLocaleString() + suffix;
      } else {
        el.textContent = Math.floor(currentValue) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        if (isDecimal) {
          el.textContent = target.toFixed(1) + suffix;
        } else if (target >= 1000) {
          el.textContent = target.toLocaleString() + suffix;
        } else {
          el.textContent = target + suffix;
        }
      }
    }

    requestAnimationFrame(updateCounter);
  }
}

/* ==========================================================================
   5. INTERACTIVE GRADE IMPROVEMENT CALCULATOR
   ========================================================================== */
function initGradeCalculator() {
  const currentGradeSelect = document.getElementById('calcCurrentGrade');
  const targetGradeSelect = document.getElementById('calcTargetGrade');
  const jumpOutput = document.getElementById('calcJumpOutput');
  const detailsOutput = document.getElementById('calcDetailsOutput');

  if (!currentGradeSelect || !targetGradeSelect || !jumpOutput || !detailsOutput) return;

  function recalculate() {
    const current = parseInt(currentGradeSelect.value, 10);
    const target = parseInt(targetGradeSelect.value, 10);

    if (target <= current) {
      jumpOutput.textContent = '+0 Grades';
      detailsOutput.textContent = 'Please choose a target grade higher than your current grade to view your roadmap.';
      return;
    }

    const diff = target - current;
    jumpOutput.textContent = `+${diff} Grades Improvement`;

    let weeks = diff * 5;
    if (weeks < 8) weeks = 8;

    detailsOutput.innerHTML = `
      Estimated Timeline: <strong>${weeks} to ${weeks + 4} weeks</strong> of weekly 1:1 sessions.<br>
      Roadmap: Diagnostic assessment &rarr; Closing fundamental gaps &rarr; Weekly past paper clinics &rarr; Achieved Grade <strong>${target}</strong>!
    `;
  }

  currentGradeSelect.addEventListener('change', recalculate);
  targetGradeSelect.addEventListener('change', recalculate);
  recalculate();
}

/* ==========================================================================
   5A. WHY US / FEATURES MOBILE CAROUSEL ENGINE
   Active strictly on mobile (<= 768px). Bypassed seamlessly on desktop & tablet.
   Features: Auto-Slide, Arrow Buttons, Touch Swipe, Mouse Drag, Active Dots.
   ========================================================================== */
function initFeaturesCarousel() {
  const container = document.getElementById('featuresCarouselContainer');
  const viewport = document.getElementById('featuresViewport');
  const track = document.getElementById('featuresTrack');
  const prevBtn = document.getElementById('featuresPrevBtn');
  const nextBtn = document.getElementById('featuresNextBtn');
  const countEl = document.getElementById('featuresCurrentCount');
  const dotsContainer = document.getElementById('featuresDots');

  if (!container || !viewport || !track) return;

  const cards = track.querySelectorAll('.feature-card');
  const totalCards = cards.length;
  if (totalCards === 0) return;

  let currentIndex = 0;
  let autoSlideTimer = null;
  const autoSlideDelay = 4200; // 4.2s interval

  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Render pagination dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement('button');
      dot.className = `feature-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to feature ${i + 1}`);
      dot.dataset.index = i;
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel(instant = false) {
    if (!isMobile()) {
      track.style.transform = '';
      track.style.transition = '';
      return;
    }

    if (currentIndex >= totalCards) currentIndex = 0;
    if (currentIndex < 0) currentIndex = totalCards - 1;

    const firstCard = cards[0];
    const cardRect = firstCard.getBoundingClientRect();
    const cardWidth = cardRect.width;

    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.gap) || 16;

    const shiftAmount = currentIndex * (cardWidth + gap);

    if (instant) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
    }

    track.style.transform = `translateX(-${shiftAmount}px)`;

    if (countEl) {
      countEl.textContent = `Pillar ${currentIndex + 1} of ${totalCards}`;
    }

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.feature-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
  }

  function nextSlide() {
    if (!isMobile()) return;
    if (currentIndex >= totalCards - 1) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    updateCarousel();
  }

  function prevSlide() {
    if (!isMobile()) return;
    if (currentIndex <= 0) {
      currentIndex = totalCards - 1;
    } else {
      currentIndex--;
    }
    updateCarousel();
  }

  function goToSlide(index) {
    if (!isMobile()) return;
    currentIndex = Math.min(Math.max(0, index), totalCards - 1);
    updateCarousel();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  // Auto-Slide
  function startAutoSlide() {
    stopAutoSlide();
    if (!isMobile()) return;
    autoSlideTimer = setInterval(() => {
      nextSlide();
    }, autoSlideDelay);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  container.addEventListener('mouseenter', stopAutoSlide);
  container.addEventListener('mouseleave', startAutoSlide);

  // Touch Swipe Handling (Mobile)
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  viewport.addEventListener('touchstart', (e) => {
    if (!isMobile()) return;
    stopAutoSlide();
    if (!e.touches || !e.touches[0]) return;
    isSwiping = true;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (!isMobile() || !isSwiping || !e.changedTouches || !e.changedTouches[0]) return;
    isSwiping = false;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    const diffY = touchStartY - e.changedTouches[0].clientY;
    const threshold = 40;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoSlide();
  });

  // Mouse Drag Support
  let isMouseDown = false;
  let mouseStartX = 0;

  viewport.addEventListener('mousedown', (e) => {
    if (!isMobile()) return;
    stopAutoSlide();
    isMouseDown = true;
    mouseStartX = e.clientX;
    viewport.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;
    viewport.style.cursor = '';
    const diffX = mouseStartX - e.clientX;
    const threshold = 40;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoSlide();
  });

  // Window Resize
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCarousel(true);
      if (isMobile()) {
        startAutoSlide();
      } else {
        stopAutoSlide();
      }
    }, 100);
  });

  // Init
  updateCarousel(true);
  if (isMobile()) {
    startAutoSlide();
  }
}

/* ==========================================================================
   5B. REVIEWS & TESTIMONIALS CAROUSEL ENGINE
   Features: Auto-Slide, Navigation Arrows, Touch Swipe, Mouse Drag,
   Active Dots, Responsive 1-card mobile / 2-cards desktop.
   ========================================================================== */
function initReviewsCarousel() {
  const container = document.getElementById('reviewsCarouselContainer');
  const viewport = document.getElementById('reviewsCarouselViewport');
  const track = document.getElementById('reviewsCarouselTrack');
  const prevBtn = document.getElementById('reviewsPrevBtn');
  const nextBtn = document.getElementById('reviewsNextBtn');
  const countEl = document.getElementById('reviewsCurrentCount');
  const dotsContainer = document.getElementById('reviewsCarouselDots');

  if (!container || !viewport || !track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const totalCards = cards.length;
  if (totalCards === 0) return;

  let currentIndex = 0;
  let autoSlideTimer = null;
  const autoSlideDelay = 4500; // 4.5s automatic slide interval

  // Render pagination dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement('button');
      dot.className = `review-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.dataset.index = i;
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function getVisibleCards() {
    return window.innerWidth > 900 ? 2 : 1;
  }

  function getMaxIndex() {
    const visible = getVisibleCards();
    return Math.max(0, totalCards - visible);
  }

  function updateCarousel(instant = false) {
    const maxIdx = getMaxIndex();

    // Guard bounds
    if (currentIndex > maxIdx) {
      currentIndex = maxIdx;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    }

    // Measure card width + gap dynamically
    const firstCard = cards[0];
    const cardRect = firstCard.getBoundingClientRect();
    const cardWidth = cardRect.width;

    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.gap) || 24;

    const shiftAmount = currentIndex * (cardWidth + gap);

    if (instant) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
    }

    track.style.transform = `translateX(-${shiftAmount}px)`;

    // Update Counter Text
    if (countEl) {
      const activeNumber = currentIndex + 1;
      countEl.textContent = `Review ${activeNumber} of ${totalCards}`;
    }

    // Update Dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.review-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
  }

  function nextSlide() {
    const maxIdx = getMaxIndex();
    if (currentIndex >= maxIdx) {
      currentIndex = 0; // Seamless loop back to first review
    } else {
      currentIndex++;
    }
    updateCarousel();
  }

  function prevSlide() {
    const maxIdx = getMaxIndex();
    if (currentIndex <= 0) {
      currentIndex = maxIdx; // Wrap to end
    } else {
      currentIndex--;
    }
    updateCarousel();
  }

  function goToSlide(index) {
    const maxIdx = getMaxIndex();
    currentIndex = Math.min(Math.max(0, index), maxIdx);
    updateCarousel();
  }

  // Arrow button clicks
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  // Auto-Slide Engine
  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      nextSlide();
    }, autoSlideDelay);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Pause on hover
  container.addEventListener('mouseenter', stopAutoSlide);
  container.addEventListener('mouseleave', startAutoSlide);

  // ==========================================
  // Touch & Swipe System (Mobile & Touchscreens)
  // ==========================================
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  viewport.addEventListener('touchstart', (e) => {
    stopAutoSlide();
    if (!e.touches || !e.touches[0]) return;
    isSwiping = true;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (!isSwiping || !e.changedTouches || !e.changedTouches[0]) return;
    isSwiping = false;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    const diffY = touchStartY - e.changedTouches[0].clientY;
    const threshold = 40;

    // Only swipe if horizontal movement is dominant
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoSlide();
  });

  // Mouse Drag Support (Desktop)
  let isMouseDown = false;
  let mouseStartX = 0;

  viewport.addEventListener('mousedown', (e) => {
    stopAutoSlide();
    isMouseDown = true;
    mouseStartX = e.clientX;
    viewport.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;
    viewport.style.cursor = 'grab';
    const diffX = mouseStartX - e.clientX;
    const threshold = 40;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoSlide();
  });

  // Responsive window resize
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCarousel(true);
    }, 100);
  });

  // Initial render & start auto-timer
  updateCarousel(true);
  startAutoSlide();
}

/* ==========================================================================
   6. FAQ ACCORDION WITH SMOOTH ANIMATION
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;

  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for clean UX
      items.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. BOOK YOUR FREE TRIAL SESSION (WhatsApp deep link + Form Handling)
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('trialBookingForm');
  if (!form) return;

  const yearLabels = {
    'year-1-2': 'Year 1-2 (Key Stage 1)',
    'year-3-4': 'Year 3-4 (Lower Key Stage 2)',
    'year-5-6': 'Year 5-6 (SATs Prep)',
    'year-7-8': 'Year 7-8 (Key Stage 3)',
    'year-9': 'Year 9 (Foundation GCSE)',
    'year-10-11': 'Year 10-11 (GCSE Preparation)',
    'year-12-13': 'Year 12-13 (A-Level Support)'
  };

  const subjectLabels = {
    'maths': 'Mathematics',
    'english': 'English',
    'science': 'Science',
    'maths-english': 'Maths & English',
    'all': 'All Three Subjects (Maths, English, Science)'
  };

  // Official UK WhatsApp Number extracted from smarttuition.online
  const UK_WHATSAPP_NUMBER = '447835213221';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const parentName = form.elements['parentName'].value.trim();
    const email = form.elements['email'].value.trim();
    const phone = form.elements['phone'].value.trim();
    const childName = form.elements['childName'].value.trim();
    const childAge = form.elements['childAge'].value;
    const subject = form.elements['subject'].value;
    const notes = form.elements['notes'] ? form.elements['notes'].value.trim() : '';

    if (!parentName || !phone || !childName || !childAge || !subject) {
      showToast('⚠️ Please fill in all required fields.');
      return;
    }

    const yearText = yearLabels[childAge] || childAge;
    const subjectText = subjectLabels[subject] || subject;

    // Build the formatted WhatsApp message matching official Smart Tuition syntax
    const messageLines = [
      'Hello, I would like to book a free trial session.',
      '',
      `Name: ${parentName}`,
      `Email: ${email || 'Not provided'}`,
      `Phone: ${phone}`,
      `Child's name: ${childName}`,
      `Child's year: ${yearText}`,
      `Subject: ${subjectText}`
    ];

    if (notes) {
      messageLines.push(`Additional Notes: ${notes}`);
    }

    const fullMessage = messageLines.join('\n');
    const waUrl = `https://wa.me/${UK_WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`;

    // Open WhatsApp in a new tab
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    showToast('✨ WhatsApp opened! Tap "Send" in WhatsApp to deliver your trial booking.');
    form.reset();
  });
}

/* ==========================================================================
   8. EDUCATOR APPLICATION MODAL (/apply)
   ========================================================================== */
function initEducatorModal() {
  const openButtons = document.querySelectorAll('.open-educator-modal');
  const modal = document.getElementById('educatorModal');
  const closeBtn = document.getElementById('educatorModalClose');
  const form = document.getElementById('educatorApplicationForm');

  if (!modal) return;

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = form.elements['fullName'].value.trim();
      const subject = form.elements['subject'].value;
      const email = form.elements['email'].value.trim();

      if (!fullName || !subject || !email) {
        showToast('⚠️ Please provide your full name, subject, and email.');
        return;
      }

      showToast('🎓 Application submitted successfully! Our recruitment team will review your profile.');
      form.reset();
      setTimeout(closeModal, 1200);
    });
  }
}

/* ==========================================================================
   9. SCROLL REVEAL ANIMATIONS (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   10. TOAST NOTIFICATION HELPER
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
