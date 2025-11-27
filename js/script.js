/* script.js - IvanConnect: menú, likes, modo oscuro, animaciones */
document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------ */
  /*   FOOTER YEAR                  */
  /* ------------------------------ */
  document.querySelectorAll('[id^="year"]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ------------------------------ */
  /*   MENÚ HAMBURGUESA ANIMADO     */
  /* ------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if(navToggle && mainNav){
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open'); // animación hamburguesa
      mainNav.classList.toggle('open'); // abrir/cerrar nav
    });
  }

  /* ------------------------------ */
  /*   SUBMENÚS                     */
  /* ------------------------------ */
  document.querySelectorAll('.has-sub > .sub-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      parent.classList.toggle('open', !expanded);
    });
  });

  document.addEventListener('click', (e) => {
    document.querySelectorAll('.has-sub.open').forEach(el => {
      if(!el.contains(e.target)){
        el.classList.remove('open');
        const btn = el.querySelector('.sub-toggle');
        if(btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ------------------------------ */
  /*   LIKE SYSTEM PERSISTENTE      */
  /* ------------------------------ */
  const LS_KEY = 'ivanconnect_likes_v1_';

  document.querySelectorAll('.like-btn').forEach(btn => {
    const item = btn.closest('[data-id]');
    const id = item ? item.getAttribute('data-id') : null;
    const countSpan = btn.querySelector('.like-count');

    let count = 0;
    let active = false;

    if(id){
      try {
        const saved = JSON.parse(localStorage.getItem(LS_KEY + id));
        if(saved && typeof saved.count === 'number'){
          count = saved.count;
          active = !!saved.active;
        }
      } catch(e){}

      countSpan.textContent = count;
      if(active) btn.classList.add('active');
      btn.setAttribute('aria-pressed', String(active));

      btn.addEventListener('click', () => {
        active = !active;
        count = active ? count + 1 : Math.max(0, count - 1);
        countSpan.textContent = count;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
        localStorage.setItem(LS_KEY + id, JSON.stringify({count, active}));
      });

    } else {
      btn.addEventListener('click', () => {
        let n = Number(countSpan.textContent || 0);
        const activeLocal = btn.classList.toggle('active');
        n = activeLocal ? n + 1 : Math.max(0, n - 1);
        countSpan.textContent = n;
        btn.setAttribute('aria-pressed', String(activeLocal));
      });
    }
  });

  /* ------------------------------ */
  /*   MODO OSCURO (persistente)    */
  /* ------------------------------ */
  const darkToggle = document.getElementById('darkModeToggle');
  if(localStorage.getItem('ivanconnect_dark') === 'true'){
    document.body.classList.add('dark');
  }

  if(darkToggle){
    darkToggle.addEventListener('click', ()=>{
      document.body.classList.toggle('dark');
      const nowDark = document.body.classList.contains('dark');
      localStorage.setItem('ivanconnect_dark', nowDark ? 'true' : 'false');
    });
  }

});
