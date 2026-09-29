window.EBX = window.EBX || {};

EBX.Nav = (() => {
  const { el, svg } = EBX.UI;
  const items = [
    { id: 'home',    label: 'Home',    icon: 'home',    hash: '#home' },
    { id: 'learn',   label: 'Learn',   icon: 'book',    hash: '#values' },
    { id: 'explore', label: 'Explore', icon: 'compass', hash: '#explore' },
    { id: 'profile', label: 'Profile', icon: 'user',    hash: '#certificate' },
  ];
  function render(active) {
    const nav = el('nav', { class: 'bottom-nav' });
    items.forEach((it) => {
      nav.appendChild(el('a', {
        href: it.hash,
        class: active === it.id ? 'active' : '',
      }, [
        el('span', { html: svg(it.icon) }),
        el('span', {}, it.label),
      ]));
    });
    return nav;
  }
  return { render };
})();

EBX.Router = (() => {
  const app = document.getElementById('app');
  const navSlot = document.getElementById('nav-slot');

  function parseHash() {
    const raw = location.hash.replace(/^#/, '') || 'welcome';
    const [route, param] = raw.split('/');
    return { route, param };
  }

  function render() {
    const { route, param } = parseHash();
    const s = EBX.State.read();

    let screen;
    if (!s.started && route !== 'home') screen = EBX.Screens.welcome();
    else {
      switch (route) {
        case 'welcome':     screen = EBX.Screens.welcome(); break;
        case 'home':        screen = EBX.Screens.home(); break;
        case 'chapter':     screen = EBX.Screens.chapter(param); break;
        case 'values':      screen = EBX.Screens.values(); break;
        case 'quiz':        screen = EBX.Screens.quiz(); break;
          case 'explore':     screen = EBX.Screens.explore(); break;
        case 'certificate': screen = EBX.Screens.certificate(); break;
        default:            screen = EBX.Screens.home(); break;
      }
    }

    // Conteúdo
    app.innerHTML = '';
    app.appendChild(screen.node);

    // Nav — fora do #app, sempre fixo
    navSlot.innerHTML = '';
    if (screen.activeTab) {
      navSlot.appendChild(EBX.Nav.render(screen.activeTab));
      document.body.classList.add('has-nav');
    } else {
      document.body.classList.remove('has-nav');
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  window.addEventListener('hashchange', render);
  return { render };
})();