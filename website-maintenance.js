// ============================================================
// Website Maintenance Page — page-specific interactivity
// script.js (shared) already handles nav toggle, header scroll,
// and the generic .reveal scroll system. This file only adds the
// two custom interactions unique to this page: the hero health-
// panel scan, and the Fix/Update/Improve tab switcher.
// ============================================================

const wmPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Hero health-panel scan ----------
// Checks each row in on a staggered delay so the panel reads like a
// live diagnostic running, rather than static text. Runs once, when
// the panel first enters view.
const wmPanel = document.querySelector('.wm-panel');

if (wmPanel) {
  const rows = wmPanel.querySelectorAll('.wm-dot');

  const runScan = () => {
    if (wmPrefersReducedMotion) {
      rows.forEach((row) => row.classList.add('is-checked'));
      return;
    }
    rows.forEach((row) => {
      const delay = Number(row.getAttribute('data-delay')) || 0;
      setTimeout(() => row.classList.add('is-checked'), delay * 220);
    });
  };

  if ('IntersectionObserver' in window) {
    const panelObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runScan();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    panelObserver.observe(wmPanel);
  } else {
    runScan();
  }
}

// ---------- Fix / Update / Improve tabs ----------
// Simple tab pattern: one active tab, one visible panel, matched by
// data-mode / data-mode-panel. No frameworks needed for three states.
const wmTabs = document.querySelectorAll('.wm-modes__tab');
const wmPanels = document.querySelectorAll('[data-mode-panel]');

wmTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const mode = tab.getAttribute('data-mode');

    wmTabs.forEach((t) => {
      t.classList.toggle('is-active', t === tab);
      t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
    });

    wmPanels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.getAttribute('data-mode-panel') === mode);
    });
  });
});
