(function () {
  var el = document.getElementById('aiFlowExample');
  if (!el) return;

  var examples = [
    ['Customer question', 'AI response'],
    ['Website enquiry', 'AI qualification'],
    ['Document', 'AI summary'],
    ['Customer request', 'Recommended action']
  ];

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return; // leave the first example static

  var i = 0;
  setInterval(function () {
    i = (i + 1) % examples.length;
    el.style.opacity = 0;
    setTimeout(function () {
      el.innerHTML = examples[i][0] + ' <span>→</span> ' + examples[i][1];
      el.style.opacity = 1;
    }, 400);
  }, 3200);
})();
// Business-area tab selector
var areaData = {
  sales: 'Lead qualification, enquiry handling and sales assistance.',
  service: 'FAQs, response assistance and information retrieval.',
  marketing: 'Content ideas, drafting and campaign assistance.',
  operations: 'Summaries, document processing and repetitive workflows.',
  management: 'Information organization, reporting assistance and decision support.'
};
var areaTabs = document.querySelectorAll('.ai-areas__tab');
var areaPanel = document.getElementById('aiAreasPanel');

areaTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    areaTabs.forEach(function (t) {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    areaPanel.style.opacity = 0;
    setTimeout(function () {
      areaPanel.textContent = areaData[tab.dataset.area];
      areaPanel.style.opacity = 1;
    }, 150);
  });
});

// FAQ accordion
var faqButtons = document.querySelectorAll('.ai-faq__q');
faqButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') === 'true';
    var answer = btn.nextElementSibling;
    faqButtons.forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.style.maxHeight = null;
    });
    if (!open) {
      btn.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});