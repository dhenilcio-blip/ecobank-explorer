window.EBX = window.EBX || {};
EBX.Screens = EBX.Screens || {};

EBX.Screens.explore = () => {
  const { el, svg } = EBX.UI;
  const root = el('div', { class: 'screen' });

  const wrap = el('div', { class: 'explore-screen' });

  // ---------- HEADER ----------
  wrap.appendChild(el('div', { class: 'explore-header' }, [
    el('h1', {}, 'Explorar'),
    el('p', {}, 'As nossas agências, serviços e contactos em São Tomé e Príncipe.'),
  ]));

  // ---------- AGÊNCIAS ----------
  wrap.appendChild(el('div', { class: 'explore-section-title' }, [
    el('h3', {}, 'Agências'),
    el('span', { class: 'chip' }, `${EBX.Data.agencies.length} balcões`),
  ]));

  const agencyList = el('div', { class: 'explore-list' });
  EBX.Data.agencies.forEach((a) => {
    agencyList.appendChild(agencyCard(a));
  });
  wrap.appendChild(agencyList);

// ---------- FOOTER ----------
wrap.appendChild(el('div', { class: 'explore-footer' }, [
  el('img', {
    src: 'assets/images/logo-ecobank.png',
    alt: 'Ecobank São Tomé e Príncipe',
    class: 'explore-footer-logo',
  }),
  el('div', { class: 'brand-tag' }, 'People. Progress. Prosperity.'),
]));

  root.appendChild(wrap);
  return { node: root, noHeader: true, noNav: true, activeTab: 'explore' };

  // ---------- helpers ----------
  function agencyCard(a) {
    return el('div', { class: 'agency-card' + (a.flagship ? ' flagship' : '') }, [
      a.flagship && el('span', { class: 'agency-flag' }, 'Sede'),
      el('div', { class: 'agency-head' }, [
        el('div', { class: 'agency-ic', html: svg('bank') }),
        el('div', { class: 'agency-name' }, [
          el('b', {}, a.name),
          el('span', {}, a.address),
        ]),
      ]),
      el('div', { class: 'agency-rows' }, [
        row('clock', a.hours),
        row('bell', a.phone),
      ]),
      el('div', { class: 'agency-tags' },
        a.services.map((s) => el('span', { class: 'tag' }, s))
      ),
      el('div', { class: 'agency-actions' }, [
        el('a', {
          class: 'agency-btn primary',
          href: a.maps,
          target: '_blank',
          rel: 'noopener',
        }, [
          el('span', { html: svg('pin') }),
          'Ver no mapa',
        ]),
        el('a', {
          class: 'agency-btn ghost',
          href: 'tel:' + a.phone.replace(/\s/g, ''),
        }, [
          el('span', { html: svg('bell') }),
          'Ligar',
        ]),
      ]),
    ]);
  }

  function row(icon, text) {
    return el('div', { class: 'agency-row' }, [
      el('span', { class: 'agency-row-ic', html: svg(icon) }),
      el('span', {}, text),
    ]);
  }
};