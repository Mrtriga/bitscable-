(function () {
  const crawler = document.getElementById('seo-crawler-body');
  if (!crawler) return;

  const lines = Array.from(crawler.querySelectorAll('.seo-crawler-line'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function runCrawl() {
    if (prefersReducedMotion) {
      lines.forEach(line => line.classList.add('is-active'));
      return;
    }
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add('is-active'), i * 180);
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCrawl();
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(crawler);
  } else {
    runCrawl();
  }
})();

(function () {
  const panel = document.getElementById('seo-view-panel');
  const humanBtn = document.getElementById('seo-view-btn-human');
  const searchBtn = document.getElementById('seo-view-btn-search');
  const humanLayer = document.getElementById('seo-view-human');
  const searchLayer = document.getElementById('seo-view-search');
  if (!panel || !humanBtn || !searchBtn) return;

  function setMode(mode) {
    panel.dataset.mode = mode;
    const isHuman = mode === 'human';
    humanLayer.classList.toggle('is-shown', isHuman);
    searchLayer.classList.toggle('is-shown', !isHuman);
    humanBtn.classList.toggle('is-active', isHuman);
    searchBtn.classList.toggle('is-active', !isHuman);
    humanBtn.setAttribute('aria-selected', String(isHuman));
    searchBtn.setAttribute('aria-selected', String(!isHuman));
  }

  humanBtn.addEventListener('click', () => setMode('human'));
  searchBtn.addEventListener('click', () => setMode('search'));
  setMode('human');
})();
(function () {
  const flow = document.getElementById('seo-anatomy-flow');
  if (!flow) return;

  const steps = Array.from(flow.querySelectorAll('.seo-anatomy-step'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let intervalId = null;

  function highlightNext() {
    steps.forEach(step => step.classList.remove('is-current'));
    steps[index].classList.add('is-current');
    index = (index + 1) % steps.length;
  }

  function startSequence() {
    if (prefersReducedMotion) {
      steps.forEach(step => step.classList.add('is-current'));
      return;
    }
    highlightNext();
    intervalId = setInterval(highlightNext, 900);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startSequence();
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(flow);
  } else {
    startSequence();
  }
})();
(function () {
  const dash = document.getElementById('seo-dash-body');
  if (!dash) return;

  const lines = Array.from(dash.querySelectorAll('.seo-dash-line'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function runReveal() {
    if (prefersReducedMotion) {
      lines.forEach(line => line.classList.add('is-active'));
      return;
    }
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add('is-active'), i * 130);
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runReveal();
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(dash);
  } else {
    runReveal();
  }
})();
(function () {
  const list = document.getElementById('seo-faq-list');
  if (!list) return;

  const items = Array.from(list.querySelectorAll('.seo-faq-item'));

  items.forEach(item => {
    const question = item.querySelector('.seo-faq-question');
    const answer = item.querySelector('.seo-faq-answer');

    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';

      items.forEach(other => {
        other.querySelector('.seo-faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.seo-faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();