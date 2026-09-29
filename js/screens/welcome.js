window.EBX = window.EBX || {};
EBX.Screens = EBX.Screens || {};

EBX.Screens.welcome = () => {
    const { el, svg } = EBX.UI;
    const wrap = el('div', { class: 'welcome' });

    wrap.appendChild(el('div', { class: 'welcome-header' }, [
        el('img', {
            src: 'assets/images/logo-ecobank.png',
            alt: 'Ecobank Explorer',
            class: 'welcome-logo-img',
        }),
    ]));

    wrap.appendChild(el('div', { class: 'welcome-body' }, [
        el('span', { class: 'chip-welcome' }, 'Bem-vindo a'),
        el('h1', { class: 'w-title' }, 'Balcão Central Ecobank'),
        el('div', { class: 'w-loc' }, [
            el('span', { html: svg('pin') }),
            el('span', {}, 'São Tomé, São Tomé e Príncipe'),
        ]),
        el('p', { class: 'w-desc' }, 'Descobre a nossa agência, os serviços e como empoderamos a nossa comunidade.'),
        el('button', {
            class: 'btn btn-w',
            onclick: () => {
                EBX.State.update((s) => { s.started = true; });
                location.hash = '#home';
            },
        }, [
            'Explorar Agência',
            el('span', { html: svg('arrow') }),
        ]),
        el('div', { class: 'welcome-features' }, [
            feature('bank', 'Agência Moderna', 'Desenhada para uma melhor experiência bancária.'),
            feature('users', 'Cliente Primeiro', 'Estamos aqui para te apoiar.'),
            feature('shield', 'Seguro e Fiável', 'A tua segurança é a nossa prioridade.'),
        ]),
    ]));

    function feature(icon, title, desc) {
        return el('div', { class: 'f' }, [
            el('div', { class: 'ic', html: svg(icon) }),
            el('b', {}, title),
            el('span', {}, desc),
        ]);
    }

    return { node: wrap, noNav: true, noHeader: true };
};