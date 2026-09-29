window.EBX = window.EBX || {};
EBX.Game = (() => {
  const { LEVELS } = EBX.CONFIG;
  const Storage = EBX.Storage;
  const UI = EBX.UI;

  function levelFor(points) {
    let lvl = LEVELS[0];
    for (const l of LEVELS) if (points >= l.min) lvl = l;
    return lvl;
  }
  function nextLevel(points) {
    return LEVELS.find((l) => l.min > points) || null;
  }

  function addPoints(n, reason = '') {
    const s = Storage.read();
    s.points += n;
    s.level = levelFor(s.points).name;
    Storage.write(s);
    if (reason) UI.toast(`+${n} pontos — ${reason}`);
    return s;
  }

  function awardBadge(id) {
    const s = Storage.read();
    if (s.badges.includes(id)) return false;
    s.badges.push(id);
    Storage.write(s);
    UI.toast(`🏆 Nova conquista desbloqueada!`);
    return true;
  }

  function updateHUD() {
    const s = Storage.read();
    document.getElementById('hud-points').textContent = s.points;
    document.getElementById('hud-level').textContent = s.level;
  }

  document.addEventListener('ebx:state-changed', updateHUD);

  return { levelFor, nextLevel, addPoints, awardBadge, updateHUD };
})();