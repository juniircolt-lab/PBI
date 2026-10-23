/* Navigation, menu and motion are local; data stays in OrbitaStore. */
window.OrbitaUI = (() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pages = new Set(['dashboard', 'atividades', 'campos', 'config', 'continuidade']);
  let app, activeTransition, sequence = 0, settled = Promise.resolve(), closing = null;
  const $ = selector => document.querySelector(selector);
  const animate = (node, frames, options) => reduced.matches || !node ? Promise.resolve() : node.animate(frames, options).finished.catch(() => {});

  function openMenu() {
    const dialog = $('#siteMenu');
    if (dialog.open || closing) return;
    dialog.showModal();
    document.body.classList.add('menu-open');
    $('#menuToggle').setAttribute('aria-expanded', 'true');
    animate($('.menu-list'), [{opacity: 0, transform: 'translateX(-45px)'}, {opacity: 1, transform: 'translateX(0)'}], {duration: 480, easing: 'cubic-bezier(.2,.8,.2,1)'});
    animate($('.menu-stories'), [{opacity: 0, transform: 'translateX(45px)'}, {opacity: 1, transform: 'translateX(0)'}], {duration: 620, easing: 'cubic-bezier(.2,.8,.2,1)'});
    if (!reduced.matches) $('.menu-routes').querySelectorAll('button').forEach((button, i) => button.animate([{opacity: 0, transform: 'translateY(22px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 450, delay: 60 + i * 40, fill: 'backwards', easing: 'cubic-bezier(.2,.8,.2,1)'}));
  }

  function closeMenu() {
    const dialog = $('#siteMenu');
    if (closing) return closing;
    if (!dialog.open) return Promise.resolve();
    closing = animate($('.menu-layout'), [{opacity: 1, transform: 'translateY(0)'}, {opacity: 0, transform: 'translateY(-14px)'}], {duration: 180, easing: 'ease-in'}).then(() => {
      dialog.close();
      document.body.classList.remove('menu-open');
      $('#menuToggle').setAttribute('aria-expanded', 'false');
      closing = null;
    });
    return closing;
  }

  function change(target, nextView) {
    if (!pages.has(target) || nextView && !['table', 'board', 'calendar'].includes(nextView)) return Promise.resolve();
    const request = ++sequence;
    const job = (async () => {
      await closeMenu();
      if (request !== sequence) return;
      const pageChanged = target !== app.getPage();
      if (!pageChanged && (!nextView || nextView === app.getView())) return;
      activeTransition?.skipTransition();
      const update = () => {
        if (request !== sequence) return;
        if (pageChanged) app.renderPage(target);
        if (nextView) app.renderView(nextView);
        if (pageChanged) {
          window.scrollTo({top: 0, behavior: 'instant'});
          $('#title').focus({preventScroll: true});
        }
      };
      if (reduced.matches) update();
      else if (document.startViewTransition) {
        const transition = document.startViewTransition(update);
        activeTransition = transition;
        try { await transition.finished; } catch { /* interrupted by a newer request */ }
        if (activeTransition === transition) activeTransition = null;
      } else {
        await animate($('#content'), [{opacity: 1, transform: 'translateY(0)'}, {opacity: 0, transform: 'translateY(-12px)'}], {duration: 130, easing: 'ease-in'});
        if (request !== sequence) return;
        update();
        await animate($('#content'), [{opacity: 0, transform: 'translateY(24px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 440, easing: 'cubic-bezier(.2,.8,.2,1)'});
      }
    })();
    settled = job;
    return job;
  }

  function init(adapter) {
    app = adapter;
    $('#menuToggle').onclick = openMenu;
    $('#closeMenu').onclick = closeMenu;
    $('#siteMenu').addEventListener('cancel', event => {event.preventDefault();closeMenu();});
    $('#siteMenu').addEventListener('close', () => {document.body.classList.remove('menu-open');$('#menuToggle').setAttribute('aria-expanded', 'false');});
    $('#siteMenu').querySelectorAll('[data-route]').forEach(button => button.addEventListener('click', () => change(button.dataset.route, button.dataset.routeView)));
    const descriptions = {dashboard: 'Veja o todo.\nEscolha a direção.', atividades: 'Encontre seu\npróximo movimento.', campos: 'Seu trabalho.\nSuas regras.', config: 'Dê ao seu espaço\na sua assinatura.', continuidade: 'Seus dados.\nSempre com você.'};
    $('.menu-routes').querySelectorAll('button').forEach(button => {
      const highlight = () => {$('#menuStoryTitle').textContent = descriptions[button.dataset.route];$('.story-focus').dataset.route = button.dataset.route;};
      button.addEventListener('pointerenter', highlight);
      button.addEventListener('focus', highlight);
    });
    $('#headerFilter').onclick = () => $('#openFilters').click();
    $('#headerSearch').onclick = async () => {await change('atividades');$('#search').focus();};
    document.addEventListener('click', event => {
      if (event.target.closest('#exploreDashboard')) $('.stats').scrollIntoView({behavior: reduced.matches ? 'instant' : 'smooth', block: 'center'});
    });
    document.addEventListener('pointermove', event => {
      if (reduced.matches || event.pointerType === 'touch') return;
      const stage = event.target.closest('.hero-stage');
      if (!stage) return;
      const box = stage.getBoundingClientRect();
      stage.style.setProperty('--mx', ((event.clientX - box.left) / box.width - .5) * 22 + 'px');
      stage.style.setProperty('--my', ((event.clientY - box.top) / box.height - .5) * 18 + 'px');
    });
    document.addEventListener('pointerout', event => {const stage=event.target.closest('.hero-stage');if(stage&&!stage.contains(event.relatedTarget)){stage.style.setProperty('--mx','0px');stage.style.setProperty('--my','0px');}});
    let scrollFrame;
    window.addEventListener('scroll', () => {
      if (scrollFrame || reduced.matches) return;
      scrollFrame = requestAnimationFrame(() => {scrollFrame = null;$('.hero-stage')?.style.setProperty('--scroll-y', Math.min(window.scrollY * .17, 95) + 'px');});
    }, {passive: true});
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}}), {threshold: .08});
    const observe = () => $('#content').querySelectorAll('.dashboard-grid>.panel:not([data-reveal])').forEach((node,i) => {node.dataset.reveal='';node.style.setProperty('--reveal-delay',i % 2 * 80+'ms');observer.observe(node);});
    new MutationObserver(observe).observe($('#content'), {childList: true});
    observe();
  }
  return {init, navigate: (page, view) => change(page, view), switchView: view => change('atividades', view), openMenu, closeMenu, get settled() {return settled;}};
})();
