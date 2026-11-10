/* Ashford Capital — site behaviour
   Progressive enhancement: every page is readable and navigable without JavaScript.
   Modules are initialised by the presence of data-* hooks in the markup. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var cfg = window.ASHFORD_CONFIG || {};

  function rand(seed) { // small seeded PRNG so "scatter" layouts are stable between visits
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ------------------------------------------------------------------ */
  /* Header + mobile navigation                                          */
  /* ------------------------------------------------------------------ */
  (function header() {
    var header = $('[data-header]');
    if (!header) return;
    var toggle = $('[data-nav-toggle]');
    var panel = $('[data-nav-panel]');
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (!toggle || !panel) return;

    var setOpen = function (open) {
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.nav-toggle__label').textContent = open ? 'Close' : 'Menu';
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) { setOpen(false); toggle.focus(); }
      // keep keyboard focus inside the open mobile menu
      if (e.key === 'Tab' && document.body.classList.contains('nav-open')) {
        var f = $$('a, button', header).filter(function (el) { return el.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    $$('a', panel).forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    window.matchMedia('(min-width: 960px)').addEventListener('change', function (m) { if (m.matches) setOpen(false); });
  })();

  /* ------------------------------------------------------------------ */
  /* Reveal on scroll                                                    */
  /* ------------------------------------------------------------------ */
  (function reveal() {
    var els = $$('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || reduceMotion) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ------------------------------------------------------------------ */
  /* Accordion  [data-acc]                                               */
  /*  data-acc-single  one panel always open (also used for hover reveal)*/
  /*  data-acc-hover   desktop pointers: hovering a row opens it         */
  /* ------------------------------------------------------------------ */
  function Acc(el) {
    this.el = el;
    this.single = el.hasAttribute('data-acc-single');
    this.hover = el.hasAttribute('data-acc-hover') && canHover;
    this.items = $$(':scope > .acc__item', el);
    this.index = -1;
    var self = this;
    this.items.forEach(function (item, i) {
      var btn = $('.acc__btn', item);
      if (!btn) return;
      btn.addEventListener('click', function () { self.toggle(i); });
      btn.addEventListener('keydown', function (e) { self.key(e, i); });
      if (self.hover) {
        var t;
        item.addEventListener('mouseenter', function () { t = setTimeout(function () { self.open(i); }, 90); });
        item.addEventListener('mouseleave', function () { clearTimeout(t); });
      }
    });
    var open = this.items.map(function (it) { return it.classList.contains('is-open'); });
    if (this.single) {
      var first = open.indexOf(true);
      this.set(first > -1 ? first : 0, true);
    } else {
      this.items.forEach(function (it, i) { self.paint(i, open[i]); });
    }
    el._acc = this;
  }
  Acc.prototype.paint = function (i, open) {
    var item = this.items[i], btn = $('.acc__btn', item);
    item.classList.toggle('is-open', open);
    if (btn) btn.setAttribute('aria-expanded', String(open));
  };
  Acc.prototype.set = function (i, silent) {
    var self = this;
    this.items.forEach(function (_, k) { self.paint(k, k === i); });
    var changed = this.index !== i;
    this.index = i;
    if (changed && !silent) this.el.dispatchEvent(new CustomEvent('acc:change', { detail: { index: i } }));
    if (silent) this.el.dispatchEvent(new CustomEvent('acc:change', { detail: { index: i, initial: true } }));
  };
  Acc.prototype.open = function (i) {
    if (this.single) { if (this.index !== i) this.set(i); }
    else this.paint(i, true);
  };
  Acc.prototype.toggle = function (i) {
    if (this.single) { this.open(i); return; }
    this.paint(i, !this.items[i].classList.contains('is-open'));
  };
  Acc.prototype.key = function (e, i) {
    var n = this.items.length, to = -1;
    if (e.key === 'ArrowDown') to = (i + 1) % n;
    else if (e.key === 'ArrowUp') to = (i - 1 + n) % n;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = n - 1;
    if (to < 0) return;
    // skip items hidden by an active filter
    var guard = 0;
    while (this.items[to].hidden && guard++ < n) to = (to + (e.key === 'ArrowUp' ? -1 : 1) + n) % n;
    e.preventDefault();
    var b = $('.acc__btn', this.items[to]);
    if (b) b.focus();
  };
  $$('[data-acc]').forEach(function (el) { new Acc(el); });

  /* ------------------------------------------------------------------ */
  /* Tabs  [data-tabs]                                                   */
  /*  data-tabs-hover  desktop pointers: hovering a tab selects it       */
  /*  data-tabs-hash   tabs are #anchors; URL hash selects + scrolls     */
  /* ------------------------------------------------------------------ */
  $$('[data-tabs]').forEach(function (root) {
    var tabs = $$('[role="tab"]', root);
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var hashMode = root.hasAttribute('data-tabs-hash');
    function select(i, focus, scroll) {
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (panels[k]) panels[k].hidden = !on;
      });
      if (focus) tabs[i].focus();
      if (scroll && panels[i]) {
        var top = panels[i].getBoundingClientRect().top + window.scrollY;
        var offset = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 70) + 70;
        window.scrollTo({ top: Math.max(top - offset, 0), behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      root.dispatchEvent(new CustomEvent('tabs:change', { detail: { index: i } }));
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function (e) {
        if (t.tagName === 'A') e.preventDefault();
        select(i);
        if (hashMode && history.replaceState) history.replaceState(null, '', t.getAttribute('href'));
      });
      t.addEventListener('keydown', function (e) {
        var n = tabs.length, to = -1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') to = (i + 1) % n;
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') to = (i - 1 + n) % n;
        else if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = n - 1;
        if (to > -1) {
          e.preventDefault(); select(to, true);
          if (hashMode && history.replaceState) history.replaceState(null, '', tabs[to].getAttribute('href'));
        }
      });
      if (canHover && root.hasAttribute('data-tabs-hover')) t.addEventListener('mouseenter', function () { if (t.getAttribute('aria-selected') !== 'true') select(i); });
    });
    root._select = select;

    if (hashMode) {
      var fromHash = function (scroll) {
        var h = location.hash.slice(1);
        var i = tabs.findIndex(function (t) { return t.getAttribute('aria-controls') === h; });
        return i > -1 ? (select(i, false, scroll), true) : false;
      };
      if (!fromHash(true)) select(0);
      window.addEventListener('hashchange', function () { fromHash(true); });
    }
  });

  /* ------------------------------------------------------------------ */
  /* Video boxes  [data-vbox]                                            */
  /*  Shows the player once the file loads; otherwise the placeholder    */
  /*  stays. Only one video plays at a time.                             */
  /* ------------------------------------------------------------------ */
  (function videoBoxes() {
    var boxes = $$('[data-vbox]');
    if (!boxes.length) return;
    var vids = [];
    boxes.forEach(function (box) {
      var v = $('video', box);
      if (!v) return;
      vids.push(v);
      function ready() { box.classList.add('is-ready'); box.classList.remove('is-empty'); }
      function empty() { box.classList.add('is-empty'); box.classList.remove('is-ready'); }
      v.addEventListener('loadedmetadata', ready);
      v.addEventListener('error', empty, true); // <source> errors do not bubble, so listen in the capture phase
      v.addEventListener('play', function () { vids.forEach(function (o) { if (o !== v) o.pause(); }); });
      if (v.readyState >= 1) ready();
      else if (v.networkState === 3) empty();
    });
  })();

  /* ------------------------------------------------------------------ */
  /* Method loop: ring <-> list                                          */
  /* ------------------------------------------------------------------ */
  $$('[data-loop]').forEach(function (loop) {
    var accEl = $('[data-acc]', loop), acc = accEl._acc;
    var nodes = $$('.loop__node', loop), arcs = $$('.loop__arc', loop);
    var title = $('[data-loop-title]', loop), count = $('[data-loop-count]', loop);
    var names = $$('.acc__title', accEl).map(function (t) { return t.textContent; });
    function sync(i) {
      nodes.forEach(function (n, k) { n.classList.toggle('is-active', k === i); });
      arcs.forEach(function (a, k) { a.classList.toggle('is-active', k === i); });
      title.textContent = names[i];
      count.textContent = '0' + (i + 1) + ' / 0' + names.length;
    }
    accEl.addEventListener('acc:change', function (e) { sync(e.detail.index); });
    sync(acc.index);
    nodes.forEach(function (n, k) {
      n.addEventListener('click', function () { acc.open(k); });
      if (canHover) n.addEventListener('mouseenter', function () { acc.open(k); });
    });
  });

  /* ------------------------------------------------------------------ */
  /* Pathway finder (home accordion or pathways-page tabs)               */
  /* ------------------------------------------------------------------ */
  $$('[data-finder]').forEach(function (finder) {
    var chips = $$('[data-path]', finder), out = $('[data-finder-result]', finder);
    var cardsEl = $('[data-pcards]'), tabsEl = $('[data-tabs-hash]'), svcEl = $('[data-svc]');
    if (!cardsEl && !tabsEl && !svcEl) return;
    var base = out.innerHTML;
    var copy = [
      ['Market Readers', 'readers', 'Build the ability to interpret.'],
      ['Market Operators', 'operators', 'Build the ability to decide and execute.'],
      ['Capital Thinkers', 'thinkers', 'Build the ability to allocate and preserve capital.']
    ];
    var cards = cardsEl ? $$('.pcard', cardsEl) : [];
    function clear() {
      chips.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      cards.forEach(function (c) { c.classList.remove('is-match'); });
      if (cardsEl) cardsEl.classList.remove('has-match');
      out.innerHTML = base;
    }
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var i = +c.getAttribute('data-path');
        if (c.getAttribute('aria-pressed') === 'true' && (cardsEl || svcEl)) { clear(); return; }
        chips.forEach(function (o) { o.setAttribute('aria-pressed', String(o === c)); });
        out.innerHTML = 'Suggested starting point: <strong>' + copy[i][0] + '</strong>. ' + copy[i][2] +
          (cardsEl || svcEl ? ' <a href="pathways.html#' + copy[i][1] + '">See the pathway</a>, or confirm' : ' See the details below, or confirm') +
          ' your fit with the <a href="begin.html">readiness assessment</a>.';
        if (svcEl && svcEl._acc) { svcEl._acc.open(i); return; }
        if (cardsEl) {
          cardsEl.classList.add('has-match');
          cards.forEach(function (card, k) { card.classList.toggle('is-match', k === i); });
          if (window.matchMedia('(max-width: 899px)').matches) cards[i].scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
        } else {
          tabsEl._select(i, false, true);
          if (history.replaceState) history.replaceState(null, '', '#' + copy[i][1]);
        }
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /* Demo: Decision Lab                                                  */
  /* ------------------------------------------------------------------ */
  $$('[data-lab]').forEach(function (lab) {
    var opts = $$('.demo__opt', lab), result = $('.demo__result', lab), prompt = $('.demo__prompt', lab), line = $('[data-line-out]', lab);
    opts.forEach(function (o) {
      o.addEventListener('click', function () {
        opts.forEach(function (x) { x.setAttribute('aria-pressed', String(x === o)); });
        line.textContent = o.getAttribute('data-line');
        result.hidden = false; prompt.hidden = true;
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /* Demo: Trade Autopsy                                                 */
  /* ------------------------------------------------------------------ */
  $$('[data-autopsy]').forEach(function (root) {
    var cases = JSON.parse($('[data-cases]', root).textContent);
    var btns = $$('[data-case]', root), title = $('[data-case-title]', root), verdict = $('[data-verdict]', root);
    function show(i) {
      var c = cases[i];
      btns.forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === i)); });
      title.textContent = c.title; verdict.textContent = c.verdict;
      ['reasoning', 'execution', 'outcome'].forEach(function (k) {
        $('[data-meter="' + k + '"]', root).style.setProperty('--v', c[k][1]);
        $('[data-val="' + k + '"]', root).textContent = c[k][0];
      });
    }
    btns.forEach(function (b, i) { b.addEventListener('click', function () { show(i); }); });
    show(0);
  });

  /* ------------------------------------------------------------------ */
  /* Demo: prioritize the inputs (scatter <-> lanes)                     */
  /* ------------------------------------------------------------------ */
  $$('[data-prio]').forEach(function (prio) {
    var root = prio.closest('[data-prio-demo]') || prio.parentElement;
    var toggle = $('[data-prio-toggle]', root);
    var chips = $$('.prio__chip', prio), labels = $$('.prio__label', prio);
    var rnd = rand(11), lastW = 0;

    function layout() {
      var w = prio.clientWidth;
      if (!w || w === lastW) return;
      lastW = w;
      // 1. measure the natural (prioritized) flow layout
      prio.classList.remove('is-enhanced');
      prio.style.removeProperty('--h');
      var pr = prio.getBoundingClientRect();
      var h = Math.ceil(prio.getBoundingClientRect().height);
      var all = labels.concat(chips);
      all.forEach(function (el) {
        var r = el.getBoundingClientRect();
        el._w = r.width; el._h = r.height;
        el.style.setProperty('--sx', Math.round(r.left - pr.left) + 'px');
        el.style.setProperty('--sy', Math.round(r.top - pr.top) + 'px');
      });
      // 2. scatter positions: shuffled rows packed by measured width (no overlaps), jittered
      var gap = 10, order = chips.map(function (_, k) { return k; }).sort(function () { return rnd() - 0.5; });
      var rows = [], cur = [], curW = 0;
      order.forEach(function (k) {
        var cw = chips[k]._w;
        if (cur.length && curW + gap + cw > w) { rows.push(cur); cur = []; curW = 0; }
        curW += (cur.length ? gap : 0) + cw; cur.push(k);
      });
      if (cur.length) rows.push(cur);
      var chipH = chips.reduce(function (m, c) { return Math.max(m, c._h); }, 0);
      var rowH = rows.length > 1 ? (h - chipH) / (rows.length - 1) : 0;
      rows.forEach(function (row, r) {
        var used = row.reduce(function (t, k) { return t + chips[k]._w; }, 0) + gap * (row.length - 1);
        var slack = Math.max(w - used, 0), wts = [], sum = 0, i;
        for (i = 0; i <= row.length; i++) { wts.push(0.3 + rnd()); sum += wts[i]; }
        var x = slack * wts[0] / sum;
        row.forEach(function (k, n) {
          var c = chips[k], jit = Math.max(0, rowH - chipH) / 2 * 0.85 * (rnd() * 2 - 1);
          var y = Math.min(Math.max(r * rowH + jit, 0), Math.max(h - c._h, 0));
          c.style.setProperty('--cx', Math.round(Math.min(Math.max(x, 0), Math.max(w - c._w, 0))) + 'px');
          c.style.setProperty('--cy', Math.round(y) + 'px');
          x += c._w + gap + slack * wts[n + 1] / sum;
        });
      });
      prio.style.setProperty('--h', h + 'px');
      prio.classList.add('is-enhanced');
    }
    function setSorted(on) {
      prio.classList.toggle('is-sorted', on);
      if (toggle) { toggle.setAttribute('aria-pressed', String(on)); toggle.textContent = on ? 'Scatter the inputs again' : 'Prioritize the inputs'; }
    }
    if (toggle) toggle.addEventListener('click', function () { setSorted(!prio.classList.contains('is-sorted')); });
    if ('ResizeObserver' in window) new ResizeObserver(layout).observe(prio);
    else window.addEventListener('resize', layout);
    layout();
    if (reduceMotion) prio.classList.add('is-sorted');
  });

  /* ------------------------------------------------------------------ */
  /* In-page sub-navigation: scroll-spy                                  */
  /* ------------------------------------------------------------------ */
  $$('[data-subnav]').forEach(function (nav) {
    var links = $$('a[href^="#"]', nav);
    var list = $('.subnav__list', nav);
    var map = {};
    links.forEach(function (a) { var t = document.getElementById(a.getAttribute('href').slice(1)); if (t) map[t.id] = a; });
    var targets = Object.keys(map).map(function (id) { return document.getElementById(id); });
    if (!targets.length) return;
    function activate(a) {
      links.forEach(function (l) { l.classList.toggle('is-active', l === a); if (l === a) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); });
      if (a && list && list.scrollWidth > list.clientWidth) list.scrollLeft = a.offsetLeft - (list.clientWidth - a.offsetWidth) / 2;
    }
    var ticking = false;
    function spy() {
      ticking = false;
      var line = window.innerHeight * 0.3, cur = null;
      targets.forEach(function (t) { if (t.getBoundingClientRect().top <= line) cur = t; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = targets[targets.length - 1];
      var next = cur ? map[cur.id] : null;
      if (next !== spy.last) { spy.last = next; activate(next); }
    }
    spy.last = undefined;
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
    window.addEventListener('resize', spy);
    spy();
  });

  /* ------------------------------------------------------------------ */
  /* Method: decision vs. outcome matrix                                 */
  /* ------------------------------------------------------------------ */
  $$('[data-matrix]').forEach(function (root) {
    var cells = $$('[data-cell]', root), t = $('[data-matrix-title]', root), x = $('[data-matrix-text]', root);
    cells.forEach(function (c) {
      c.addEventListener('click', function () {
        cells.forEach(function (o) { o.setAttribute('aria-pressed', String(o === c)); });
        t.textContent = c.getAttribute('data-title');
        x.textContent = c.getAttribute('data-text');
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /* Intelligence: searchable, filterable research library               */
  /* ------------------------------------------------------------------ */
  $$('[data-lib-list]').forEach(function (list) {
    var root = list.closest('.lib') || document;
    var items = $$('.lib__item', list);
    var search = $('[data-lib-search]', root), status = $('[data-lib-status]', root), empty = $('[data-lib-empty]', root);
    var catBtns = $$('[data-cat]', root);
    var state = { cat: 'all', q: '' };

    function apply() {
      var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean), shown = 0;
      items.forEach(function (it) {
        var ok = (state.cat === 'all' || it.getAttribute('data-category') === state.cat) &&
                 terms.every(function (w) { return it.getAttribute('data-search').indexOf(w) > -1; });
        it.hidden = !ok;
        if (ok) shown++;
      });
      status.textContent = shown === items.length ? items.length + ' entries' : shown + ' of ' + items.length + ' entries';
      empty.hidden = shown !== 0;
      list.hidden = shown === 0;
    }
    if (search) search.addEventListener('input', function () { state.q = search.value; apply(); });
    catBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        state.cat = b.getAttribute('data-cat');
        catBtns.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        apply();
      });
    });
    apply();
  });

  /* ------------------------------------------------------------------ */
  /* Intelligence: three images that expand (hover is pure CSS; this keeps    */
  /* aria-expanded in step with it and adds tap for touch screens)            */
  /* ------------------------------------------------------------------ */
  $$('[data-hov]').forEach(function (group) {
    var items = $$('.hov__item', group), canHover = window.matchMedia('(hover: hover)');
    function only(it) { items.forEach(function (o) { o.setAttribute('aria-expanded', o === it ? 'true' : 'false'); }); }
    items.forEach(function (it) {
      it.addEventListener('mouseenter', function () { if (canHover.matches) only(it); });
      it.addEventListener('mouseleave', function () { if (canHover.matches) it.setAttribute('aria-expanded', 'false'); });
      it.addEventListener('focus', function () { if (canHover.matches && it.matches(':focus-visible')) only(it); });
      it.addEventListener('blur', function () { it.setAttribute('aria-expanded', 'false'); });
      it.addEventListener('click', function () {
        if (canHover.matches) return;                 // with a mouse the hover/focus styles do the work
        var open = it.getAttribute('aria-expanded') === 'true';
        only(open ? null : it);
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /* Forms: shared validation + delivery                                 */
  /* ------------------------------------------------------------------ */
  function validateScope(scope) {
    var ok = true, first = null;
    $$('[data-q]', scope).forEach(function (q) {
      var err = $('[data-error]', q), msg = '', key = q.getAttribute('data-q');
      var radios = $$('input[type="radio"]', q);
      var field = $('input:not([type="radio"]), textarea, select', q);
      if (radios.length) {
        if (!radios.some(function (r) { return r.checked; })) msg = 'Please choose one option to continue.';
      } else if (field) {
        var v = (field.value || '').trim();
        if (key === 'name' && v.length < 2) msg = 'Please enter your name.';
        else if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Please enter a valid email address so we can reply.';
        else if (key === 'phone' && v && !/^[+()\d\s-]{7,20}$/.test(v)) msg = 'Please enter a valid phone number, or leave it blank.';
        else if (key === 'topic' && !v) msg = 'Please choose a topic.';
        else if (key === 'message' && v.length < 10) msg = 'Please add a short message.';
        else if (key === 'consent' && !field.checked) msg = 'Please confirm to continue.';
        if (field.type !== 'checkbox') field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      }
      if (err) { err.setAttribute('role', 'alert'); err.textContent = msg; }
      if (msg) { ok = false; if (!first) first = q; }
    });
    if (first) { var f = $('input, textarea, select', first); if (f) f.focus(); }
    return ok;
  }
  function clearOnInput(scope) {
    scope.addEventListener('input', function (e) { var q = e.target.closest('[data-q]'); if (q) { var er = $('[data-error]', q); if (er) er.textContent = ''; if (e.target.setAttribute) e.target.setAttribute('aria-invalid', 'false'); } });
    scope.addEventListener('change', function (e) { var q = e.target.closest('[data-q]'); if (q) { var er = $('[data-error]', q); if (er) er.textContent = ''; } });
  }
  function toObject(form) {
    var o = {};
    $$('input, textarea, select', form).forEach(function (el) {
      if (!el.name) return;
      if (el.type === 'radio') { if (el.checked) o[el.name] = el.value; }
      else if (el.type === 'checkbox') o[el.name] = el.checked;
      else o[el.name] = el.value.trim();
    });
    return o;
  }
  function deliver(payload) {
    if (!cfg.formEndpoint) return Promise.resolve({ sent: false });
    return fetch(cfg.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return { sent: true }; });
  }

  /* ------------------------------------------------------------------ */
  /* Begin Your Journey: readiness assessment                            */
  /* ------------------------------------------------------------------ */
  var LABEL = {
    experience: { 'lt6m': 'Less than 6 months', '6m-2y': '6 months to 2 years', '2-5y': '2 to 5 years', '5y+': 'More than 5 years' },
    difficulty: { interpretation: 'Interpreting the market', decision: 'Making decisions', execution: 'Executing under pressure', risk: 'Managing risk', review: 'Reviewing and improving' },
    process: { 'plan-followed': 'Follows a written plan', 'plan-deviate': 'Has a plan, often deviates', 'in-the-moment': 'Decides in the moment', outside: 'Relies on signals, mentors or other views' },
    objective: { understand: 'Understand and read markets independently', execute: 'Execute with consistency and discipline', allocate: 'Allocate and preserve capital', unsure: 'Not sure yet' }
  };
  var PATH = {
    readers: { name: 'Market Readers', url: 'pathways.html#readers' },
    operators: { name: 'Market Operators', url: 'pathways.html#operators' },
    thinkers: { name: 'Capital Thinkers', url: 'pathways.html#thinkers' }
  };
  function recommend(a) {
    var byDiff = a.difficulty === 'interpretation' ? 'readers' : 'operators';
    var seasoned = a.experience === '2-5y' || a.experience === '5y+';
    var byObj = { understand: 'readers', execute: 'operators', allocate: seasoned ? 'thinkers' : 'operators', unsure: null }[a.objective];
    var path = (a.objective === 'allocate' && seasoned) ? 'thinkers' : byDiff;
    var agree = !byObj || byObj === byDiff || path === 'thinkers';
    var r = { path: path, type: 'pathway' };
    if (a.experience === 'lt6m') {
      r.type = 'conversation'; r.path = 'readers';
      r.title = 'A short conversation first';
      r.lead = 'Ashford’s pathways assume some market exposure. A conversation can help you decide whether to build foundations first, and which pathway would follow. Market Readers is the likely starting point.';
    } else if (path === 'thinkers') {
      r.type = 'conversation';
      r.title = 'Capital Thinkers, by conversation';
      r.lead = 'Your objective points to Capital Thinkers, our elite pathway. We confirm fit through a conversation, after the assessment.';
    } else if (!agree || a.objective === 'unsure') {
      r.type = 'conversation';
      r.title = 'A short conversation is the logical next step';
      r.lead = a.objective === 'unsure'
        ? 'You are still deciding what to improve, which is a fair place to be. A conversation will clarify the right pathway. ' + PATH[path].name + ' looks most likely.'
        : 'Your difficulty and your objective point in different directions. A conversation will clarify whether ' + PATH[byDiff].name + ' or ' + PATH[byObj].name + ' fits better.';
    } else {
      r.title = PATH[path].name;
      r.lead = 'Your main difficulty and your objective point to the same place. ' + PATH[path].name + (path === 'readers' ? ' builds the ability to interpret.' : ' builds the ability to decide and execute.');
    }
    return r;
  }

  $$('[data-assess]').forEach(function (root) {
    var form = $('[data-assess-form]', root), steps = $$('fieldset[data-step]', form);
    var bar = $$('.assess__bar li', root), label = $('[data-assess-label]', root), progress = $('[data-assess-progress]', root);
    var back = $('[data-back]', form), next = $('[data-next]', form), result = $('[data-assess-result]', root);
    var arrow = $('.i', next) ? $('.i', next).outerHTML : '';
    var submitErr = $('[data-submit-error]', form);
    var cur = 0, total = steps.length;
    var params = new URLSearchParams(location.search);

    var d = params.get('difficulty');
    if (d) {
      var r = form.querySelector('input[name="difficulty"][value="' + d.replace(/[^a-z-]/g, '') + '"]');
      if (r) { r.checked = true; var note = $('[data-prefill-note]', form); if (note) note.hidden = false; }
    }
    var pw = params.get('pathway');
    if (pw && form.elements.interest) form.elements.interest.value = pw.replace(/[^a-z]/g, '');
    clearOnInput(form);

    function show(i, focus) {
      cur = i;
      steps.forEach(function (s, k) { s.hidden = k !== i; });
      bar.forEach(function (b, k) { b.classList.toggle('is-on', k <= i); });
      label.textContent = 'Step ' + (i + 1) + ' of ' + total + ' · ' + steps[i].getAttribute('data-title');
      back.hidden = i === 0;
      next.innerHTML = (i === total - 1 ? 'See my next step ' : 'Continue ') + arrow;
      if (focus) {
        var lg = $('legend', steps[i]);
        var top = progress.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 70) - 24;
        window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? 'auto' : 'smooth' });
        if (lg) lg.focus({ preventScroll: true });
      }
    }
    show(0, false);
    back.addEventListener('click', function () { if (cur > 0) show(cur - 1, true); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateScope(steps[cur])) return;
      if (cur < total - 1) { show(cur + 1, true); return; }

      var a = toObject(form), rec = recommend(a);
      var payload = { type: 'assessment', submittedAt: new Date().toISOString(), page: location.pathname, answers: a, suggestion: { type: rec.type, pathway: rec.path, title: rec.title } };
      submitErr.hidden = true;
      next.disabled = true; next.textContent = 'Sending…';
      deliver(payload).then(function (res) {
        showResult(a, rec, res.sent);
      }).catch(function () {
        next.disabled = false; next.innerHTML = 'See my next step ' + arrow;
        submitErr.textContent = 'We could not send your responses. Please check your connection and try again.';
        submitErr.hidden = false;
      });
    });

    function showResult(a, rec, sent) {
      $('[data-result-title]', result).textContent = rec.title;
      $('[data-result-lead]', result).textContent = rec.lead;
      var rows = [
        ['Primary difficulty', LABEL.difficulty[a.difficulty]],
        ['Development objective', LABEL.objective[a.objective]],
        ['Experience', LABEL.experience[a.experience]],
        ['Current process', LABEL.process[a.process]],
        ['Suggested next step', rec.type === 'conversation' ? 'A conversation' : 'A pathway recommendation']
      ];
      var dl = $('[data-result-summary]', result); dl.innerHTML = '';
      rows.forEach(function (r) {
        var row = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
        dt.textContent = r[0]; dd.textContent = r[1]; row.appendChild(dt); row.appendChild(dd); dl.appendChild(row);
      });
      var link = $('[data-result-link]', result);
      if (rec.type === 'conversation' && rec.path !== 'thinkers' && a.experience === 'lt6m') { link.href = 'method.html'; link.innerHTML = 'Explore the Method ' + arrow; }
      else { link.href = PATH[rec.path].url; link.innerHTML = 'Explore ' + PATH[rec.path].name + ' ' + arrow; }
      $('[data-dev-notice]', result).hidden = sent;
      form.hidden = true; progress.hidden = true; result.hidden = false;
      var top = result.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 70) - 24;
      window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? 'auto' : 'smooth' });
      result.focus({ preventScroll: true });
    }
  });

  /* ------------------------------------------------------------------ */
  /* Social links: URLs can be overridden in config.js                   */
  /* ------------------------------------------------------------------ */
  (function social() {
    var map = cfg.social || {};
    $$('[data-social]').forEach(function (a) {
      var u = map[a.getAttribute('data-social')];
      if (u && /^https?:\/\//.test(u)) a.href = u;
    });
  })();

  /* ------------------------------------------------------------------ */
  /* Join us: one-field email form                                       */
  /* ------------------------------------------------------------------ */
  $$('[data-join-form]').forEach(function (form) {
    var wrap = form.closest('[data-join]'), done = $('[data-join-done]', wrap);
    var btn = $('[data-submit]', form), err = $('[data-submit-error]', form), label = btn.innerHTML;
    clearOnInput(form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateScope(form)) return;
      err.hidden = true; btn.disabled = true; btn.textContent = 'Sending…';
      deliver({ type: 'join', submittedAt: new Date().toISOString(), page: location.pathname, fields: toObject(form) }).then(function (res) {
        form.hidden = true; done.hidden = false; $('[data-dev-notice]', done).hidden = res.sent; done.focus();
      }).catch(function () {
        btn.disabled = false; btn.innerHTML = label;
        err.textContent = 'We could not send that. Please check your connection and try again.'; err.hidden = false;
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /* Contact form + configurable contact email                           */
  /* ------------------------------------------------------------------ */
  (function contact() {
    var em = $('[data-contact-email]');
    if (em && cfg.contactEmail) { var a = $('a', em); a.href = 'mailto:' + cfg.contactEmail; a.textContent = cfg.contactEmail; em.hidden = false; }
    var form = $('[data-contact-form]'), done = $('[data-contact-done]');
    if (!form) return;
    var btn = $('[data-submit]', form), err = $('[data-submit-error]', form), label = btn.innerHTML;
    clearOnInput(form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateScope(form)) return;
      var o = toObject(form);
      err.hidden = true; btn.disabled = true; btn.textContent = 'Sending…';
      deliver({ type: 'contact', submittedAt: new Date().toISOString(), page: location.pathname, fields: o }).then(function (res) {
        form.hidden = true; done.hidden = false; $('[data-dev-notice]', done).hidden = res.sent; done.focus();
      }).catch(function () {
        btn.disabled = false; btn.innerHTML = label;
        err.textContent = 'We could not send your message. Please check your connection and try again.'; err.hidden = false;
      });
    });
  })();

})();
