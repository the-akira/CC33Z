(function () {
  var nav = document.querySelector('.navbar');
  var toggle = nav.querySelector('.nav-toggle');
  var list = document.getElementById('nav-list');
  var dropdowns = nav.querySelectorAll('.dropdown');

  // true quando é desktop com mouse (hover disponível)
  var desktop = window.matchMedia('(hover: hover) and (min-width: 1071px)');

  desktop.addEventListener('change', function () {
    closeAll();
    list.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });

  function setOpen(dd, open) {
    dd.classList.toggle('open', open);
    dd.querySelector('.nav-link').setAttribute('aria-expanded', open);
  }

  function closeAll(except) {
    dropdowns.forEach(function (dd) {
      if (dd !== except) setOpen(dd, false);
    });
  }

  // Menu hambúrguer (mobile)
  toggle.addEventListener('click', function () {
    var open = list.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  dropdowns.forEach(function (dd) {
    var btn = dd.querySelector('.nav-link');

    // Desktop: passar o mouse abre este menu e fecha qualquer outro
    dd.addEventListener('mouseenter', function () {
      if (!desktop.matches) return;
      closeAll(dd);
      setOpen(dd, true);
    });

    // Desktop: sair com o mouse fecha o menu
    dd.addEventListener('mouseleave', function () {
      if (!desktop.matches) return;
      setOpen(dd, false);
    });

    // Desktop: navegação por teclado (Tab abre, sair do menu fecha)
    dd.addEventListener('focusin', function () {
      if (!desktop.matches) return;
      closeAll(dd);
      setOpen(dd, true);
    });
    dd.addEventListener('focusout', function (e) {
      if (!desktop.matches) return;
      if (!dd.contains(e.relatedTarget)) setOpen(dd, false);
    });

    // Clique/toque: sem efeito no desktop; sanfona no mobile
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (desktop.matches) return;
      var isOpen = dd.classList.contains('open');
      closeAll(dd);
      setOpen(dd, !isOpen);
    });
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) closeAll();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAll();
      list.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Destaca a página atual
  // Remove query/hash, barra final e ".html"; vazio vira "index"
  function normalize(path) {
    path = path.split('?')[0].split('#')[0].replace(/\/+$/, '');
    path = path.split('/').pop().replace(/\.html$/, '');
    return path || 'index';
  }
  var current = normalize(location.pathname);
  nav.querySelectorAll('a').forEach(function (a) {
    if (normalize(a.getAttribute('href')) === current) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
      var dd = a.closest('.dropdown');
      if (dd) dd.querySelector('.nav-link').classList.add('has-active');
    }
  });
})();