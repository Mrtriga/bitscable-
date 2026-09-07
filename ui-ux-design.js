(function () {
  var mock = document.getElementById('uxuiMock');
  var toggle = document.getElementById('uxuiToggle');
  if (!mock || !toggle) return;

  toggle.addEventListener('click', function () {
    var clean = mock.classList.toggle('is-clean');
    toggle.textContent = clean ? 'Mess it up again' : 'Reorganize it';
  });
})();

(function () {
  var wrap = document.getElementById('uxuiMatch');
  var tray = document.getElementById('uxuiMatchPhotos');
  var doneMsg = document.getElementById('uxuiMatchDone');
  var autoBtn = document.getElementById('uxuiMatchAuto');
  if (!wrap || !tray) return;

  var boxes = wrap.querySelectorAll('.uxui-match__box');
  var photos = Array.prototype.slice.call(tray.querySelectorAll('.uxui-match__photo'));

  function checkDone() {
    var all = true;
    boxes.forEach(function (b) { if (!b.classList.contains('is-filled')) all = false; });
    if (doneMsg) doneMsg.classList.toggle('is-visible', all);
  }

  function resetAll() {
    boxes.forEach(function (b) {
      b.classList.remove('is-filled');
      b.querySelector('.uxui-match__slot').innerHTML = '';
    });
    photos.forEach(function (p) {
      p.classList.remove('is-placed');
      tray.appendChild(p);
    });
    if (doneMsg) doneMsg.classList.remove('is-visible');
  }

  function placeInBox(photo, box) {
    photo.classList.add('is-placed');
    box.querySelector('.uxui-match__slot').appendChild(photo);
    box.classList.add('is-filled');
    checkDone();
  }

  if (autoBtn) autoBtn.addEventListener('click', function () {
    autoBtn.classList.remove('uxui-match__btn--blink');
    resetAll();
    setTimeout(function () {
      photos.forEach(function (photo, i) {
        setTimeout(function () {
          var box = wrap.querySelector('.uxui-match__box[data-accept="' + photo.dataset.match + '"]');
          if (box) placeInBox(photo, box);
        }, i * 450);
      });
    }, 150);
  });
})();
(function () {
  var device = document.getElementById('uxuiDevice');
  var switcher = document.getElementById('uxuiDeviceSwitch');
  var note = document.getElementById('uxuiDeviceNote');
  if (!device || !switcher) return;

  var notes = {
    phone: 'Touch targets sized for thumbs. Navigation lives in a bottom bar for one-handed reach. Content stacks in a single column.',
    tablet: 'A side rail replaces the bottom bar. Two-column layout balances the extra width without overwhelming it.',
    desktop: 'Full top navigation and hover states become available. Content spreads into multiple columns to use the space.'
  };

  var buttons = switcher.querySelectorAll('.uxui-mobile__btn');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var mode = btn.dataset.mode;
      device.setAttribute('data-mode', mode);
      if (note) note.textContent = notes[mode];
    });
  });
})();
(function () {
  var diag = document.getElementById('uxuiDiag');
  var caption = document.getElementById('uxuiDiagCaption');
  if (!diag || !caption) return;

  var points = {
    hierarchy: '<strong>Hierarchy —</strong> the heading is bigger and darker than everything around it, so your eye knows what to read first.',
    consistency: '<strong>Consistency —</strong> the logo, nav links, and spacing all follow the same pattern, so nothing behaves like a surprise.',
    clarity: '<strong>Clarity —</strong> the CTA says exactly what happens next — no guessing what "Submit" or "Go" might mean.',
    accessibility: '<strong>Accessibility —</strong> this image has real alt text behind it, so it still makes sense to a screen reader.',
    responsiveness: '<strong>Responsiveness —</strong> this same layout already works across phone, tablet, and desktop — you saw it above.',
    feedback: '<strong>Feedback —</strong> a well-built CTA changes state when pressed, so the interface confirms the tap actually landed.'
  };

  var dots = diag.querySelectorAll('.uxui-diag__dot');
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      dots.forEach(function (d) { d.classList.remove('is-active'); });
      dot.classList.add('is-active');
      caption.innerHTML = points[dot.dataset.point] || '';
    });
  });
})();
(function () {
  var buttons = document.querySelectorAll('.uxui-faq__q');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      var answer = btn.nextElementSibling;
      buttons.forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.style.maxHeight = null;
      });
      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();