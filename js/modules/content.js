window.EBX = window.EBX || {};
EBX.Content = (() => {
  async function load(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Falha a carregar ${path}`);
    return res.json();
  }
  const cache = {};
  async function get(name) {
    if (cache[name]) return cache[name];
    const data = await load(`js/data/${name}.json`);
    cache[name] = data;
    return data;
  }
  return { get };
})();