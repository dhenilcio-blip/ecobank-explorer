window.EBX = window.EBX || {};
EBX.Screens = EBX.Screens || {};

EBX.Screens.certificate = () => {
    const { el, svg } = EBX.UI;
    const s = EBX.State.read();
    const root = el('div', { class: 'screen' });
    const name = s.certificateName || s.user.name;
    const today = new Date().toLocaleDateString('pt-PT', {
        day: '2-digit', month: 'long', year: 'numeric',
    });
    const done = s.completedChapters.length;
    const total = EBX.Data.chapters.length;
    const pct = EBX.State.progressPct();
    const score = s.quizScore != null ? `${s.quizScore}/${EBX.Data.quiz.length}` : '—';
    const hasCertificate = s.quizScore != null && s.quizScore >= 4;

    const wrap = el('div', { class: 'profile-screen' });

    // ---------- HEADER ----------
    wrap.appendChild(el('div', { class: 'profile-header' }, [
        el('div', { class: 'profile-header-title' }, 'Perfil'),
        el('button', { class: 'icon-btn', html: svg('menu') }),
    ]));

    // ---------- USER CARD ----------
    wrap.appendChild(el('div', { class: 'profile-user' }, [
        el('div', { class: 'avatar' }, s.user.initials),
        el('div', { class: 'info' }, [
            el('b', {}, s.user.name),
            el('span', {}, s.user.role || 'Colaborador'),
            el('small', {}, 'henilcio.mendes@ecobank.com'),
        ]),
    ]));

    // ---------- STATS ----------
    wrap.appendChild(el('div', { class: 'profile-stats' }, [
        stat(`${pct}%`, 'Progresso'),
        stat(`${done}/${total}`, 'Capítulos'),
        stat(score, 'Avaliação'),
    ]));

    // ---------- PROGRESS BAR ----------
    wrap.appendChild(el('div', { class: 'profile-block' }, [
        el('div', { class: 'block-head' }, [
            el('span', {}, 'Progresso geral'),
            el('b', {}, `${pct}%`),
        ]),
        el('div', { class: 'progress thick' }, [
            el('i', { style: `width:${pct}%` }),
        ]),
    ]));

    // ---------- CERTIFICATE ----------
    if (hasCertificate) {
        wrap.appendChild(el('div', { class: 'profile-section-title' }, [
            el('h3', {}, 'Certificado'),
            el('span', { class: 'chip green' }, 'Emitido'),
        ]));

        const frame = el('div', { class: 'cert-frame' });
        const inner = el('div', { class: 'cert-inner' });

        inner.appendChild(el('div', { class: 'cert-brand' }, [
            el('div', { class: 'cert-brand-name' }, 'Ecobank'),
            el('div', { class: 'cert-brand-sub' }, 'São Tomé e Príncipe'),
        ]));

        inner.appendChild(el('div', { class: 'cert-body' }, [
            el('div', { class: 'cert-sub' }, 'Certificado de Conclusão'),
            el('div', { class: 'cert-title' }, 'Ecobank Explorer'),
            el('div', { class: 'cert-line' }),
            el('div', { class: 'cert-certifies' }, 'Certifica-se que'),
            el('div', { class: 'cert-name' }, name),
            el('p', { class: 'cert-desc' },
                'concluiu com sucesso a jornada de aprendizagem do Ecobank Explorer, demonstrando compromisso com o conhecimento, o crescimento e um amanhã melhor.'),
        ]));

        inner.appendChild(el('div', { class: 'cert-footer' }, [
            el('div', { class: 'cert-col' }, [
                el('span', { class: 'cert-label' }, 'Data'),
                el('b', {}, today),
            ]),
            el('div', { class: 'cert-col' }, [
                el('span', { class: 'cert-label' }, 'Gestor Nacional'),
                el('b', {}, 'Ecobank STP'),
            ]),
        ]));

        frame.appendChild(inner);
        wrap.appendChild(frame);

        wrap.appendChild(el('div', { class: 'cert-actions-row' }, [
            el('button', {
                class: 'btn',
                onclick: () => window.print(),
            }, [el('span', { html: svg('download') }), 'Descarregar']),
            el('button', {
                class: 'btn ghost',
                onclick: async () => {
                    const text = `Concluí o Ecobank Explorer — ${name}`;
                    if (navigator.share) {
                        try { await navigator.share({ title: 'Ecobank Explorer', text }); } catch { }
                    } else {
                        navigator.clipboard.writeText(text);
                        alert('Mensagem copiada!');
                    }
                },
            }, [el('span', { html: svg('share') }), 'Partilhar']),
        ]));
    } else {
        wrap.appendChild(el('div', { class: 'profile-section-title' }, [
            el('h3', {}, 'Certificado'),
        ]));
        wrap.appendChild(el('div', { class: 'profile-empty' }, [
            el('div', { class: 'empty-ic', html: svg('badge') }),
            el('b', {}, 'Certificado ainda não emitido'),
            el('p', {}, 'Conclui os 5 capítulos e acerta 4 ou mais perguntas na avaliação final para receber o certificado.'),
            el('a', { href: '#home', class: 'btn ghost', style: 'margin-top:12px' },
                'Voltar à jornada'),
        ]));
    }
    // ---------- LOGOUT ----------
    wrap.appendChild(el('div', { class: 'profile-logout' }, [
        el('button', {
            class: 'logout-btn',
            onclick: () => {
                if (confirm('Terminar sessão? O teu progresso fica guardado.')) {
                    EBX.State.update((s) => { s.started = false; });
                    location.hash = '#welcome';
                }
            },
        }, 'Terminar sessão'),
    ]));

    root.appendChild(wrap);
    return { node: root, noHeader: true, noNav: true, activeTab: 'profile' };

    // ---------- helpers ----------
    function stat(value, label) {
        return el('div', { class: 'p-stat' }, [
            el('b', {}, value),
            el('span', {}, label),
        ]);
    }

    function option(icon, title, sub) {
        return el('div', { class: 'p-option' }, [
            el('div', { class: 'p-option-ic', html: svg(icon) }),
            el('div', { class: 'p-option-body' }, [
                el('b', {}, title),
                el('span', {}, sub),
            ]),
            el('span', { class: 'p-option-chev', html: svg('chev') }),
        ]);
    }
};