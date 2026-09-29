window.EBX = window.EBX || {};
EBX.Screens = EBX.Screens || {};

EBX.Screens.quiz = () => {
  const { el, svg } = EBX.UI;
  const root = el('div', { class: 'screen' });
  const total = EBX.Data.quiz.length;
  let current = 0;
  let answers = {};
  let selected = null;

  render();

  function render() {
    root.innerHTML = '';
    const q = EBX.Data.quiz[current];

    // Hero
    const hero = el('div', { class: 'quiz-hero' });
    hero.appendChild(el('div', {
      style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:16px',
    }, [
      el('button', {
        class: 'icon-btn',
        html: svg('back'),
        style: 'background:#fff;border-radius:50%;width:42px;height:42px;box-shadow:var(--sh-sm)',
        onclick: () => { location.hash = '#home'; },
      }),
      el('div', { style: 'text-align:center' }, [
        el('div', { style: 'font-weight:700;font-size:16px' },
          ['Ecobank ', el('b', { style: 'color:var(--blue-600)' }, 'Explorer')]),
        el('div', { style: 'font-size:11px;color:var(--muted)' }, 'Avaliação Final'),
      ]),
      el('button', {
        class: 'icon-btn', html: svg('menu'),
        style: 'background:#fff;border-radius:50%;width:42px;height:42px;box-shadow:var(--sh-sm)',
      }),
    ]));
    hero.appendChild(el('h1', {}, 'Avaliação Final'));
    hero.appendChild(el('p', {}, 'Testa os teus conhecimentos e conclui a tua jornada Ecobank Explorer.'));

    hero.appendChild(el('div', { class: 'quiz-stats' }, [
      stat('clipboard', '5 Perguntas'),
      stat('clock', '~10 Minutos'),
      stat('badge', 'Obter Certificado'),
    ]));
    root.appendChild(hero);

    // Corpo do quiz
    const body = el('div', { class: 'quiz-body' });

    const pctDone = Math.round((current / total) * 100);
    body.appendChild(el('div', { class: 'quiz-top' }, [
      el('span', {}, ['Pergunta ', el('b', {}, `${current + 1}`), ` de ${total}`]),
      el('span', {}, `${pctDone}% concluído`),
    ]));
    body.appendChild(el('div', { class: 'progress' }, [
      el('i', { style: `width:${pctDone}%` }),
    ]));

    // Cartão de pergunta
    const card = el('div', { class: 'quiz-q-card' });
    card.appendChild(el('div', { class: 'quiz-q-head' }, [
      el('div', { class: 'ic', html: svg('book') }),
      el('div', {}, [
        el('span', { class: 'chip' }, q.category),
        el('h3', { style: 'margin-top:6px' }, q.q),
      ]),
    ]));

    const optionsBox = el('div', { class: 'quiz-options' });
    q.options.forEach((opt, i) => {
      const btn = el('button', {
        class: 'quiz-option' + (selected === i ? ' selected' : ''),
        onclick: () => {
          if (selected !== null) return;
          selected = i;
          const correct = q.correct;
          const parent = btn.parentElement;
          [...parent.children].forEach((c) => c.classList.remove('selected'));
          btn.classList.add('selected');
          if (i === correct) btn.classList.add('correct');
          else {
            btn.classList.add('wrong');
            parent.children[correct].classList.add('correct');
          }
          const nextBtn = root.querySelector('#quiz-next');
          if (nextBtn) nextBtn.innerHTML = '';
          setTimeout(() => {
            const nb = root.querySelector('#quiz-next');
            if (nb) nb.textContent = current === total - 1 ? 'Terminar' : 'Próxima pergunta';
          }, 0);
        },
      }, [
        el('span', { class: 'radio' }),
        el('span', {}, opt),
      ]);
      optionsBox.appendChild(btn);
    });
    card.appendChild(optionsBox);

    card.appendChild(el('button', {
      id: 'quiz-next',
      class: 'btn',
      style: 'margin-top:20px',
      onclick: () => {
        if (selected === null) return;
        answers[current] = selected;
        if (current < total - 1) {
          current++;
          selected = null;
          render();
        } else {
          finish(answers);
        }
      },
    }, current === total - 1 ? 'Terminar' : 'Próxima pergunta'));

    body.appendChild(card);

    // Dica
    body.appendChild(el('div', { class: 'quiz-tip' }, [
      el('div', { class: 'ic', html: svg('bulb') }),
      el('div', {}, [
        el('b', {}, 'Dica'),
        el('p', {}, q.tip),
      ]),
    ]));

    root.appendChild(body);
  }

  function stat(icon, label) {
    return el('div', { class: 'quiz-stat' }, [
      el('span', { html: svg(icon), style: 'color:var(--blue-600)' }),
      el('b', {}, label),
    ]);
  }

  function finish(ans) {
    let correctCount = 0;
    EBX.Data.quiz.forEach((q, i) => {
      if (ans[i] === q.correct) correctCount++;
    });
    EBX.State.update((s) => {
      s.quizAnswers = ans;
      s.quizScore = correctCount;
      if (correctCount >= 4) {
        if (!s.completedChapters.includes('assessment')) s.completedChapters.push('assessment');
      }
    });
    const pct = Math.round((correctCount / total) * 100);
    if (pct >= 80) {
      EBX.State.update((s) => { s.certificateName = s.user.name; });
      location.hash = '#certificate';
    } else {
      alert(`Acertaste ${correctCount}/${total}. Precisas de 4/5 para obter o certificado. Tenta novamente.`);
      location.hash = '#home';
    }
  }

  return { node: root, noHeader: true, noNav: true };
};