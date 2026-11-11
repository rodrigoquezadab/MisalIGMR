// Comportamiento de «Seguir la Misa» (#followView). El HTML lo genera
// verificador_build.js; build_complete_app.js incrusta este archivo tal cual.
//
// Estado por paso: 'hecho', 'omitido' o pendiente. Se guarda en el navegador
// solo para el día en curso (al día siguiente empieza de nuevo).

var FOLLOW_KEY = 'misal-seguir-misa';
var followState = { fecha: '', modo: 'domingo', pasos: {} };

function followToday() {
  var d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function followDefaultMode() {
  // Domingo o día con celebración propia del catálogo (solemnidad): modo domingo
  try {
    var d = new Date();
    if (d.getDay() === 0) return 'domingo';
    if (typeof LiturgicalCalendar !== 'undefined' && LiturgicalCalendar.celebrationFor(d)) return 'domingo';
  } catch (e) { /* sin calendario: día de semana */ }
  return 'semana';
}

function followLoad() {
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(FOLLOW_KEY) || 'null'); } catch (e) { saved = null; }
  if (saved && saved.fecha === followToday() && saved.pasos) {
    followState = saved;
  } else {
    followState = { fecha: followToday(), modo: followDefaultMode(), pasos: {} };
  }
}

function followSave() {
  try { localStorage.setItem(FOLLOW_KEY, JSON.stringify(followState)); } catch (e) { /* sin almacenamiento */ }
}

function followSteps() {
  return Array.prototype.slice.call(document.querySelectorAll('#followView .follow-step'));
}

function followApplies(li) {
  return li.getAttribute('data-' + followState.modo) !== 'no';
}

function followRender() {
  var steps = followSteps();
  var total = 0, done = 0, currentSet = false, current = null;
  var reachedAfterConsecration = false;

  steps.forEach(function (li) {
    var id = li.getAttribute('data-step');
    var applies = followApplies(li);
    var st = followState.pasos[id] || '';
    var when = li.getAttribute('data-' + followState.modo);
    li.hidden = !applies;
    li.classList.toggle('is-done', st === 'hecho');
    li.classList.toggle('is-skipped', st === 'omitido');
    li.querySelector('.step-check').setAttribute('aria-pressed', st === 'hecho' ? 'true' : 'false');
    var skip = li.querySelector('.step-skip');
    skip.hidden = when !== 'puede';
    skip.textContent = st === 'omitido' ? 'Sí corresponde' : 'No corresponde';
    var badge = li.querySelector('[data-when-badge]');
    if (badge) badge.hidden = when !== 'puede';
    li.classList.remove('is-current');
    if (!applies) return;
    if (st !== 'omitido') total++;
    if (st === 'hecho') done++;
    if (!st && !currentSet) { li.classList.add('is-current'); currentSet = true; current = li; }
  });

  // Contador por parte
  document.querySelectorAll('#followView .follow-part').forEach(function (sec) {
    var items = Array.prototype.slice.call(sec.querySelectorAll('.follow-step')).filter(function (li) { return !li.hidden && !li.classList.contains('is-skipped'); });
    var ok = items.filter(function (li) { return li.classList.contains('is-done'); }).length;
    var counter = sec.querySelector('.follow-part-count');
    if (counter) counter.textContent = ok + '/' + items.length;
    sec.classList.toggle('is-complete', items.length > 0 && ok === items.length);
    if (sec.getAttribute('data-part') !== 'consagracion' && sec.compareDocumentPosition(document.querySelector('[data-part="consagracion"]')) & Node.DOCUMENT_POSITION_PRECEDING && ok > 0) {
      reachedAfterConsecration = true;
    }
  });

  document.getElementById('followDone').textContent = done;
  document.getElementById('followTotal').textContent = total;
  document.getElementById('followBarFill').style.width = (total ? Math.round(100 * done / total) : 0) + '%';
  document.querySelectorAll('#followView .follow-mode .cycle-btn').forEach(function (b) {
    var on = b.getAttribute('data-mode') === followState.modo;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  // Elementos esenciales de la consagración
  var essentials = steps.filter(function (li) { return li.classList.contains('is-essential'); });
  var missing = essentials.filter(function (li) { return !li.classList.contains('is-done'); });
  var box = document.getElementById('followEssentials');
  var names = function (list) {
    return list.map(function (li) { return li.querySelector('.step-title').firstChild.textContent.trim(); }).join(', ');
  };
  if (!missing.length) {
    box.className = 'follow-essentials ok';
    box.textContent = '✓ Consagración verificada: pan y vino sobre el altar, y las palabras de Cristo sobre el pan y sobre el cáliz.';
  } else if (reachedAfterConsecration) {
    box.className = 'follow-essentials warn';
    box.textContent = '⚠ Ya se avanzó después de la consagración y falta verificar: ' + names(missing) + '. Si no está seguro, consulte con el sacerdote o un responsable de la liturgia.';
  } else {
    box.className = 'follow-essentials';
    box.textContent = 'Consagración por verificar: ' + names(missing) + '.';
  }
  return current;
}

function followToggle(id) {
  followState.pasos[id] = followState.pasos[id] === 'hecho' ? '' : 'hecho';
  followSave();
  var next = followRender();
  if (followState.pasos[id] === 'hecho' && next) {
    var r = next.getBoundingClientRect();
    if (r.top < 120 || r.bottom > window.innerHeight) next.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function followSkip(id) {
  followState.pasos[id] = followState.pasos[id] === 'omitido' ? '' : 'omitido';
  followSave();
  followRender();
}

function followSetMode(mode) {
  followState.modo = mode;
  followSave();
  followRender();
}

function followReset() {
  followState = { fecha: followToday(), modo: followState.modo, pasos: {} };
  followSave();
  followRender();
  var first = document.querySelector('#followView .follow-step.is-current');
  if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function openFollowView() {
  followLoad();
  switchView('follow');
  followRender();
  if (typeof toggleDrawer === 'function') toggleDrawer(false);
}
