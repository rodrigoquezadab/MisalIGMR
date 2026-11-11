// Genera el HTML de la vista «Seguir la Misa» (#followView) a partir de
// verificador_datos.js. Lo usa build_complete_app.js; el comportamiento
// (marcar pasos, progreso, guardar el avance) está en verificador_app.js.

const { PARTES, FUENTES } = require('./verificador_datos.js');

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// «Comienza» / «Termina»: cita literal (con comillas) o descripción
function lineHTML(x) {
  if (!x) return '';
  if (x.nota) return esc(x.nota);
  const quoted = x.sinComillas ? esc(x.cita) : '«' + esc(x.cita) + '»';
  const cls = x.palabras ? ' class="step-words"' : '';
  return esc(x.antes || '') + '<q' + cls + ' data-fuente="' + esc(x.fuente) + '">' + quoted + '</q>' + esc(x.despues || '');
}

function cuando(p, modo) { return p[modo] || 'si'; }

function stepHTML(p) {
  const d = cuando(p, 'domingo'), s = cuando(p, 'semana');
  const badges = [];
  if (p.esencial) badges.push('<span class="step-badge essential">Esencial</span>');
  if (p.obligatorio) badges.push('<span class="step-badge required">Siempre</span>');
  if (d === 'puede' || s === 'puede') badges.push('<span class="step-badge optional" data-when-badge>Si corresponde</span>');
  if (d === 'si' && s === 'no') badges.push('<span class="step-badge sunday">Domingo</span>');
  return '<li class="follow-step' + (p.esencial ? ' is-essential' : '') + '" data-step="' + p.id + '" data-domingo="' + d + '" data-semana="' + s + '">' +
    '<button type="button" class="step-check" aria-pressed="false" aria-label="Marcar «' + esc(p.titulo) + '» como realizado" onclick="followToggle(\'' + p.id + '\')"><span aria-hidden="true">✓</span></button>' +
    '<div class="step-body">' +
      '<div class="step-title">' + esc(p.titulo) + ' ' + badges.join(' ') + '<span class="step-now">Ahora</span></div>' +
      (p.nota ? '<div class="step-note">' + esc(p.nota) + '</div>' : '') +
      '<div class="step-line"><span class="step-label">Comienza</span><span>' + lineHTML(p.inicio) + '</span></div>' +
      '<div class="step-line"><span class="step-label">Termina</span><span>' + lineHTML(p.fin) + '</span></div>' +
      '<div class="step-foot"><span class="step-igmr">IGMR ' + p.igmr.join(', ') + '</span>' +
        '<button type="button" class="step-skip" onclick="followSkip(\'' + p.id + '\')">No corresponde</button></div>' +
    '</div></li>';
}

function partHTML(part, index) {
  return '<section class="follow-part' + (part.destacado ? ' is-highlighted' : '') + '" data-part="' + part.id + '">' +
    '<h3 class="follow-part-title"><span class="follow-part-num">' + (index + 1) + '</span> ' + esc(part.titulo) +
    ' <span class="follow-part-count" data-part-count="' + part.id + '"></span></h3>' +
    (part.intro ? '<p class="follow-part-intro">' + esc(part.intro) + '</p>' : '') +
    '<ol class="follow-steps">' + part.pasos.map(stepHTML).join('') + '</ol></section>';
}

function renderFollowView() {
  const sources = Object.values(FUENTES).map(f => '<li>' + esc(f.titulo) + '</li>').join('');
  return `
<div id="followView" class="view-panel">
  <div class="learn-header">
    <button type="button" class="btn-today-alt" onclick="refreshIndexAndHome()">← Volver a la portada</button>
    <h2 class="learn-title">Seguir la Misa</h2>
    <p class="follow-lead">Lista para verificar, paso a paso, que se realizan las partes de la Misa. Marque cada parte cuando termine; la siguiente queda señalada como «Ahora». Para los textos completos, abra la Misa del día desde el índice.</p>
  </div>

  <div class="follow-toolbar">
    <div class="follow-mode" role="group" aria-label="Tipo de Misa">
      <button type="button" class="cycle-btn" data-mode="domingo" onclick="followSetMode('domingo')">Domingo o solemnidad</button>
      <button type="button" class="cycle-btn" data-mode="semana" onclick="followSetMode('semana')">Día de semana</button>
    </div>
    <div class="follow-progress" aria-live="polite">
      <div class="follow-progress-text"><span id="followDone">0</span> de <span id="followTotal">0</span> partes</div>
      <div class="follow-bar"><div id="followBarFill"></div></div>
    </div>
    <button type="button" class="btn-today-alt" onclick="followReset()">Empezar de nuevo</button>
  </div>

  <div id="followEssentials" class="follow-essentials" aria-live="polite"></div>

  ${PARTES.map(partHTML).join('\n  ')}

  <div class="follow-sources learn-note">
    <p>Las frases entre comillas son del Ordinario de la Misa de la edición para Chile, según las publica el Departamento de Liturgia del Arzobispado de Santiago (Eucaristía Diaria); lo demás describe lo que ocurre, según la Instrucción General del Misal Romano (toque cualquier número IGMR para leerlo).</p>
    <ul>${sources}</ul>
    <p>Los elementos marcados «Esencial» son el pan de trigo, el vino de uva y las palabras de Cristo sobre cada uno, según la IGMR. La confirmación de los requisitos de validez con el Código de Derecho Canónico está pendiente.</p>
  </div>
</div><!-- Fin #followView -->
`;
}

module.exports = { renderFollowView };
