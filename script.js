/* Инновационные ЖАЛЮЗИ */
(function () {
  'use strict';

  /* ---------- header fixed on scroll ---------- */
  var header = document.querySelector('.header');
  var hero = document.querySelector('.hero');
  function onScroll() {
    var t = hero ? hero.offsetHeight - 100 : 300;
    header.classList.toggle('is-fixed', window.scrollY > t);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobile-menu');
  var closeBtn = document.getElementById('mmenu-close');

  function openMenu() {
    menu.hidden = false;
    void menu.offsetHeight;
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (!menu.classList.contains('is-open')) menu.hidden = true;
    }, 320);
  }
  if (burger && menu) {
    burger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    menu.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- about tabs (Гардероб / Кладовка / Шкаф) ---------- */
  var tabs = document.querySelectorAll('.tab');
  var aboutLead = document.querySelector('.about__lead');
  var roomTexts = {
    garderob: 'Дверцы-жалюзи для гардероба — индивидуальное изготовление.',
    kladovka: 'Дверцы-жалюзи для кладовок — под конкретный проём.',
    shkaf: 'Дверцы-жалюзи для шкафов — под нужный размер.'
  };
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-selected', 'false'); });
      t.classList.add('is-on');
      t.setAttribute('aria-selected', 'true');
      var room = t.getAttribute('data-obj');
      var doorsChip = document.querySelector('.chip[data-obj="doors"]');
      if (doorsChip) doorsChip.click();
      if (aboutLead && roomTexts[room]) aboutLead.textContent = roomTexts[room];
    });
  });

  /* ---------- services rail ---------- */
  var rail = document.getElementById('rail');
  var prev = document.getElementById('rail-prev');
  var next = document.getElementById('rail-next');
  if (rail && prev && next) {
    function railStep() {
      var card = rail.querySelector('.svc');
      return card ? card.getBoundingClientRect().width + 22 : 340;
    }
    function syncRail() {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= max;
    }
    prev.addEventListener('click', function () {
      rail.scrollBy({ left: -railStep(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      rail.scrollBy({ left: railStep(), behavior: 'smooth' });
    });
    rail.addEventListener('scroll', syncRail, { passive: true });
    window.addEventListener('resize', syncRail);
    syncRail();
  }

  /* ---------- lead popup ---------- */
  var popup = document.getElementById('popup');
  var lastFocus = null;

  function openPopup() {
    if (!popup) return;
    lastFocus = document.activeElement;
    popup.hidden = false;
    void popup.offsetHeight;
    popup.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    var first = popup.querySelector('input, button');
    if (first) first.focus();
  }
  function closePopup() {
    if (!popup || popup.hidden) return;
    popup.classList.remove('is-open');
    document.body.style.overflow = '';
    window.setTimeout(function () {
      if (!popup.classList.contains('is-open')) popup.hidden = true;
    }, 320);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (popup) {
    document.querySelectorAll('[data-popup]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        closeMenuIfOpen();
        openPopup();
      });
    });
    popup.querySelectorAll('[data-popup-close]').forEach(function (el) {
      el.addEventListener('click', closePopup);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePopup();
    });

    var popupForm = document.getElementById('popup-form');
    if (popupForm) {
      popupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var done = document.getElementById('popup-done');
        if (done) {
          done.hidden = false;
          popupForm.querySelectorAll('input, button[type="submit"]').forEach(function (f) { f.disabled = true; });
        }
      });
    }
  }

  function closeMenuIfOpen() {
    if (menu && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      window.setTimeout(function () {
        if (!menu.classList.contains('is-open')) menu.hidden = true;
      }, 320);
    }
  }

  /* ---------- calculator (Рассчитать изделие) ---------- */
  var form = document.getElementById('calc-form');
  if (form) {
    var area = document.getElementById('area');
    var areaOut = document.getElementById('area-out');
    var sumEl = document.getElementById('calc-sum');
    var noteEl = document.getElementById('calc-note');
    var doneEl = document.getElementById('calc-done');
    var productBtns = form.querySelectorAll('[data-obj]');
    var products = {
      doors: 'Дверцы-жалюзи',
      net: 'Москитная сетка',
      curtains: 'Шторы-жалюзи',
      hatch: 'Лючок-жалюзи'
    };
    var product = 'doors';

    function calc() {
      var size = parseInt(area.value, 10);
      areaOut.textContent = area.value;
      var note = 'Пришлите размеры — свяжемся с вами и рассчитаем заказ. Изготовление — до 7 дней.';
      if (!isNaN(size)) note += ' Указан размер: ' + size + ' см.';
      sumEl.textContent = products[product] || 'Под заказ';
      noteEl.textContent = note;
    }

    productBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        productBtns.forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-checked', 'false'); });
        b.classList.add('is-on');
        b.setAttribute('aria-checked', 'true');
        product = b.getAttribute('data-obj');
        calc();
      });
    });
    area.addEventListener('input', calc);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      doneEl.hidden = false;
    });
  }
})();
