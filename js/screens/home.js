window.EBX = window.EBX || {};
EBX.Screens = EBX.Screens || {};

EBX.Screens.home = () => {
  const { el, svg } = EBX.UI;
  const s = EBX.State.read();
  const pct = EBX.State.progressPct();
  const total = EBX.Data.chapters.length;
  const done = s.completedChapters.length;

  const root = el('div', { class: 'screen' });

// Header
root.appendChild(el('header', { class: 'app-header' }, [
  el('img', {
    src: 'assets/images/logo-ecobank.png',
    alt: 'Ecobank Explorer',
    class: 'header-logo-img',
  }),
  el('div', { class: 'spacer' }),
  el('button', { class: 'icon-btn', html: svg('bell') }),
]));

  // Hero
  const hero = el('div', { class: 'home-hero' });
  hero.appendChild(el('div', { class: 'home-greet' }, [
    el('div', { class: 'avatar' }, s.user.initials),
    el('div', { class: 'info' }, [
      el('small', {}, 'Bem-vindo de volta,'),
      el('b', {}, s.user.name.split(' ')[0]),
    ]),
  ]));

  hero.appendChild(el('div', {}, [
    el('h1', { class: 'h1', style: 'margin-bottom:6px' }, 'Continua a tua jornada'),
    el('p', { class: 'body' }, 'Aprende. Explora. Cresce. Juntos por um São Tomé e Príncipe mais forte.'),
  ]));

  root.appendChild(hero);

  // Progresso
  const progressCard = el('div', { class: 'progress-card container' });
  progressCard.appendChild(el('div', { class: 'head' }, [
    el('span', { html: svg('clipboard') }),
    el('b', {}, 'O teu progresso de aprendizagem'),
    el('span', {}, `${done} de ${total} módulos`),
  ]));
  progressCard.appendChild(el('div', { class: 'pct-row' }, [
    el('span', { class: 'pct' }, `${pct}%`),
    el('span', { class: 'lbl' }, 'Completo'),
  ]));
  progressCard.appendChild(el('div', { class: 'progress thick' }, [
    el('i', { style: `width:${pct}%` }),
  ]));
  progressCard.appendChild(el('div', { class: 'quote' }, [
    el('span', {}, '❝ "O conhecimento cria oportunidades."'),
    el('b', {}, 'Continuar →'),
  ]));
  root.appendChild(progressCard);

  // Capítulos
  const chaptersWrap = el('div', { class: 'container' });
  chaptersWrap.appendChild(el('div', { class: 'section-title' }, [
    el('h3', {}, 'A tua jornada'),
    el('a', { href: '#values' }, 'Ver valores →'),
  ]));

  const list = el('div', { class: 'chapters-list' });
  EBX.Data.chapters.forEach((ch) => {
    const isDone = s.completedChapters.includes(ch.id);
    list.appendChild(chapterItem(ch, isDone));
  });
  chaptersWrap.appendChild(list);
  root.appendChild(chaptersWrap);

  function chapterItem(ch, isDone) {
    return el('div', {
      class: 'chapter-item' + (isDone ? ' done' : ''),
      onclick: () => { location.hash = '#chapter/' + ch.id; },
    }, [
      el('div', { class: 'ico', html: svg(ch.icon) }),
      el('div', { class: 'info' }, [
        el('div', { class: 'ch-label' }, `Capítulo ${ch.number}`),
        el('b', {}, ch.title),
        el('span', {}, ch.subtitle),
      ]),
      el('div', { class: 'right' }, [
        el('span', { class: 'dur' }, [
          el('span', { html: svg('clock') }),
          ch.duration,
        ]),
        el('span', { class: 'chev', html: svg('chev') }),
      ]),
    ]);
  }

  return { node: root, noHeader: true, noNav: true, activeTab: 'home' };
};