window.EBX = window.EBX || {};
EBX.Screens = EBX.Screens || {};

EBX.Screens.chapter = (id) => {
  const { el, svg } = EBX.UI;
  const ch = EBX.Data.chapters.find((c) => c.id === id);
  if (!ch) { location.hash = '#home'; return { node: el('div') }; }

  EBX.State.visitChapter(id);

  const root = el('div', { class: 'screen' });

  // Hero
  const hero = el('div', { class: 'chapter-hero' });
  hero.appendChild(el('div', { class: 'top' }, [
    el('button', {
      class: 'nav-round',
      html: svg('back'),
      onclick: () => { location.hash = '#home'; },
    }),
    ch.heroTag ? el('div', { class: 'badge-float' }, [
      el('span', { html: svg(ch.icon) }),
      el('div', {}, [
        el('b', {}, ch.heroTag),
        el('span', {}, `Capítulo ${ch.number}`),
      ]),
    ]) : el('div'),
  ]));

  hero.appendChild(el('span', { class: 'ch-label-hero' }, `Capítulo ${ch.number}`));
  hero.appendChild(el('h1', {}, ch.heroTitle));
  hero.appendChild(el('p', {}, ch.heroSub));
  root.appendChild(hero);

  // Info grid (sobrepõe o hero)
  const grid = el('div', { class: 'info-grid' });
  grid.appendChild(el('div', { class: 'info-card' }, [
    el('div', { class: 'h' }, [
      el('span', { html: svg('pin') }),
      el('b', {}, 'Localização'),
    ]),
    el('p', {}, ch.location),
    el('a', { class: 'link', href: '#home' }, ['Ver no mapa', el('span', { html: svg('chev') })]),
  ]));
  grid.appendChild(el('div', { class: 'info-card' }, [
    el('div', { class: 'h' }, [
      el('span', { html: svg('clock') }),
      el('b', {}, 'Horário de funcionamento'),
    ]),
    ...ch.hours.map(([d, h]) => el('div', { class: 'row' }, [
      el('span', {}, d),
      el('b', {}, h),
    ])),
  ]));
  root.appendChild(grid);

  // Descrição
  const descWrap = el('div', { class: 'container', style: 'padding-top:24px' });
  descWrap.appendChild(el('p', { class: 'body' }, ch.description));
  root.appendChild(descWrap);

  // Serviços
  const servWrap = el('div', { class: 'container' });
  servWrap.appendChild(el('div', { class: 'section-title' }, [
    el('h3', {}, 'Serviços disponíveis'),
  ]));
  const scroll = el('div', { class: 'services-scroll' });
  ch.services.forEach((s) => {
    scroll.appendChild(el('div', { class: 'service-pill' }, [
      el('span', { html: svg(ch.icon) }),
      el('span', {}, s),
    ]));
  });
  servWrap.appendChild(scroll);
  root.appendChild(servWrap);

  // CTA
  const cta = el('div', { class: 'container', style: 'padding-top:12px' });
  cta.appendChild(el('button', {
    class: 'btn',
    onclick: () => {
      if (ch.isQuiz) {
        location.hash = '#quiz';
      } else if (ch.id === 'raceit') {
        location.hash = '#values';
      } else {
        EBX.State.markChapterDone(ch.id);
        location.hash = '#home';
      }
    },
  }, [
    ch.isQuiz ? 'Iniciar Avaliação'
      : (ch.id === 'raceit' ? 'Ver Valores' : 'Marcar como concluído'),
    el('span', { html: svg('arrow') }),
  ]));
  root.appendChild(cta);

  return { node: root, noHeader: true, noNav: true };
};