// Une los textos extraídos de los tres ciclos en un solo archivo para la app.
//
// Uso: node fuentes/unir_textos.js   (después de extraer_eucaristiadiaria.js)
// Lee  fuentes/eucaristiadiaria/extraido.json
// Escribe textos_chile.json (lo usa build_complete_app.js)
//
// Reglas (MEMORIA_DE_TRABAJO.md, paso 3):
// - Antífona de entrada y oraciones: son las mismas en los tres ciclos. Se
//   usa el texto en que coincide la mayoría de las páginas; si hay empate, el
//   de la página más reciente. Se anota qué ciclos coinciden.
// - Lecturas, salmo, aclamación, evangelio y antífona de comunión: del ciclo
//   correspondiente (la antífona de comunión puede depender del evangelio).
// - Las celebraciones con estructura propia (Ramos, Crismal, Jueves Santo,
//   Viernes Santo, Vigilia Pascual) quedan fuera hasta revisarlas a mano.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const extracted = JSON.parse(fs.readFileSync(path.join(__dirname, 'eucaristiadiaria', 'extraido.json'), 'utf8'));

const MANUAL = ['cua-ramos', 'sem-crismal', 'cua-jueves-santo', 'pas-viernes-santo', 'pas-vigilia', 'pas-sabado-santo'];
const COMMON = ['antifonaEntrada', 'colecta', 'ofrendas', 'postcomunion', 'oracionSobreElPueblo'];
const BY_CYCLE = ['lectura1', 'salmo', 'lectura2', 'secuencia', 'aclamacion', 'evangelio', 'antifonaComunion'];
const REQUIRED_BY_CYCLE = ['lectura1', 'salmo', 'evangelio'];

const flat = p => (p && p.texto ? p.texto.join(' ') : '').replace(/\s+/g, ' ').trim();

function source(entry) {
  return { url: entry.fuente.url, fecha: entry.fuente.fecha };
}

const out = {};
const summary = { misas: 0, ciclos: 0, omitidas: [], sinCiclo: [] };

for (const [id, m] of Object.entries(extracted.misas)) {
  if (MANUAL.includes(id)) { summary.omitidas.push(id); continue; }
  const cycles = ['A', 'B', 'C'].filter(c => m[c] && m[c].partes);
  if (!cycles.length) continue;

  const mass = { nombre: m.nombre, comunes: {}, ciclos: {}, notas: [] };

  // Partes comunes: mayoría entre ciclos
  for (const f of COMMON) {
    const candidates = cycles.filter(c => m[c].partes[f] && flat(m[c].partes[f])).map(c => ({ c, part: m[c].partes[f], text: flat(m[c].partes[f]), fecha: m[c].fuente.fecha }));
    if (!candidates.length) continue;
    const groups = {};
    candidates.forEach(x => { (groups[x.text] = groups[x.text] || []).push(x); });
    const best = Object.values(groups).sort((a, b) =>
      b.length - a.length || Math.max(...b.map(x => x.fecha.replace(/-/g, ''))) - Math.max(...a.map(x => x.fecha.replace(/-/g, ''))))[0];
    const newest = best.slice().sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
    mass.comunes[f] = Object.assign({}, newest.part, {
      fuente: source(m[newest.c]),
      coincidenCiclos: best.map(x => x.c).sort()
    });
    if (Object.keys(groups).length > 1) {
      mass.notas.push(f + ': los ciclos no coinciden; se usa el de ' + best.map(x => x.c).join(', ') + '.');
    }
  }

  // Gloria, Credo y rúbricas: de la página más reciente que los indique
  const newestCycle = cycles.slice().sort((a, b) => m[b].fuente.fecha.localeCompare(m[a].fuente.fecha))[0];
  const np = m[newestCycle].partes;
  if (typeof np.gloria === 'boolean') mass.comunes.gloria = np.gloria;
  if (np.credo) mass.comunes.credo = true;
  if (np.rubricas) mass.comunes.rubricas = np.rubricas;
  if (np.bendicionSolemne) mass.comunes.bendicionSolemne = Object.assign({}, np.bendicionSolemne, { fuente: source(m[newestCycle]) });

  // Partes de cada ciclo
  for (const c of cycles) {
    const p = m[c].partes;
    const missing = REQUIRED_BY_CYCLE.filter(f => !p[f] || (p[f].texto && !p[f].texto.length) || (p[f].estrofas && !p[f].estrofas.length));
    if (missing.length) {
      mass.notas.push('Ciclo ' + c + ': falta ' + missing.join(', ') + ' en la fuente; no se usa.');
      continue;
    }
    const cycle = { fuente: source(m[c]) };
    for (const f of BY_CYCLE) if (p[f]) cycle[f] = p[f];
    mass.ciclos[c] = cycle;
  }
  ['A', 'B', 'C'].filter(c => !mass.ciclos[c]).forEach(c => summary.sinCiclo.push(id + ' ' + c));

  if (!Object.keys(mass.ciclos).length && !Object.keys(mass.comunes).length) continue;
  if (!mass.notas.length) delete mass.notas;
  out[id] = mass;
  summary.misas++;
  summary.ciclos += Object.keys(mass.ciclos).length;
}

const result = {
  fuente: 'Eucaristía Diaria — Departamento de Liturgia del Arzobispado de Santiago (eucaristiadiaria.cl)',
  edicion: 'Misal Romano y Leccionario de la edición para Argentina, Bolivia, Chile, Paraguay y Uruguay, según los publica la fuente',
  nota: 'Textos con derechos de autor, usados para preparar la app antes de pedir permiso. Generado por fuentes/unir_textos.js; no editar a mano.',
  generado: new Date().toISOString(),
  misas: out
};
fs.writeFileSync(path.join(ROOT, 'textos_chile.json'), JSON.stringify(result, null, 1) + '\n', 'utf8');

console.log('Misas con textos de Chile:', summary.misas, '· ciclos con lecturas:', summary.ciclos);
console.log('Fuera hasta revisión a mano:', summary.omitidas.join(', '));
console.log('Sin lecturas de la fuente:', summary.sinCiclo.join(', ') || 'ninguno');
