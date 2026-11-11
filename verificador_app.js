// Comportamiento de «Seguir la Misa» (#followView): elegir la Misa dominical
// o la de semana y marcar cada parte. El avance se guarda en el navegador
// solo durante el día. build_complete_app.js incrusta este archivo tal cual.

var FOLLOW_KEY = 'misal-seguir-misa';
var followState = { fecha: '', modo: 'domingo', hechos: {} };

function followToday() {
  var d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function followLoad() {
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(FOLLOW_KEY) || 'null'); } catch (e) { saved = null; }
  if (saved && saved.fecha === followToday() && saved.hechos) {
    followState = saved;
  } else {
    followState = { fecha: followToday(), modo: new Date().getDay() === 0 ? 'domingo' : 'semana', hechos: {} };
  }
}

function followSave() {
  try { localStorage.setItem(FOLLOW_KEY, JSON.stringify(followState)); } catch (e) { /* sin almacenamiento */ }
}

function followRender() {
  var mass = null;
  document.querySelectorAll('#followView .follow-mass').forEach(function (m) {
    var on = m.getAttribute('data-mass') === followState.modo;
    m.hidden = !on;
    if (on) mass = m;
  });
  document.querySelectorAll('#followView .follow-mode .cycle-btn').forEach(function (b) {
    var on = b.getAttribute('data-mode') === followState.modo;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  if (!mass) return;
  var hechos = followState.hechos[followState.modo] || {};
  var steps = mass.querySelectorAll('.follow-step');
  var done = 0, current = null;
  steps.forEach(function (li) {
    var ok = !!hechos[li.getAttribute('data-step')];
    li.classList.toggle('is-done', ok);
    li.classList.remove('is-current');
    li.querySelector('.step-check').setAttribute('aria-pressed', ok ? 'true' : 'false');
    if (ok) done++;
    else if (!current) current = li;
  });
  if (current) current.classList.add('is-current');
  document.getElementById('followDone').textContent = done;
  document.getElementById('followTotal').textContent = steps.length;

  var cons = mass.querySelector('.follow-part.is-highlighted');
  if (cons) {
    var essentials = cons.querySelectorAll('.follow-step.is-essential');
    var missing = Array.prototype.filter.call(essentials, function (li) { return !li.classList.contains('is-done'); });
    var status = cons.querySelector('.follow-cons-status');
    status.textContent = missing.length ? '' : '✓ Consagración verificada.';
    cons.classList.toggle('is-verified', !missing.length);
  }
  return current;
}

function followToggle(btn) {
  var id = btn.closest('.follow-step').getAttribute('data-step');
  var hechos = followState.hechos[followState.modo] = followState.hechos[followState.modo] || {};
  hechos[id] = !hechos[id];
  followSave();
  var next = followRender();
  if (hechos[id] && next) {
    var r = next.getBoundingClientRect();
    if (r.top < 120 || r.bottom > window.innerHeight) next.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function followSetMode(mode) {
  followState.modo = mode;
  followSave();
  followRender();
}

function followReset() {
  followState.hechos[followState.modo] = {};
  followSave();
  followRender();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openFollowView(mode) {
  followLoad();
  if (mode) { followState.modo = mode; followSave(); }
  switchView('follow');
  followRender();
  if (typeof toggleDrawer === 'function') toggleDrawer(false);
}
