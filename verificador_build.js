// Genera el HTML de «Seguir la Misa» (#followView): dos Misas genéricas,
// dominical y de semana, como lista de verificación de sus partes. Lo usa
// build_complete_app.js; el comportamiento está en verificador_app.js.

const { PARTES, FUENTES } = require('./verificador_datos.js');

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// «Comienza» / «Termina»: cita literal (con comillas) o descripción
function lineHTML(x) {
  if (x.nota) return esc(x.nota);
  const quoted = x.sinComillas ? esc(x.cita) : '«' + esc(x.cita) + '»';
  const cls = x.palabras ? ' class="step-words"' : '';
  return esc(x.antes || '') + '<q' + cls + '>' + quoted + '</q>' + esc(x.despues || '');
}

function stepHTML(p, modo) {
  const titulo = (modo === 'semana' && p.tituloSemana) || p.titulo;
  return '<li class="follow-step' + (p.esencial ? ' is-essential' : '') + '" data-step="' + p.id + '">' +
    '<button type="button" class="step-check" aria-pressed="false" aria-label="Marcar «' + esc(titulo) + '»" onclick="followToggle(this)"><span aria-hidden="true">✓</span></button>' +
    '<div class="step-body">' +
      '<div class="step-title">' + esc(titulo) + (p.esencial ? ' <span class="step-badge essential">Esencial</span>' : '') + '</div>' +
      '<div class="step-line"><span class="step-label">Comienza</span><span>' + lineHTML(p.inicio) + '</span></div>' +
      '<div class="step-line"><span class="step-label">Termina</span><span>' + lineHTML(p.fin) + '</span></div>' +
    '</div></li>';
}

function massHTML(modo) {
  let n = 0;
  const parts = PARTES.map(part => {
    const pasos = part.pasos.filter(p => p[modo] !== 'no');
    if (!pasos.length) return '';
    n++;
    return '<section class="follow-part' + (part.destacado ? ' is-highlighted' : '') + '">' +
      '<h3 class="follow-part-title"><span class="follow-part-num">' + n + '</span> ' + esc(part.titulo) + '</h3>' +
      (part.intro ? '<p class="follow-part-intro">' + esc(part.intro) + '</p>' : '') +
      (part.destacado ? '<p class="follow-cons-status" aria-live="polite"></p>' : '') +
      '<ol class="follow-steps">' + pasos.map(p => stepHTML(p, modo)).join('') + '</ol></section>';
  }).join('\n');
  return '<div class="follow-mass" data-mass="' + modo + '"' + (modo === 'semana' ? ' hidden' : '') + '>' + parts + '</div>';
}

function renderFollowView() {
  const sources = Object.values(FUENTES).filter(f => !/días/.test(f.titulo)).map(f => esc(f.titulo)).join('; ');
  return `
<div id="followView" class="view-panel">
  <div class="learn-header">
    <button type="button" class="btn-today-alt" onclick="refreshIndexAndHome()">← Volver a la portada</button>
    <h2 class="learn-title">Seguir la Misa</h2>
  </div>

  <div class="follow-toolbar">
    <div class="follow-mode" role="group" aria-label="Misa">
      <button type="button" class="cycle-btn" data-mode="domingo" onclick="followSetMode('domingo')">Misa dominical</button>
      <button type="button" class="cycle-btn" data-mode="semana" onclick="followSetMode('semana')">Misa de semana</button>
    </div>
    <div class="follow-progress-text" aria-live="polite"><span id="followDone">0</span> de <span id="followTotal">0</span></div>
    <button type="button" class="btn-today-alt" onclick="followReset()">Empezar de nuevo</button>
  </div>

  ${massHTML('domingo')}
  ${massHTML('semana')}

  <p class="learn-note">Frases entre comillas: ${sources}.</p>
</div><!-- Fin #followView -->
`;
}

module.exports = { renderFollowView };
