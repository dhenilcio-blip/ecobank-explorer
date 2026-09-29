window.EBX = window.EBX || {};
EBX.Map = (() => {
  let map, markers = [];

  async function init(container) {
    const agencias = await EBX.Content.get('agencias');
    const stp = [0.3361, 6.7303]; // São Tomé

    map = L.map(container, { zoomControl: true }).setView(stp, 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19
    }).addTo(map);

    agencias.forEach((a) => {
      const marker = L.marker([a.lat, a.lng]).addTo(map);
      marker.bindPopup(`
        <b>${a.nome}</b><br>
        ${a.endereco}<br>
        <small>📞 ${a.telefone}</small><br>
        <small>🕒 ${a.horario}</small><br>
        <button class="btn" style="margin-top:6px;padding:6px 12px;font-size:.8rem"
          onclick="EBX.Map.visit('${a.id}')">Marcar visita (+10 pts)</button>
      `);
      markers.push({ id: a.id, marker });
    });

    // Corrige tamanho após montagem
    setTimeout(() => map.invalidateSize(), 200);
  }

  function visit(id) {
    const s = EBX.Storage.read();
    if (s.visitedAgencies.includes(id)) {
      EBX.UI.toast('Já visitaste esta agência.');
      return;
    }
    s.visitedAgencies.push(id);
    EBX.Storage.write(s);
    EBX.Game.addPoints(10, 'Visita a agência');
    if (s.visitedAgencies.length >= 3) EBX.Game.awardBadge('explorador');
  }

  function focus(id) {
    const m = markers.find((x) => x.id === id);
    if (m && map) {
      map.setView(m.marker.getLatLng(), 16);
      m.marker.openPopup();
    }
  }

  return { init, visit, focus };
})();