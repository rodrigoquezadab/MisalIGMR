// Extrae de las páginas descargadas de eucaristiadiaria.cl los textos propios
// de cada misa: antífonas, oraciones, lecturas, salmo, aclamación y evangelio.
//
// Uso: node fuentes/extraer_eucaristiadiaria.js
//
// Lee  fuentes/eucaristiadiaria/indice.json y paginas/*.html
// Escribe fuentes/eucaristiadiaria/extraido.json  (id -> ciclo -> partes, con la fuente)
//         fuentes/eucaristiadiaria/revision.md    (qué falta o hay que revisar a mano)
//
// No se extrae el material pastoral del sitio (sugerencias para la
// celebración, comentarios, oración de los fieles): no es texto del Misal ni
// del Leccionario.

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'eucaristiadiaria');
const index = JSON.parse(fs.readFileSync(path.join(DIR, 'indice.json'), 'utf8'));

// ---------------------------------------------------------------------------
// Texto de la página

const ENTITIES = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', laquo: '«', raquo: '»', mdash: '—', ndash: '–',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', hellip: '…', ordm: 'º', ordf: 'ª', iexcl: '¡', iquest: '¿', middot: '·', deg: '°' };
const MARKS = { acute: '́', tilde: '̃', uml: '̈', cedil: '̧', grave: '̀', circ: '̂' };

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-zA-Z])(acute|tilde|uml|cedil|grave|circ);/g, (_, l, m) => (l + MARKS[m]).normalize('NFC'))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name] !== undefined ? ENTITIES[name] : m);
}

// Líneas de contenido, con las anclas del sitio marcadas como «@@ancla».
function pageLines(html) {
  const body = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi, '')
    .replace(/<a\s+name="([^"]+)"[^>]*>/gi, '\n@@$1\n')
    .replace(/<(p|div|br|h\d|tr|li|table)\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '');
  const lines = decodeEntities(body).replace(/[​﻿]/g, '')
    .split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const start = lines.indexOf('@@inicio');
  let end = lines.findIndex(l => /^Contacto:/.test(l));
  if (end < 0) end = lines.length;
  return lines.slice(start < 0 ? 0 : start, end);
}

// Clave para comparar rótulos: minúsculas y sin tildes
function key(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }

// ---------------------------------------------------------------------------
// Rótulos

const LABELS = [
  ['antEntrada', /^antifona,? de (entrada|ingreso)\b\s*:?\s*(.*)$/],
  ['colecta', /^oracion colecta\b/],
  ['gloria', /^gloria\.?$/],
  ['credo', /^credo\.?$/],
  ['slotPrimera', /^primera lectura\b/],
  ['slotSegunda', /^segunda lectura\b/],
  ['slotTercera', /^tercera lectura\b/],
  ['lectura', /^\+?\s*lectura (del|de la|de los|de las)\b/],
  ['salmo', /^salmo responsoria(l)?\b\s*:?\s*(.*)$/],
  ['secuencia', /^secuencia\b/],
  ['aclamacion', /^aclamacion (al|antes del) evangelio\b\s*:?\s*(.*)$/],
  ['evangelioLabel', /^evangelio\.?$/],
  ['evangelio', /^\+?\s*evangelio de nuestro senor jesucristo segun san (mateo|marcos|lucas|juan)\b\s*(.*)$/],
  ['palabraDios', /^palabra de dios\.?$/],
  ['palabraSenor', /^palabra del senor\.?$/],
  ['obienBreve', /^o bien,? (mas breve|forma breve)/],
  ['obien', /^o bien\b\s*:?\s*(.*)$/],
  ['fieles', /^(oracion de los fieles|oracion universal|preces)\b/],
  ['ofrendas', /^oracion sobre las ofrendas\b/],
  ['prefacio', /^prefacio\b\s*:?\s*(.*)$/],
  ['antComunion', /^antifona,? de (la )?comunion\b\s*:?\s*(.*)$/],
  ['sobrePueblo', /^oracion sobre el pueblo\b/],
  ['bendicion', /^bendicion solemne\b/],
  ['rubrica', /^(no se dice|se dice|se omite|puede impartirse|puede darse|se puede|no se reza|se recomienda)\b/],
  ['poscomunion', /^oracion (despues de la comunion|postcomunion|de postcomunion)\b/],
  ['skip', /^(ritos iniciales|liturgia de la palabra|liturgia eucaristica|plegaria eucaristica|rito de la comunion|rito de conclusion|\(ver ordinario.*\)|\+\+\+)$/]
];

function classify(line) {
  const k = key(line);
  for (const [type, re] of LABELS) {
    const m = k.match(re);
    if (m) {
      // Resto del rótulo con su ortografía original (cita, nombre del prefacio…)
      const restKey = m[m.length - 1] || '';
      const rest = restKey && m.length > 1 ? line.slice(line.length - restKey.length).trim() : '';
      return { type, rest, m };
    }
  }
  return null;
}

// Cita al final del rótulo de una lectura: desde el primer número tras un espacio
function splitCitation(line) {
  const m = line.match(/^(.*?)\s+(\d+[\s,.:].*|\d+)$/);
  return m ? { encabezado: m[1].trim(), cita: m[2].trim() } : { encabezado: line.trim(), cita: '' };
}

// ---------------------------------------------------------------------------
// Separar las misas de una página que trae varias

const SUBMASSES = [
  ['vigilia', /^misa (vespertina )?de la vigilia\b/],
  ['noche', /^misa de (la noche|medianoche)\b/],
  ['aurora', /^misa de la aurora\b/],
  ['dia', /^misa del dia\b/],
  ['crismal', /^misa crismal\b/],
  ['cena', /^(misa (vespertina )?de la cena del senor|jueves de la cena del senor|misa vespertina)\b/]
];

// Qué misa de la página corresponde a cada misa del catálogo. Las demás
// (Epifanía, Ascensión, Pentecostés…) toman la «Misa del día».
const SUBMASS_FOR = { 'nav-vigilia': 'vigilia', 'nav-noche': 'noche', 'nav-aurora': 'aurora', 'sem-crismal': 'crismal', 'cua-jueves-santo': 'cena' };

// Devuelve { nombre: [líneas] } si la página trae varias misas identificables
function splitSubmasses(lines) {
  const found = {};
  let current = null;
  for (const l of lines) {
    const k = key(l);
    const sub = l.length < 60 && SUBMASSES.find(([, re]) => re.test(k));
    if (sub) {
      // «Jueves de la Cena del Señor» seguido de «Misa vespertina»: es la misma
      if (current === sub[0]) continue;
      current = sub[0]; found[current] = found[current] || []; continue;
    }
    if (l.startsWith('@@')) {
      // Cada sección (inicio, liturgia…) vuelve a nombrar las misas; el ancla vale para todas
      Object.values(found).forEach(arr => arr.push(l));
      current = null;
      continue;
    }
    if (current) found[current].push(l);
  }
  return Object.keys(found).length > 1 ? found : null;
}

// ---------------------------------------------------------------------------
// Extraer las partes de una misa

function parseMass(lines) {
  const out = {};
  const notes = [];
  let field = null;        // parte que se está llenando
  let target = null;       // objeto donde van las líneas
  let started = false;     // ya pasó el comentario inicial
  let slotHint = null;     // «PRIMERA LECTURA», «SEGUNDA LECTURA»
  let pendingAlt = null;   // «O bien:» pendiente para la parte indicada
  let pendingBreve = false;
  let preTitle = [];       // líneas sueltas que pueden ser el título de la lectura siguiente
  let skipping = false;    // dentro de la oración de los fieles

  const readingSlots = ['lectura1', 'lectura2', 'lectura3'];

  function close() { field = null; target = null; }

  function open(name, obj, asAlternative) {
    if (asAlternative && out[name]) {
      out[name].alternativas = out[name].alternativas || [];
      out[name].alternativas.push(obj);
    } else if (out[name] && !asAlternative) {
      notes.push('Parte repetida: ' + name + ' (se guarda como alternativa)');
      out[name].alternativas = out[name].alternativas || [];
      out[name].alternativas.push(obj);
    } else {
      out[name] = obj;
    }
    field = name; target = obj; skipping = false;
  }

  function nextReadingSlot() {
    if (slotHint) { const s = slotHint; slotHint = null; return s; }
    const salmoDone = !!out.salmo;
    if (!out.lectura1) return 'lectura1';
    if (salmoDone && !out.lectura2) return 'lectura2';
    if (!salmoDone) return 'lectura1';
    return out.lectura2 ? 'lectura3' : 'lectura2';
  }

  const PRAYERS = ['colecta', 'ofrendas', 'postcomunion', 'oracionSobreElPueblo'];
  // Una oración termina en punto; una línea final sin él suele ser el título
  // de la lectura siguiente que quedó antes del ancla.
  function takeDanglingTitle() {
    if (!PRAYERS.includes(field) || target.texto.length < 2) return [];
    const last = target.texto[target.texto.length - 1];
    if (/[.!?»”")]$/.test(last) || last.length > 200) return [];
    notes.push('Título de lectura separado del final de ' + field + ': «' + last + '»');
    return [target.texto.pop()];
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.startsWith('@@')) { const t = takeDanglingTitle(); close(); preTitle = t; skipping = false; continue; }
    // Rúbrica pegada al final de una línea de texto: «… Salvador. No se dice Gloria.»
    const tail = line.match(/^(.+?[.!?»”])\s+((No se dice|Se dice) (el )?Gloria\.?)$/i);
    if (tail) {
      (out.rubricas = out.rubricas || []).push(tail[2]);
      out.gloria = /^se dice/i.test(tail[2]);
      line = tail[1];
    }
    const c = classify(line);

    if (!started) {
      // Antes de la antífona de entrada solo hay encabezado y comentario pastoral
      if (!c || !['antEntrada', 'colecta', 'lectura', 'salmo', 'slotPrimera'].includes(c.type)) continue;
      started = true;
    }

    if (c) {
      if (!['obien', 'obienBreve', 'lectura', 'evangelio', 'skip'].includes(c.type)) preTitle = [];
      switch (c.type) {
        case 'skip': close(); continue;
        case 'gloria': out.gloria = true; close(); continue;
        case 'credo': out.credo = true; close(); continue;
        case 'fieles': close(); skipping = true; continue;
        case 'palabraDios': case 'palabraSenor': close(); continue;
        case 'slotPrimera': slotHint = 'lectura1'; close(); continue;
        case 'slotSegunda': slotHint = 'lectura2'; close(); continue;
        case 'slotTercera': slotHint = 'lectura3'; close(); continue;
        case 'evangelioLabel': close(); continue;
        case 'obienBreve': pendingBreve = true; pendingAlt = field; close(); continue;
        case 'obien':
          pendingAlt = field;
          // «O bien:» después de la respuesta del salmo: la línea siguiente es otra respuesta
          if (field === 'salmo' && target.respuesta && !target.estrofas.length) {
            const nextLine = lines[i + 1] || '';
            if (nextLine && !classify(nextLine)) { target.respuestaAlternativa = nextLine.replace(/^R\s*\/?\s*\.?\s*/, '').trim(); i++; }
            continue;
          }
          // «O bien: Cf. Jn 6, 51» en una antífona trae la cita en la misma línea
          if (field && /^(antEntrada|antComunion)$/.test(field)) {
            open(field, { cita: c.rest, texto: [] }, true);
          } else {
            close();
          }
          continue;
        case 'antEntrada': open('antifonaEntrada', { cita: c.rest, texto: [] }); continue;
        case 'colecta': open('colecta', { texto: [] }); continue;
        case 'ofrendas':
          if (out.antifonaComunion && out.ofrendas) {
            notes.push('La página rotula la oración después de la comunión como «Oración sobre las ofrendas»; se tomó como poscomunión por su lugar.');
            open('postcomunion', { texto: [] });
          } else {
            open('ofrendas', { texto: [] });
          }
          continue;
        case 'poscomunion': open('postcomunion', { texto: [] }); continue;
        case 'antComunion': open('antifonaComunion', { cita: c.rest, texto: [] }); continue;
        case 'sobrePueblo': open('oracionSobreElPueblo', { texto: [] }); continue;
        case 'bendicion': open('bendicionSolemne', { texto: [] }); continue;
        case 'rubrica':
          (out.rubricas = out.rubricas || []).push(line);
          if (/^no se dice (el )?gloria/i.test(key(line))) out.gloria = false;
          if (/^se dice (el )?gloria/i.test(key(line))) out.gloria = true;
          continue;
        case 'prefacio': {
          // «PREFACIO» solo, o «Prefacio I de la Virgen María»
          out.prefacio = { nombre: c.rest ? line : '' };
          close();
          continue;
        }
        case 'secuencia': open('secuencia', { texto: [] }); continue;
        case 'salmo': open('salmo', { cita: c.rest, respuesta: '', estrofas: [] }); continue;
        case 'aclamacion': open('aclamacion', { cita: c.rest, texto: [] }); continue;
        case 'lectura': {
          if (!preTitle.length) preTitle = takeDanglingTitle();
          let { encabezado, cita } = splitCitation(line);
          // A veces la cita viene en la línea siguiente
          if (!cita && i + 1 < lines.length && /^\d+[\d\s,.\-–—abcdy;]*$/.test(lines[i + 1])) { cita = lines[i + 1]; i++; }
          let titulo = preTitle.join(' ');
          // Sin rótulo «SEGUNDA LECTURA», el título queda pegado al final del salmo
          if (!titulo && field === 'salmo' && target.estrofas.length) {
            const last = target.estrofas[target.estrofas.length - 1];
            if (!/\bR\/?\.?$/.test(last) && last.length < 200) { titulo = target.estrofas.pop(); }
          }
          const reading = { titulo, encabezado, cita, texto: [] };
          if (pendingBreve && pendingAlt && /^lectura\d$|^evangelio$/.test(pendingAlt)) {
            out[pendingAlt].breve = reading; field = pendingAlt + '.breve'; target = reading;
          } else if (pendingAlt && /^lectura\d$/.test(pendingAlt)) {
            open(pendingAlt, reading, true);
          } else {
            open(nextReadingSlot(), reading);
          }
          pendingAlt = null; pendingBreve = false; preTitle = [];
          continue;
        }
        case 'evangelio': {
          const evangelista = c.m[1].charAt(0).toUpperCase() + c.m[1].slice(1);
          const cita = line.replace(/^.*?\bsan\s+\S+\s*/i, '').trim();
          const reading = { titulo: preTitle.join(' '), evangelista, cita, texto: [] };
          if (pendingBreve && out.evangelio) {
            out.evangelio.breve = reading; field = 'evangelio.breve'; target = reading;
          } else if (out.evangelio && pendingAlt !== 'evangelio') {
            // Otro evangelio sin «O bien» (p. ej., Domingo de Pascua: el de la misa vespertina)
            notes.push('Evangelio adicional: ' + evangelista + ' ' + cita + ' (se guarda como alternativa)');
            out.evangelio.alternativas = out.evangelio.alternativas || [];
            out.evangelio.alternativas.push(reading);
            field = 'evangelio'; target = reading; skipping = false;
          } else {
            open('evangelio', reading, pendingAlt === 'evangelio');
          }
          pendingAlt = null; pendingBreve = false; preTitle = [];
          continue;
        }
      }
    }

    if (skipping) continue;

    // Línea de texto
    if (!field) { preTitle.push(line); continue; }
    if (field === 'salmo') {
      const r = line.match(/^R\s*\/?\s*\.?\s*(.*)$/);
      if (r && !target.respuesta && r[1]) { target.respuesta = r[1].trim(); continue; }
      if (r && !r[1]) continue; // «R.» suelto entre estrofas
      target.estrofas.push(line.replace(/\s*R\s*\/?\s*\.?$/, '').trim());
      continue;
    }
    target.texto.push(line);
  }

  return { partes: out, notas: notes };
}

// ---------------------------------------------------------------------------
// Revisión

const REQUIRED = ['antifonaEntrada', 'colecta', 'lectura1', 'salmo', 'evangelio', 'ofrendas', 'antifonaComunion', 'postcomunion'];
const VOSOTROS = /\b(vosotros|vosotras|vuestr[oa]s?|tomad|comed|bebed|haced|sois|estáis|tenéis|habéis)\b/i;

function check(id, partes) {
  const issues = [];
  const isSunday = /^(adv|cua|pas|to)-\d+$/.test(id) || ['cua-ramos', 'pas-ascension', 'pas-pentecostes', 'to-trinidad', 'to-corpus', 'nav-sagrada-familia', 'nav-epifania', 'nav-bautismo', 'nav-dia', 'nav-noche', 'nav-aurora', 'nav-vigilia', 'nav-maria-madre', 'pas-domingo'].includes(id);
  for (const f of REQUIRED) if (!partes[f]) issues.push('falta ' + f);
  if (isSunday && !partes.lectura2) issues.push('falta lectura2');
  for (const f of ['lectura1', 'lectura2', 'evangelio']) {
    if (partes[f] && !partes[f].texto.length) issues.push(f + ' sin texto');
    if (partes[f] && !partes[f].cita) issues.push(f + ' sin cita');
  }
  for (const f of ['antifonaEntrada', 'antifonaComunion', 'colecta', 'ofrendas', 'postcomunion', 'aclamacion']) {
    if (partes[f] && !partes[f].texto.length) issues.push(f + ' vacía');
  }
  if (partes.salmo && (!partes.salmo.respuesta || !partes.salmo.estrofas.length)) issues.push('salmo incompleto');
  if (VOSOTROS.test(JSON.stringify(partes))) issues.push('contiene formas de «vosotros»');
  return issues;
}

// ---------------------------------------------------------------------------

// Misas cuya página necesita un tratamiento propio (estructura distinta de la
// misa habitual). Se extraen igual, pero quedan marcadas para revisión a mano.
const MANUAL = {
  'cua-ramos': 'Incluye la conmemoración de la entrada del Señor en Jerusalén (procesión con su evangelio) y la Pasión.',
  'pas-viernes-santo': 'No es una misa: celebración de la Pasión con su propia estructura.',
  'pas-vigilia': 'Vigilia Pascual: lucernario, siete lecturas del Antiguo Testamento con sus salmos y oraciones, epístola, liturgia bautismal.',
  'cua-jueves-santo': 'Incluye el lavatorio de los pies y la traslación del Santísimo.',
  'sem-crismal': 'Incluye la bendición de los óleos y la renovación de las promesas sacerdotales.'
};

const result = {};
const report = [];
let pairs = 0, clean = 0;

for (const [id, entry] of Object.entries(index.misas)) {
  for (const ciclo of ['A', 'B', 'C']) {
    const src = entry[ciclo];
    if (!src) continue;
    pairs++;
    const page = index.paginas[src.fecha];
    const lines = pageLines(fs.readFileSync(path.join(DIR, 'paginas', src.fecha + '.html'), 'utf8'));
    const subs = splitSubmasses(lines);
    let mine = lines;
    let nota = '';
    if (subs) {
      const want = SUBMASS_FOR[id] || 'dia';
      if (subs[want]) mine = subs[want];
      else {
        // La página no trae esta misa: no se extrae nada de ella
        result[id] = result[id] || { nombre: entry.nombre };
        result[id][ciclo] = { fuente: { url: page.url, fecha: src.fecha }, partes: null,
          revisar: ['La página trae ' + Object.keys(subs).join(', ') + ', pero no la misa buscada (' + want + ').'] };
        report.push({ id, ciclo, fecha: src.fecha, issues: result[id][ciclo].revisar });
        continue;
      }
    }
    const { partes, notas } = parseMass(mine);
    const issues = check(id, partes);
    if (nota) issues.unshift(nota);
    notas.filter(n => !n.startsWith('Evangelio adicional')).forEach(n => issues.push(n));
    if (MANUAL[id]) issues.unshift('revisión a mano: ' + MANUAL[id]);
    if (!issues.length) clean++;

    result[id] = result[id] || { nombre: entry.nombre };
    result[id][ciclo] = {
      fuente: { url: page.url, fecha: src.fecha, descargado: page.descargado, sha256: page.sha256 },
      partes,
      notas,
      revisar: issues
    };
    if (issues.length) report.push({ id, ciclo, fecha: src.fecha, issues });
  }
}

// Las antífonas y oraciones de una misa son las mismas en los tres ciclos:
// si difieren entre las páginas, hay un error de extracción o de la fuente.
const PROPERS = ['antifonaEntrada', 'colecta', 'ofrendas', 'antifonaComunion', 'postcomunion', 'oracionSobreElPueblo'];
const flat = p => (p && p.texto ? p.texto.join(' ') : '').replace(/\s+/g, ' ').trim();
function wordDiff(a, b) {
  const A = a.split(' '), B = b.split(' ');
  let i = 0; while (i < A.length && i < B.length && A[i] === B[i]) i++;
  let j = 0; while (j < A.length - i && j < B.length - i && A[A.length - 1 - j] === B[B.length - 1 - j]) j++;
  return '«' + A.slice(i, A.length - j).join(' ') + '» / «' + B.slice(i, B.length - j).join(' ') + '»';
}
const differences = [];
let identical = 0;
for (const [id, m] of Object.entries(result)) {
  for (const f of PROPERS) {
    const vals = ['A', 'B', 'C'].filter(c => m[c] && m[c].partes && m[c].partes[f]).map(c => [c, flat(m[c].partes[f])]);
    if (vals.length < 2) continue;
    const distinct = [...new Set(vals.map(v => v[1]))];
    if (distinct.length === 1) { identical++; continue; }
    const counts = distinct.map(t => vals.filter(v => v[1] === t).length);
    const majority = counts.indexOf(Math.max(...counts));
    vals.filter(v => v[1] !== distinct[majority]).forEach(v => {
      differences.push({ id, parte: f, ciclo: v[0], diferencia: wordDiff(distinct[majority], v[1]), mayoria: counts[majority] > 1 });
    });
  }
}

fs.writeFileSync(path.join(DIR, 'extraido.json'), JSON.stringify({
  fuente: index.fuente,
  nota: 'Extraído automáticamente de las páginas guardadas. Ver revision.md antes de usar.',
  generado: new Date().toISOString(),
  misas: result
}, null, 2) + '\n', 'utf8');

const md = ['# Revisión de la extracción de Eucaristía Diaria', '',
  'Generado por `fuentes/extraer_eucaristiadiaria.js`. ' + clean + ' de ' + pairs + ' pares misa-ciclo sin observaciones.', '',
  '| Misa | Ciclo | Página | Observaciones |', '| :-- | :-- | :-- | :-- |',
  ...report.map(r => '| `' + r.id + '` | ' + r.ciclo + ' | ' + r.fecha + ' | ' + r.issues.join('; ').replace(/\|/g, '/') + ' |'), '',
  '## Antífonas y oraciones que difieren entre ciclos', '',
  'Deberían ser iguales en los tres ciclos. ' + identical + ' coinciden; ' + differences.length + ' difieren. Se muestra el texto de la mayoría frente al del ciclo indicado (solo la parte distinta). «Sin mayoría» = los ciclos no coinciden entre sí.', '',
  '| Misa | Parte | Ciclo | Mayoría / este ciclo |', '| :-- | :-- | :-- | :-- |',
  ...differences.map(d => '| `' + d.id + '` | ' + d.parte + ' | ' + d.ciclo + (d.mayoria ? '' : ' (sin mayoría)') + ' | ' + d.diferencia.replace(/\|/g, '/').slice(0, 400) + ' |'), ''];
fs.writeFileSync(path.join(DIR, 'revision.md'), md.join('\n'), 'utf8');

console.log('Pares misa-ciclo:', pairs, '· sin observaciones:', clean, '· con observaciones:', report.length);
console.log('Antífonas y oraciones iguales entre ciclos:', identical, '· distintas:', differences.length);
