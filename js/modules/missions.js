window.EBX = window.EBX || {};
EBX.Missions = (() => {
  async function render(container) {
    const missoes = await EBX.Content.get('missoes');
    const s = EBX.Storage.read();

    container.innerHTML = `<h2>🎯 Missões</h2>`;

    missoes.forEach((m) => {
      const done = s.missionsDone.includes(m.id);
      const card = EBX.UI.el('div', { class: 'card' }, [
        EBX.UI.el('h3', {}, m.titulo),
        EBX.UI.el('p', {}, m.descricao),
        EBX.UI.el('div', {}, [
          EBX.UI.el('span', { class: 'tag' }, `+${m.pontos} pts`),
          EBX.UI.el('span', { class: 'tag' }, done ? '✅ Concluída' : '⏳ Pendente')
        ]),
        !done && EBX.UI.el('button', {
          class: 'btn', style: 'margin-top:10px',
          onclick: () => complete(m)
        }, 'Concluir missão')
      ]);
      container.appendChild(card);
    });
  }

  function complete(m) {
    const s = EBX.Storage.read();
    if (s.missionsDone.includes(m.id)) return;
    s.missionsDone.push(m.id);
    EBX.Storage.write(s);
    EBX.Game.addPoints(m.pontos, m.titulo);
    if (s.missionsDone.length >= 3) EBX.Game.awardBadge('missionario');
    EBX.Router.render();
  }

  return { render, complete };
})();