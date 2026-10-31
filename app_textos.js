// Textos propios de cada misa en la app.
//
// Usa los textos de la edición para Chile (textos_chile.json, generado por
// fuentes/unir_textos.js) cuando existen, con un selector de ciclo A/B/C para
// las lecturas. Lo que aún no tiene fuente se muestra con los textos
// anteriores, marcados como «texto provisional».
//
// build_complete_app.js incrusta este archivo tal cual en la página, después
// de liturgical_calendar.js y de las variables liturgiaData y textosChile.

var TEXTOS_CICLO_EVANGELISTA = { A: 'Mateo', B: 'Marcos', C: 'Lucas' };

function escHTML(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parasHTML(lines) {
  return (lines || []).map(function (t) { return '<p>' + escHTML(t) + '</p>'; }).join('');
}

function provisionalTag() {
  return ' <span class="provisional-tag" title="Texto de la edición colombiana; falta reemplazarlo por el de la edición para Chile">texto provisional</span>';
}

function setHTML(id, html) {
  var el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

// Ciclo de la próxima vez que se celebra esta misa (hoy incluido)
function nextCelebrationOf(id) {
  if (typeof LiturgicalCalendar === 'undefined') return { ciclo: 'A', fecha: null };
  var today = new Date();
  for (var i = 0; i < 400; i++) {
    var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    var c = LiturgicalCalendar.celebrationFor(d);
    if (c && (c.id === id || c.alternativas.indexOf(id) >= 0)) {
      return { ciclo: LiturgicalCalendar.sundayCycle(d), fecha: d };
    }
  }
  return { ciclo: LiturgicalCalendar.sundayCycle(today), fecha: null };
}

function formatDateCL(d) {
  return d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatIsoCL(iso) {
  var p = iso.split('-');
  return formatDateCL(new Date(+p[0], +p[1] - 1, +p[2]));
}

// ---------------------------------------------------------------------------
// Piezas

function antiphonHTML(label, a) {
  var h = '<p><strong>' + label + ':</strong> ' + escHTML((a.texto || []).join(' '));
  if (a.cita) h += ' <span class="text-citation">(' + escHTML(a.cita) + ')</span>';
  h += '</p>';
  (a.alternativas || []).forEach(function (alt) {
    h += '<p class="alt-text"><em>O bien:</em> ' + escHTML((alt.texto || []).join(' '));
    if (alt.cita) h += ' <span class="text-citation">(' + escHTML(alt.cita) + ')</span>';
    h += '</p>';
  });
  return h;
}

function prayerHTML(label, p) {
  return '<p><strong>' + label + ':</strong></p>' + parasHTML(p.texto);
}

function readingBodyHTML(r, endLine) {
  var h = '';
  if (r.titulo) h += '<p class="reading-title">' + escHTML(r.titulo) + '</p>';
  h += '<p><span class="speaker">Lector:</span> ' + escHTML(r.encabezado) + '.</p>';
  h += parasHTML(r.texto);
  h += endLine;
  return h;
}

// Nombre corto del libro a partir del encabezado que se proclama
// («Lectura de la primera carta del Apóstol san Pablo a los cristianos de Corinto» -> «1 Corintios»).
var PAUL_CITIES = { roma: 'Romanos', corinto: 'Corintios', galacia: 'Gálatas', 'éfeso': 'Efesios', efeso: 'Efesios',
  filipos: 'Filipenses', colosas: 'Colosenses', 'tesalónica': 'Tesalonicenses', tesalonica: 'Tesalonicenses' };
var ORDINALS = { primera: '1 ', segunda: '2 ', tercera: '3 ', primer: '1 ', segundo: '2 ' };

function shortBook(encabezado) {
  var e = (encabezado || '').replace(/^\+\s*/, '').replace(/,/g, '');
  var ord = function (w) { return w ? ORDINALS[w.toLowerCase()] || '' : ''; };
  var m;
  if ((m = e.match(/(primera|segunda)? ?carta del ap[oó]stol san pablo a los cristianos de (\S+)/i))) {
    var city = PAUL_CITIES[m[2].toLowerCase()];
    return city ? ord(m[1]) + city : '';
  }
  if ((m = e.match(/(primera|segunda)? ?carta del ap[oó]stol san pablo a (Timoteo|Tito|Filem[oó]n)/i))) return ord(m[1]) + m[2];
  if (/carta a los hebreos/i.test(e)) return 'Hebreos';
  if (/carta de santiago/i.test(e)) return 'Santiago';
  if ((m = e.match(/(primera|segunda|tercera)? ?carta (?:del ap[oó]stol )?(?:de )?san (Pedro|Juan|Judas)/i))) return ord(m[1]) + m[2];
  if (/hechos de los ap[oó]stoles/i.test(e)) return 'Hechos';
  if ((m = e.match(/(primer|segundo) libro de (?:los |las )?(\S+)/i))) return ord(m[1]) + m[2];
  if ((m = e.match(/libro (?:del profeta |de la |de los |del |de )?(.+)$/i))) return m[1];
  if ((m = e.match(/profec[ií]a de (.+)$/i))) return m[1];
  return '';
}

function citeWithBook(r) {
  var book = shortBook(r.encabezado);
  return (book ? book + ' ' : '') + (r.cita || '');
}

var END_READING = '<p class="rubric" style="margin-top:0.8rem;">Palabra de Dios. <span class="response">Te alabamos, Señor.</span></p>';

function readingHTML(label, r) {
  var h = '<div class="scripture-citation">' + label + ' (' + escHTML(citeWithBook(r)) + ')</div>';
  h += readingBodyHTML(r, END_READING);
  if (r.breve) {
    h += '<details class="alt-reading"><summary>Forma breve (' + escHTML(citeWithBook(r.breve)) + ')</summary>' + readingBodyHTML(r.breve, END_READING) + '</details>';
  }
  (r.alternativas || []).forEach(function (alt) {
    h += '<details class="alt-reading"><summary>O bien: ' + escHTML(citeWithBook(alt)) + '</summary>' + readingBodyHTML(alt, END_READING) + '</details>';
  });
  return h;
}

function psalmHTML(s) {
  var cita = /^\d/.test(s.cita || '') ? 'Sal ' + s.cita : s.cita;
  var h = '<div class="scripture-citation">Salmo Responsorial (' + escHTML(cita) + ')</div>';
  h += '<div class="psalm-response">R. ' + escHTML(s.respuesta) + '</div>';
  if (s.respuestaAlternativa) h += '<p class="alt-text"><em>O bien:</em> R. ' + escHTML(s.respuestaAlternativa) + '</p>';
  h += s.estrofas.map(function (e) {
    return '<p style="margin-bottom:0.6rem;">' + escHTML(e) + ' <span class="response">R.</span></p>';
  }).join('');
  return h;
}

function acclamationHTML(a, lent) {
  var text = (a.texto || []).join(' ').replace(/^Aleluya[.,!]?\s*/i, '').replace(/\s*Aleluya[.,!]?$/i, '');
  var resp = lent ? 'Honor y gloria a ti, Señor Jesús.' : '¡Aleluya, aleluya!';
  var end = lent ? 'Honor y gloria a ti, Señor Jesús.' : '¡Aleluya!';
  return (a.cita ? '<div class="scripture-citation">Aclamación antes del Evangelio (' + escHTML(a.cita) + ')</div>' : '') +
    '<p><span class="speaker">Todos:</span> <span class="response">' + resp + '</span></p>' +
    '<p><span class="speaker">V.</span> ' + escHTML(text) + '</p>' +
    '<p><span class="speaker">Todos:</span> <span class="response">' + end + '</span></p>';
}

var END_GOSPEL = '<p class="rubric" style="margin-top:0.8rem;">Palabra del Señor. <span class="response">Gloria a ti, Señor Jesús.</span></p>';

function gospelBodyHTML(g) {
  var h = '';
  if (g.titulo) h += '<p class="reading-title">' + escHTML(g.titulo) + '</p>';
  h += '<p><span class="speaker">Diácono o Sacerdote:</span> El Señor esté con ustedes. <span class="response">Y con tu espíritu.</span></p>';
  h += '<p><span class="speaker">Diácono o Sacerdote:</span> ✠ Evangelio de nuestro Señor Jesucristo según san ' + escHTML(g.evangelista) + '. <span class="response">Gloria a ti, Señor.</span></p>';
  h += parasHTML(g.texto);
  h += END_GOSPEL;
  return h;
}

function gospelHTML(g) {
  var h = '<div class="scripture-citation">Santo Evangelio (' + escHTML(g.evangelista) + ' ' + escHTML(g.cita) + ')</div>';
  h += gospelBodyHTML(g);
  if (g.breve) {
    h += '<details class="alt-reading"><summary>Forma breve (' + escHTML(g.breve.cita) + ')</summary>' + gospelBodyHTML(g.breve) + '</details>';
  }
  (g.alternativas || []).forEach(function (alt) {
    h += '<details class="alt-reading"><summary>O bien: ' + escHTML(alt.evangelista) + ' ' + escHTML(alt.cita) + '</summary>' + gospelBodyHTML(alt) + '</details>';
  });
  return h;
}

// ---------------------------------------------------------------------------
// Textos anteriores (provisionales)

function oldReadingHTML(label, r) {
  return '<div class="scripture-citation">' + label + ' (' + r.cita + ')' + provisionalTag() + '</div>' +
    '<p>' + r.texto + '</p>' + END_READING;
}

function oldPsalmHTML(s) {
  return '<div class="scripture-citation">Salmo Responsorial (' + s.cita + ')' + provisionalTag() + '</div>' +
    '<div class="psalm-response">R. ' + (s.respuesta || s.resp || '') + '</div>' +
    (s.estrofas || []).map(function (e) { return '<p style="margin-bottom:0.6rem;">' + e + '</p>'; }).join('');
}

function oldAcclamationHTML(m, lent) {
  var v = (m.aleluya ? m.aleluya.versiculo : '') + provisionalTag();
  return lent
    ? '<p><span class="speaker">Todos:</span> <span class="response">Honor y gloria a ti, Señor Jesús.</span></p><p><span class="speaker">V.</span> ' + v + '</p><p><span class="speaker">Todos:</span> <span class="response">Honor y gloria a ti, Señor Jesús.</span></p>'
    : '<p><span class="speaker">Todos:</span> <span class="response">¡Aleluya, aleluya!</span></p><p><span class="speaker">V.</span> ' + v + '</p><p><span class="speaker">Todos:</span> <span class="response">¡Aleluya!</span></p>';
}

function oldGospelHTML(e) {
  return '<div class="scripture-citation">Santo Evangelio (' + e.cita + ')' + provisionalTag() + '</div>' +
    '<p><span class="speaker">Diácono o Sacerdote:</span> El Señor esté con vosotros. <span class="response">Y con tu espíritu.</span></p>' +
    '<p><span class="speaker">Diácono o Sacerdote:</span> Lectura del santo Evangelio según ' + e.cita.split(' ')[0] + '. <span class="response">Gloria a ti, Señor.</span></p>' +
    '<p style="margin-top: 0.8rem;">' + e.texto + '</p>' + END_GOSPEL;
}

// ---------------------------------------------------------------------------
// Selector de ciclo

function sameReadingsInAllCycles(tc) {
  var keys = ['A', 'B', 'C'].filter(function (c) { return tc.ciclos[c]; });
  if (keys.length < 2) return false;
  var sig = function (c) {
    var x = tc.ciclos[c];
    return [x.lectura1 && x.lectura1.cita, x.lectura2 && x.lectura2.cita, x.evangelio && x.evangelio.cita].join('|');
  };
  return keys.every(function (c) { return sig(c) === sig(keys[0]); });
}

function renderCycleBar(m, tc, cycle, next) {
  var bar = document.getElementById('cycleBar');
  if (!bar) return;
  if (!tc || !Object.keys(tc.ciclos).length) {
    bar.innerHTML = '<p class="cycle-bar-note">Esta celebración todavía muestra los textos provisionales (edición colombiana). Sus textos para Chile están pendientes de revisión.</p>';
    return;
  }
  var h = '';
  if (sameReadingsInAllCycles(tc)) {
    h += '<p class="cycle-bar-note">Las lecturas de esta celebración son las mismas todos los años.</p>';
  } else {
    h += '<div class="cycle-bar-label">Lecturas del ciclo</div><div class="cycle-buttons" role="group" aria-label="Ciclo de lecturas">';
    ['A', 'B', 'C'].forEach(function (c) {
      var has = !!tc.ciclos[c];
      h += '<button type="button" class="cycle-btn' + (c === cycle ? ' active' : '') + '"' + (has ? '' : ' disabled title="Este ciclo aún no tiene lecturas de la fuente"') +
        ' aria-pressed="' + (c === cycle) + '" onclick="selectCycle(\'' + c + '\')"><strong>' + c + '</strong> <span>' + TEXTOS_CICLO_EVANGELISTA[c] + '</span></button>';
    });
    h += '</div>';
    if (next.fecha) {
      h += '<p class="cycle-bar-note">Próxima celebración: ' + formatDateCL(next.fecha) + ' (ciclo ' + next.ciclo + ').</p>';
    }
  }
  var src = tc.ciclos[cycle] ? tc.ciclos[cycle].fuente : null;
  if (src) {
    h += '<p class="cycle-bar-note">Textos de la edición para Chile, según <a href="' + escHTML(src.url) + '" target="_blank" rel="noopener">Eucaristía Diaria</a> (página del ' + formatIsoCL(src.fecha) + ').</p>';
  } else {
    h += '<p class="cycle-bar-note">El ciclo ' + cycle + ' aún no tiene lecturas de la fuente: se muestran las provisionales.</p>';
  }
  bar.innerHTML = h;
}

function selectCycle(c) {
  var m = liturgiaData.misas.find(function (x) { return x.id === currentMassId; });
  if (m) renderPropers(m, c);
}

// ---------------------------------------------------------------------------

function renderPropers(m, cycle) {
  var tc = (typeof textosChile !== 'undefined' && textosChile.misas[m.id]) || null;
  var next = nextCelebrationOf(m.id);
  if (!cycle) {
    cycle = next.ciclo;
    // Si el ciclo de la próxima celebración no tiene fuente, abrir uno que la tenga
    if (tc && !tc.ciclos[cycle]) {
      var firstAvailable = ['A', 'B', 'C'].filter(function (c) { return tc.ciclos[c]; })[0];
      if (firstAvailable) cycle = firstAvailable;
    }
  }
  var com = tc ? tc.comunes : {};
  var cyc = tc ? tc.ciclos[cycle] : null;
  var lent = (m.tiempo === 'Cuaresma' || (m.tiempo === 'Semana Santa' && m.id !== 'pas-vigilia'));

  renderCycleBar(m, tc, cycle, next);

  setHTML('dyn-antifona-entrada', com.antifonaEntrada
    ? antiphonHTML('Antífona de entrada', com.antifonaEntrada)
    : '<p><strong>Antífona de Entrada:</strong> ' + m.antifonaEntrada + provisionalTag() + '</p>');
  setHTML('dyn-colecta', com.colecta
    ? prayerHTML('Oración colecta', com.colecta)
    : '<p><strong>Oración Colecta:</strong> ' + m.colecta + provisionalTag() + '</p>');

  setHTML('dyn-lectura-1', cyc && cyc.lectura1 ? readingHTML('Primera Lectura', cyc.lectura1) : oldReadingHTML('Primera Lectura', m.lectura1));
  setHTML('dyn-salmo', cyc && cyc.salmo ? psalmHTML(cyc.salmo) : oldPsalmHTML(m.salmo));
  setHTML('dyn-lectura-2', cyc && cyc.lectura2 ? readingHTML('Segunda Lectura', cyc.lectura2)
    : (cyc ? '<p class="rubric">Esta celebración tiene una sola lectura antes del Evangelio.</p>' : oldReadingHTML('Segunda Lectura', m.lectura2)));

  var acc = cyc && cyc.aclamacion ? acclamationHTML(cyc.aclamacion, lent) : oldAcclamationHTML(m, lent);
  if (cyc && cyc.secuencia) {
    acc = '<div class="scripture-citation">Secuencia</div>' + parasHTML(cyc.secuencia.texto) + acc;
  }
  setHTML('dyn-aleluya', acc);
  setHTML('dyn-evangelio', cyc && cyc.evangelio ? gospelHTML(cyc.evangelio) : oldGospelHTML(m.evangelio));

  setHTML('dyn-ofrendas', com.ofrendas
    ? prayerHTML('Oración sobre las ofrendas', com.ofrendas)
    : '<p><strong>Oración sobre las Ofrendas:</strong> ' + m.ofrendas + provisionalTag() + '</p>');

  setHTML('dyn-antifona-comunion', cyc && cyc.antifonaComunion
    ? antiphonHTML('Antífona de comunión', cyc.antifonaComunion)
    : '<p><strong>Antífona de Comunión:</strong> ' + m.antifonaComunion + provisionalTag() + '</p>');

  var post = com.postcomunion
    ? prayerHTML('Oración después de la comunión', com.postcomunion)
    : '<p><strong>Oración después de la Comunión:</strong> ' + m.postcomunion + provisionalTag() + '</p>';
  if (com.oracionSobreElPueblo) post += prayerHTML('Oración sobre el pueblo', com.oracionSobreElPueblo);
  setHTML('dyn-postcomunion', post);
}
