// Footer year — keeps the copyright current without editing HTML every January.
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

// Close the mobile menu after tapping a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  });
});

// Sticky header: add a border/shadow once the page has scrolled.
// Throttled via requestAnimationFrame so the class toggle runs at most
// once per rendered frame, not on every single 'scroll' event (which can
// fire far more often than the screen actually repaints, especially on
// lower-end phones).
const header = document.querySelector('header');
let scrollTicking = false;

function updateHeaderScrollState() {
  header.classList.toggle('scrolled', window.scrollY > 8);
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(updateHeaderScrollState);
    scrollTicking = true;
  }
});

updateHeaderScrollState();

// Portfolio stack (mobile only — desktop shows the full grid, untouched).
// Cards sit absolutely stacked on top of each other; swiping the front
// card left/right advances or rewinds through the stack. Desktop grid
// isn't absolutely positioned, so this only visually does anything below
// the 720px breakpoint (checked before any drag is applied).
const portfolioGrid = document.querySelector('.portfolio-preview__grid');
const portfolioCards = portfolioGrid ? Array.from(portfolioGrid.querySelectorAll('.portfolio-card')) : [];
const portfolioDots = document.querySelectorAll('.portfolio-preview__dot');

if (portfolioGrid && portfolioCards.length) {
  let currentIndex = 0;
  const isMobileStack = () => window.matchMedia('(max-width: 720px)').matches;

  function applyStack() {
    portfolioCards.forEach((card, i) => {
      const rel = (i - currentIndex + portfolioCards.length) % portfolioCards.length;
      card.dataset.stackPos = rel <= 2 ? String(rel) : 'hidden';
    });
    portfolioDots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  }

  applyStack();

  // Tapping a dot jumps straight to that project
  portfolioDots.forEach(dot => {
    dot.addEventListener('click', () => {
      currentIndex = Number(dot.dataset.index) || 0;
      applyStack();
    });
  });

  // Swipe handling — only does anything on the front card, only in the
  // mobile stack layout (matched by CSS below 720px).
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let lockedHorizontal = false;
  let movedEnough = false;

  const SWIPE_THRESHOLD = 70;
  const CLICK_CANCEL_THRESHOLD = 10;

  portfolioCards.forEach(card => {
    card.addEventListener('pointerdown', (e) => {
      if (!isMobileStack() || card.dataset.stackPos !== '0') return;
      dragging = true;
      lockedHorizontal = false;
      movedEnough = false;
      startX = e.clientX;
      startY = e.clientY;
      deltaX = 0;
      card.classList.add('dragging');
    });

    card.addEventListener('pointermove', (e) => {
      if (!dragging || card.dataset.stackPos !== '0') return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!lockedHorizontal) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        lockedHorizontal = Math.abs(dx) > Math.abs(dy);
        if (!lockedHorizontal) { dragging = false; card.classList.remove('dragging'); return; }
      }

      deltaX = dx;
      if (Math.abs(deltaX) > CLICK_CANCEL_THRESHOLD) movedEnough = true;
      card.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 20}deg)`;
      card.style.opacity = String(1 - Math.min(Math.abs(deltaX) / 300, 0.5));
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      card.classList.remove('dragging');

      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        const direction = deltaX < 0 ? -1 : 1;
        card.style.transform = `translateX(${direction * 500}px) rotate(${direction * 20}deg)`;
        card.style.opacity = '0';

        setTimeout(() => {
          card.style.transform = '';
          card.style.opacity = '';
          currentIndex = direction < 0
            ? (currentIndex + 1) % portfolioCards.length
            : (currentIndex - 1 + portfolioCards.length) % portfolioCards.length;
          applyStack();
        }, 300);
      } else {
        card.style.transform = '';
        card.style.opacity = '';
      }

      deltaX = 0;
    }

    card.addEventListener('pointerup', endDrag);
    card.addEventListener('pointercancel', endDrag);

    // A drag that actually moved shouldn't also fire the card's link
    card.addEventListener('click', (e) => {
      if (movedEnough) {
        e.preventDefault();
        movedEnough = false;
      }
    });
  });
}
// Scroll reveal — fades/slides elements in as they enter the viewport.
// Generic and reusable: works on any element with the .reveal class,
// wherever it appears. One-time reveal per element (stops observing once
// visible) rather than re-triggering on every scroll pass, since a
// distracting repeat-on-every-scroll effect isn't the goal here.
// Respects prefers-reduced-motion — if the user has that set, everything
// just shows immediately with no animation.
const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (revealEls.length) {
  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // No IntersectionObserver support — just show everything, no animation
    revealEls.forEach(el => el.classList.add('is-visible'));
  }
}
// Website Design page: "What Can We Design" story-style auto-play cards
const wdStory = document.getElementById('wdStory');

if (wdStory) {
  const stage = document.getElementById('wdStoryStage');
  const cards = Array.from(stage.querySelectorAll('.wd-story__card'));
  const segs = Array.from(document.getElementById('wdStoryProgress').children);
  const prevBtn = document.getElementById('wdStoryPrev');
  const nextBtn = document.getElementById('wdStoryNext');
  const DURATION = 4000;
  let index = 0;
  let paused = false;
  let timer = null;

  wdStory.style.setProperty('--story-duration', DURATION + 'ms');

  function renderSegs() {
    segs.forEach((seg, i) => {
      seg.classList.remove('filled', 'playing', 'paused');
      if (i < index) seg.classList.add('filled');
      if (i === index) seg.classList.add('playing');
    });
  }

  function goTo(newIndex, direction) {
    const current = cards[index];
    current.classList.remove('active');
    current.classList.add(direction === 'next' ? 'exit-left' : 'exit-right');

    index = (newIndex + cards.length) % cards.length;
    const next = cards[index];
    next.classList.remove('exit-left', 'exit-right');
    // force reflow so the transform-from-90deg transition actually plays
    void next.offsetWidth;
    next.classList.add('active');

    setTimeout(() => current.classList.remove('exit-left', 'exit-right'), 550);
    renderSegs();
    restartTimer();
  }

  function next() { goTo(index + 1, 'next'); }
  function prev() { goTo(index - 1, 'prev'); }

  function restartTimer() {
    clearTimeout(timer);
    if (paused) return;
    timer = setTimeout(next, DURATION);
  }

  function setPaused(state) {
    paused = state;
    segs[index].classList.toggle('paused', state);
    if (state) clearTimeout(timer);
    else restartTimer();
  }

  renderSegs();
  restartTimer();

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // Hold to pause (like WhatsApp/IG stories)
  wdStory.addEventListener('pointerdown', () => setPaused(true));
  wdStory.addEventListener('pointerup', () => setPaused(false));
  wdStory.addEventListener('pointerleave', () => setPaused(false));
  wdStory.addEventListener('pointercancel', () => setPaused(false));

  // Swipe left/right to navigate manually
  let startX = 0;
  let swiped = false;

  wdStory.addEventListener('pointerdown', (e) => { startX = e.clientX; swiped = false; });
  wdStory.addEventListener('pointermove', (e) => {
    if (swiped) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) {
      swiped = true;
      dx < 0 ? next() : prev();
    }
  });
}
// Website Design page: device switcher (phone/tablet/desktop mockup)
const wdMobileFrame = document.getElementById('wdMobileFrame');
const wdMobileTabs = document.querySelectorAll('.wd-mobile__tab');

if (wdMobileFrame && wdMobileTabs.length) {
  wdMobileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      wdMobileTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      wdMobileFrame.dataset.device = tab.dataset.device;
    });
  });
}
let resizeReflowTimer = null;
let lastWidth = window.innerWidth;

window.addEventListener('resize', () => {
  // Only react to real width changes (rotation, desktop-mode toggle) —
  // ignore height-only changes from the mobile URL bar or keyboard,
  // which fire 'resize' too but shouldn't trigger this workaround.
  if (window.innerWidth === lastWidth) return;
  lastWidth = window.innerWidth;

  clearTimeout(resizeReflowTimer);
  resizeReflowTimer = setTimeout(() => {
    header.style.transform = 'translateZ(0)';
    void header.offsetHeight; // force reflow, header only
    header.style.transform = '';
  }, 50);
});
// Website Design page: closing statement word cycle
const wdClosingStack = document.getElementById('wdClosingStack');

if (wdClosingStack) {
  const words = Array.from(wdClosingStack.querySelectorAll('.wd-closing__word'));
  let wIndex = 0;

  setInterval(() => {
    words[wIndex].classList.remove('active');
    wIndex = (wIndex + 1) % words.length;
    words[wIndex].classList.add('active');
  }, 2200);
}