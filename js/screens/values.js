window.EBX = window.EBX || {};
EBX.Screens = EBX.Screens || {};

EBX.Screens.values = () => {
  const { el, svg } = EBX.UI;
  const root = el('div', { class: 'screen' });

  // Hero
  const hero = el('div', { class: 'values-hero' });
  hero.appendChild(el('div', {
    class: 'top',
    style: 'display:flex;justify-content:space-between;margin-bottom:20px;position:relative;z-index:1',
  }, [
    el('button', {
      class: 'nav-round',
      html: svg('back'),
      style: 'background:rgba(255,255,255,.18)',
      onclick: () => { location.hash = '#home'; },
    }),
    el('button', {
      class: 'nav-round',
      html: svg('menu'),
      style: 'background:rgba(255,255,255,.18)',
    }),
  ]));
  hero.appendChild(el('div', { class: 'overline' }, 'A Nossa Gente. Os Nossos Valores. Um Amanhã Melhor.'));
  hero.appendChild(el('h1', {}, 'Valores RACE IT'));
  hero.appendChild(el('div', { class: 'sub' }, 'Seis valores. Um Ecobank mais forte.'));
  hero.appendChild(el('p', {}, 'Os nossos valores RACE IT orientam a forma como trabalhamos, servimos os nossos clientes e criamos um impacto positivo em São Tomé e Príncipe e em toda a África.'));
  root.appendChild(hero);

  // Grid
  const grid = el('div', { class: 'values-grid' });
  EBX.Data.values.forEach((v) => {
    grid.appendChild(el('div', { class: 'value-card' }, [
      el('div', { class: 'vico', html: svg(v.icon), style: `background:${v.color}` }),
      el('b', {}, v.name),
      el('p', {}, v.desc),
      el('div', { class: 'learn' }, ['Saber mais', el('span', { html: svg('chev') })]),
    ]));
  });
  root.appendChild(grid);

  // Citação
  root.appendChild(el('div', { class: 'values-quote' }, [
    el('div', { class: 'q' }, 'Os nossos valores criam oportunidades.'),
    el('div', { class: 'a' }, 'Um São Tomé e Príncipe mais forte, juntos.'),
  ]));

  // CTA
  const cta = el('div', { class: 'container' });
  cta.appendChild(el('button', {
    class: 'btn',
    onclick: () => {
      EBX.State.markChapterDone('raceit');
      location.hash = '#home';
    },
  }, ['Marcar como concluído', el('span', { html: svg('arrow') })]));
  root.appendChild(cta);

  return { node: root, noHeader: true, noNav: true, activeTab: 'learn' };
};