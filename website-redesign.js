// WEBSITE REDESIGN PAGE — scoped behavior
// Reason: hero diagnostic scan (desktop hover / mobile auto-cycle)
// and timeline active-stage tracking, both respecting reduced motion.

(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- HERO: diagnostic scan ----------
  var body = document.getElementById('wr-browser-body');
  var tag = document.getElementById('wr-flaw-tag');
  var scanLine = document.getElementById('wr-scan-line');

  if (body && tag && scanLine) {
    var hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (hasFinePointer && !reduceMotion) {
      var zones = Array.prototype.slice.call(body.querySelectorAll('.wr-flaw-zone'));

      zones.forEach(function (zone) {
        zone.addEventListener('mouseenter', function () {
          var rect = zone.getBoundingClientRect();
          var parentRect = body.getBoundingClientRect();
          tag.textContent = zone.dataset.flaw;
          tag.style.left = (rect.left - parentRect.left) + 'px';
          tag.style.top = (rect.top - parentRect.top - 26) + 'px';
          tag.classList.add('is-visible');
        });
        zone.addEventListener('mouseleave', function () {
          tag.classList.remove('is-visible');
        });
      });

      body.addEventListener('mousemove', function (e) {
        var rect = body.getBoundingClientRect();
        scanLine.style.left = (e.clientX - rect.left) + 'px';
        scanLine.classList.add('is-active');
      });
      body.addEventListener('mouseleave', function () {
        scanLine.classList.remove('is-active');
      });
    } else {
      // touch / reduced-motion fallback: auto-cycle labels once visible
      var zonesTouch = Array.prototype.slice.call(body.querySelectorAll('.wr-flaw-zone'));
      var idx = 0;
      var cycling = false;

      function showNext() {
        var zone = zonesTouch[idx % zonesTouch.length];
        var rect = zone.getBoundingClientRect();
        var parentRect = body.getBoundingClientRect();
        tag.textContent = zone.dataset.flaw;
        tag.style.left = (rect.left - parentRect.left) + 'px';
        tag.style.top = (rect.top - parentRect.top - 26) + 'px';
        tag.classList.add('is-visible');
        idx++;
        if (!reduceMotion) setTimeout(function () { tag.classList.remove('is-visible'); }, 1200);
      }

      var heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !cycling) {
            cycling = true;
            showNext();
            if (!reduceMotion) {
              setInterval(showNext, 1800);
            }
          }
        });
      }, { threshold: 0.4 });
      heroObserver.observe(body);
    }
  }

  // ---------- TIMELINE: active stage on scroll ----------
  var stages = document.querySelectorAll('.wr-stage');
  if (stages.length) {
    var stageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
        } else if (entry.boundingClientRect.top > 0) {
          // only fade back out if it scrolled below viewport (re-entering from top),
          // keeps stages you've already passed looking "done" rather than flickering
          entry.target.classList.remove('is-active');
        }
      });
    }, { threshold: 0.55 });
    stages.forEach(function (s) { stageObserver.observe(s); });
  }
  // ---------- SECTION 3: WE MOVE THINGS (FLIP reorder) ----------
var moveBoard = document.getElementById('wr-move-board');
if (moveBoard) {
  var moveBlocks = Array.prototype.slice.call(moveBoard.querySelectorAll('.wr-move-block'));
  var moved = false;

  function addTag(block, label) {
    var tag = document.createElement('span');
    tag.className = 'wr-move-tag';
    tag.textContent = label;
    block.appendChild(tag);
    requestAnimationFrame(function () { tag.classList.add('is-visible'); });
    setTimeout(function () { tag.classList.remove('is-visible'); }, 1400);
  }

  var moveObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !moved) {
        moved = true;

        // FLIP: record First position of each block
        var first = {};
        moveBlocks.forEach(function (b) { first[b.dataset.old] = b.getBoundingClientRect().top; });

        // Last: reorder by data-new
        moveBlocks
          .slice()
          .sort(function (a, b) { return a.dataset.new - b.dataset.new; })
          .forEach(function (b) { moveBoard.appendChild(b); });

        if (!reduceMotion) {
          moveBlocks.forEach(function (b) {
            var last = b.getBoundingClientRect().top;
            var delta = first[b.dataset.old] - last;
            if (Math.abs(delta) > 1) {
              b.style.transition = 'none';
              b.style.transform = 'translateY(' + delta + 'px)';
              requestAnimationFrame(function () {
                b.style.transition = 'transform 0.5s ease';
                b.style.transform = '';
              });
            }
          });

          setTimeout(function () {
            addTag(document.getElementById('wr-move-testimonial'), 'MOVE');
            addTag(document.getElementById('wr-move-image'), 'MOVE');
          }, 500);
        }

        var textBlock = document.getElementById('wr-move-text');
        if (textBlock) {
          setTimeout(function () {
            textBlock.textContent = 'TRUST';
            addTag(textBlock, 'REBUILD');
          }, reduceMotion ? 0 : 600);
        }
      }
    });
  }, { threshold: 0.5 });
  moveObserver.observe(moveBoard);
}
// ---------- SECTION 4: KEEP / CHANGE / REMOVE / ADD ----------
var kcraWords = document.querySelectorAll('.wr-kcra-word');
var kcraDetail = document.getElementById('wr-kcra-detail');
var kcraCopy = {
  keep: 'Existing branding, valuable content, useful functionality.',
  change: 'Navigation, layout, typography, CTA placement.',
  remove: 'Redundant sections, outdated content, unnecessary complexity.',
  add: 'Missing sections, case studies, trust signals, conversion elements.'
};

function setKcraWord(word) {
  kcraWords.forEach(function (w) { w.classList.toggle('is-active', w.dataset.word === word); });
  kcraDetail.style.opacity = '0';
  setTimeout(function () {
    kcraDetail.textContent = kcraCopy[word];
    kcraDetail.style.opacity = '1';
  }, 150);
}

kcraWords.forEach(function (w) {
  w.addEventListener('click', function () { setKcraWord(w.dataset.word); });
  w.addEventListener('mouseenter', function () {
    if (window.matchMedia('(pointer: fine)').matches) setKcraWord(w.dataset.word);
  });
});

// ---------- SECTION 5: BEFORE / AFTER DRAG ----------
var baViewport = document.getElementById('wr-ba-viewport');
var baHandle = document.getElementById('wr-ba-handle');
var baNew = document.getElementById('wr-ba-new');

if (baViewport && baHandle && baNew) {
  var baDragging = false;

  function setBaPercent(clientX) {
    var rect = baViewport.getBoundingClientRect();
    var pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    baHandle.style.left = pct + '%';
    baNew.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
  }

  baHandle.addEventListener('pointerdown', function (e) {
    baDragging = true;
    baHandle.setPointerCapture(e.pointerId);
  });
  baHandle.addEventListener('pointermove', function (e) {
    if (baDragging) setBaPercent(e.clientX);
  });
  baHandle.addEventListener('pointerup', function () { baDragging = false; });
  baHandle.addEventListener('pointercancel', function () { baDragging = false; });
}
// ---------- SECTION 6: JOURNEY SCROLL PROGRESS ----------
var journeyTrack = document.getElementById('wr-journey-track');
var journeyDot = document.getElementById('wr-journey-dot');
var journeyStages = document.querySelectorAll('.wr-journey-stage');

if (journeyTrack && journeyDot && journeyStages.length) {
  var journeyTicking = false;

  function updateJourney() {
    var rect = journeyTrack.getBoundingClientRect();
    var vh = window.innerHeight;
    var progress = (vh * 0.6 - rect.top) / rect.height;
    progress = Math.max(0, Math.min(1, progress));
    journeyDot.style.top = (progress * 100) + '%';

    var activeIndex = Math.min(journeyStages.length - 1, Math.floor(progress * journeyStages.length));
    journeyStages.forEach(function (s, i) { s.classList.toggle('is-active', i === activeIndex); });
    journeyTicking = false;
  }

  window.addEventListener('scroll', function () {
    if (!journeyTicking) { requestAnimationFrame(updateJourney); journeyTicking = true; }
  });
  updateJourney();
}
// ---------- SECTION 8: DIAGNOSTIC CONSOLE ----------
var diagLines = document.querySelectorAll('.wr-diag-line');
if (diagLines.length) {
  var diagObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        diagLines.forEach(function (line, i) {
          setTimeout(function () { line.classList.add('is-visible'); }, reduceMotion ? 0 : i * 220);
        });
        diagObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  diagObserver.observe(document.getElementById('wr-diag-body'));
}

// ---------- SECTION 9: TYPOGRAPHY MORPH ----------
var morphTrack = document.getElementById('wr-morph-track');
var morphOld = document.getElementById('wr-morph-old');
var morphNew = document.getElementById('wr-morph-new');

if (morphTrack && morphOld && morphNew && !reduceMotion) {
  var morphTicking = false;

  function lerpColor(hexA, hexB, t) {
    var a = [parseInt(hexA.slice(1,3),16), parseInt(hexA.slice(3,5),16), parseInt(hexA.slice(5,7),16)];
    var b = [parseInt(hexB.slice(1,3),16), parseInt(hexB.slice(3,5),16), parseInt(hexB.slice(5,7),16)];
    var c = a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); });
    return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
  }

  function updateMorph() {
    var rect = morphTrack.getBoundingClientRect();
    var vh = window.innerHeight;
    var progress = (-rect.top) / (rect.height - vh);
    progress = Math.max(0, Math.min(1, progress));

    morphOld.style.opacity = String(1 - progress);
    morphOld.style.transform = 'translateY(' + (-progress * 20) + 'px)';
    morphNew.style.opacity = String(progress);
    morphNew.style.transform = 'translateY(' + ((1 - progress) * 20) + 'px)';

    morphTrack.closest('.wr-morph').style.setProperty(
      '--wr-morph-bg',
      lerpColor('#FAFAFA', '#16210D', progress)
    );

    morphTicking = false;
  }

  window.addEventListener('scroll', function () {
    if (!morphTicking) { requestAnimationFrame(updateMorph); morphTicking = true; }
  });
  updateMorph();
}
// ---------- SECTION 10: INDUSTRIES ----------
var industryButtons = document.querySelectorAll('.wr-industry');
var industryPreviewText = document.getElementById('wr-industry-preview-text');
var industryCopy = {
  restaurant: 'Menu built to browse, not scroll through — with a clear path to order or book a table.',
  ecommerce: 'Product pages designed to answer questions before checkout, not after.',
  realestate: 'Listings that let people filter and explore properties, not just view a gallery.',
  construction: 'A project showcase that proves capability through real completed work.',
  professional: 'A clear path from "what you offer" straight to booking a consultation.',
  fashion: 'Visual-first layouts that let the product carry the page.',
  technology: 'Complex offerings explained simply, with proof points up front.'
};

industryButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    industryButtons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
    industryPreviewText.textContent = industryCopy[btn.dataset.industry];
  });
});
})();