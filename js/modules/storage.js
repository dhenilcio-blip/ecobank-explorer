window.EBX = window.EBX || {};
EBX.Storage = (() => {
  const KEY = EBX.CONFIG.STORAGE_KEY;

  const defaultState = () => ({
    points: 0,
    level: 'Bronze',
    badges: [],
    missionsDone: [],
    quizzesDone: [],
    visitedAgencies: [],
    createdAt: Date.now()
  });

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
    } catch { return defaultState(); }
  }
  function write(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
    document.dispatchEvent(new CustomEvent('ebx:state-changed', { detail: state }));
  }
  function reset() { localStorage.removeItem(KEY); }

  return { read, write, reset, defaultState };
})();