(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  function setNav(open) {
    toggle.setAttribute('aria-expanded', String(open));
    links.classList.toggle('open', open);
  }
  toggle.addEventListener('click', function () {
    setNav(toggle.getAttribute('aria-expanded') !== 'true');
  });
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setNav(false);
  });

  // Curriculum tabs
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var next;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });
  if (tabs.length) selectTab(tabs[0]);

  // Project filters
  var filterButtons = document.querySelectorAll('.filters button');
  var projects = document.querySelectorAll('.proj');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filterButtons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      projects.forEach(function (p) {
        p.hidden = f !== 'all' && p.getAttribute('data-g') !== f;
      });
    });
  });

  // Count-up for headline numbers
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / 1200, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-IN') + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        entry.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Demo booking form: suggest the matching programme, then open a pre-filled email
  var form = document.getElementById('book-form');
  var grade = form.elements.grade;
  var hint = document.getElementById('grade-hint');
  grade.addEventListener('change', function () {
    var n = parseInt(grade.value.replace(/\D/g, ''), 10);
    if (!n) { hint.textContent = ''; return; }
    hint.textContent = n <= 8
      ? 'Your child fits the Grades 6–8 Future Skills Foundation.'
      : 'Your child fits the Grades 9–12 AI & Technology Career Accelerator.';
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var el = form.elements;
    var body = [
      'Hello STEAM-IE,',
      '',
      'I would like to book a free 90-minute demo workshop.',
      '',
      "Parent's name: " + el.parent.value,
      'Phone: ' + el.phone.value,
      'Email: ' + (el.email.value || '-'),
      "Child's name: " + (el.child.value || '-'),
      "Child's grade: " + el.grade.value,
      'Preferred day: ' + el.day.value,
      '',
      el.notes.value ? 'Notes: ' + el.notes.value : ''
    ].join('\n');
    var subject = 'Demo workshop request: ' + el.grade.value;
    message.value = 'To: info@steam-ie.com\nSubject: ' + subject + '\n\n' + body.trim();
    copyStatus.textContent = '';
    sent.hidden = false;
    window.location.href = 'mailto:info@steam-ie.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });

  // Fallback when no email app opens: let the parent copy the request
  var sent = document.getElementById('book-sent');
  var message = document.getElementById('book-message');
  var copyStatus = document.getElementById('copy-status');
  document.getElementById('copy-message').addEventListener('click', function () {
    function selectText() {
      message.focus();
      message.select();
      copyStatus.textContent = 'Selected. Press Ctrl+C or ⌘C to copy.';
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message.value).then(function () {
        copyStatus.textContent = 'Copied';
      }, selectText);
    } else {
      selectText();
    }
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
