window.EBX = window.EBX || {};
EBX.State = (() => {
  const KEY = 'ebx_state_v2';
  const defaults = () => ({
    user: EBX.Data.user,
    started: false,
    completedChapters: [],
    visitedChapters: [],
    quizAnswers: {},
    quizScore: null,
    certificateName: null,
  });

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...defaults(), ...JSON.parse(raw) } : defaults();
    } catch { return defaults(); }
  }
  function write(s) {
    localStorage.setItem(KEY, JSON.stringify(s));
    document.dispatchEvent(new CustomEvent('ebx:state'));
  }
  function update(fn) {
    const s = read();
    fn(s);
    write(s);
    return s;
  }
  function reset() { localStorage.removeItem(KEY); }

  function progressPct() {
    const s = read();
    return Math.round((s.completedChapters.length / EBX.Data.chapters.length) * 100);
  }

  function markChapterDone(id) {
    update((s) => {
      if (!s.completedChapters.includes(id)) s.completedChapters.push(id);
      if (!s.visitedChapters.includes(id)) s.visitedChapters.push(id);
    });
  }

  function visitChapter(id) {
    update((s) => {
      if (!s.visitedChapters.includes(id)) s.visitedChapters.push(id);
    });
  }

  return { read, write, update, reset, progressPct, markChapterDone, visitChapter };
})();