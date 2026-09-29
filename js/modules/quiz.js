window.EBX = window.EBX || {};
EBX.Quiz = (() => {
  let current = null;

  async function render(container) {
    const quizzes = await EBX.Content.get('quizzes');
    const s = EBX.Storage.read();

    container.innerHTML = `<h2>❓ Quizzes</h2>`;
    quizzes.forEach((q) => {
      const done = s.quizzesDone.includes(q.id);
      const card = EBX.UI.el('div', { class: 'card' }, [
        EBX.UI.el('h3', {}, q.titulo),
        EBX.UI.el('p', {}, q.descricao || ''),
        EBX.UI.el('div', {}, [
          EBX.UI.el('span', { class: 'tag' }, `+${q.pontos} pts`),
          EBX.UI.el('span', { class: 'tag' }, done ? '✅ Feito' : '▶️ Disponível')
        ]),
        EBX.UI.el('button', {
          class: 'btn', style: 'margin-top:10px',
          onclick: () => start(q)
        }, done ? 'Repetir' : 'Começar')
      ]);
      container.appendChild(card);
    });
  }

  function start(quiz) {
    current = { quiz, index: 0, correct: 0 };
    showQuestion();
  }

  function showQuestion() {
    const { quiz, index } = current;
    if (index >= quiz.perguntas.length) return finish();

    const p = quiz.perguntas[index];
    const html = `
      <h3>${quiz.titulo}</h3>
      <p><b>Pergunta ${index + 1}/${quiz.perguntas.length}</b></p>
      <p>${p.pergunta}</p>
      <div id="quiz-options"></div>
    `;
    EBX.UI.openModal(html);

    const box = document.getElementById('quiz-options');
    p.opcoes.forEach((op, i) => {
      const btn = EBX.UI.el('button', {
        class: 'quiz-option',
        onclick: (e) => answer(i, p.correta, e.currentTarget)
      }, op);
      box.appendChild(btn);
    });
  }

  function answer(selected, correct, btn) {
    const parent = btn.parentElement;
    [...parent.children].forEach((c) => c.disabled = true);

    if (selected === correct) {
      btn.classList.add('correct');
      current.correct++;
    } else {
      btn.classList.add('wrong');
      parent.children[correct].classList.add('correct');
    }

    setTimeout(() => {
      current.index++;
      showQuestion();
    }, 900);
  }

  function finish() {
    const { quiz, correct } = current;
    const total = quiz.perguntas.length;
    const perfect = correct === total;

    const s = EBX.Storage.read();
    if (!s.quizzesDone.includes(quiz.id)) {
      s.quizzesDone.push(quiz.id);
      EBX.Storage.write(s);
      EBX.Game.addPoints(quiz.pontos, quiz.titulo);
      if (perfect) EBX.Game.awardBadge('perfeito');
    }

    EBX.UI.openModal(`
      <h3>Resultado</h3>
      <p>Acertaste <b>${correct}/${total}</b>.</p>
      <p>${perfect ? '🎉 Perfeito!' : 'Continua a tentar!'}</p>
      <button class="btn" onclick="EBX.UI.closeModal();EBX.Router.render()">Fechar</button>
    `);
  }

  return { render, start };
})();