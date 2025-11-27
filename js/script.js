/* script.js - manejo de menú y likes persistentes */
document.addEventListener("DOMContentLoaded", ()=> {
  // set year in footers (si hay varios)
  document.querySelectorAll('[id^="year"]').forEach(el=> el.textContent = new Date().getFullYear());

  // NAV TOGGLING - funciona para los 4 nav toggles si existen
  function setupNav(toggleId, navId){
    const btn = document.getElementById(toggleId);
    const nav = document.getElementById(navId);
    if(!btn || !nav) return;
    btn.addEventListener('click', ()=> {
      nav.classList.toggle('open');
    });
  }
  setupNav('navToggle','mainNav');
  setupNav('navToggle2','mainNav2');
  setupNav('navToggle3','mainNav3');
  setupNav('navToggle4','mainNav4');

  // SUBMENU toggles (desktop & mobile)
  document.querySelectorAll('.has-sub > .sub-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const parent = btn.parentElement;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      parent.classList.toggle('open', !expanded);
    });
  });

  // ---------- LIKE BUTTONS ----------
  // Key prefix for localStorage
  const LS_KEY = 'tpm_relikes_v1_';

  // Initialize all like buttons: find parent with data-id (item id)
  document.querySelectorAll('.like-btn').forEach(btn=>{
    // find nearest ancestor with data-id
    const item = btn.closest('[data-id]');
    const id = item ? item.getAttribute('data-id') : null;
    const countSpan = btn.querySelector('.like-count');

    // default 0
    let count = 0;
    let active = false;

    if(id){
      // read from localStorage
      try {
        const saved = JSON.parse(localStorage.getItem(LS_KEY + id));
        if(saved && typeof saved.count === 'number') { count = saved.count; active = !!saved.active; }
      } catch(e){ /* ignore parse errors */ }
      // set UI
      countSpan.textContent = count;
      if(active) btn.classList.add('active');
      btn.setAttribute('aria-pressed', String(active));

      // click handler toggles like
      btn.addEventListener('click', ()=>{
        active = !active;
        count = active ? count + 1 : Math.max(0, count - 1);
        countSpan.textContent = count;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
        // save
        localStorage.setItem(LS_KEY + id, JSON.stringify({ count, active }));
      });
    } else {
      // fallback for buttons without data-id item: toggle visual only
      btn.addEventListener('click', ()=>{
        const span = btn.querySelector('.like-count');
        let n = Number(span.textContent || 0);
        const activeLocal = btn.classList.toggle('active');
        n = activeLocal ? n + 1 : Math.max(0, n - 1);
        span.textContent = n;
        btn.setAttribute('aria-pressed', String(activeLocal));
      });
    }
  });

  // Accessibility: close open submenus when clicking outside
  document.addEventListener('click', (e)=>{
    document.querySelectorAll('.has-sub.open').forEach(el=>{
      if(!el.contains(e.target)){
        el.classList.remove('open');
        const btn = el.querySelector('.sub-toggle');
        if(btn) btn.setAttribute('aria-expanded','false');
      }
    });
  });

});
