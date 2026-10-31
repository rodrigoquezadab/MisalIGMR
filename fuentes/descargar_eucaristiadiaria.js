// Descarga desde eucaristiadiaria.cl (Departamento de Liturgia del Arzobispado
// de Santiago) las páginas de los días que corresponden a cada misa del
// catálogo, en los ciclos A, B y C, y las guarda tal cual para poder citarlas.
//
// Uso: node fuentes/descargar_eucaristiadiaria.js [--forzar]
//   --forzar  vuelve a descargar páginas que ya están guardadas
//
// Resultado:
//   fuentes/eucaristiadiaria/paginas/AAAA-MM-DD.html  página original (fuera de git)
//   fuentes/eucaristiadiaria/indice.json              de dónde sale cada misa
//
// Las páginas no se suben al repositorio porque es público y los textos tienen
// derechos de autor. El índice guarda el sha256 de cada una: al volver a
// descargarlas se puede comprobar que son las mismas.
//
// Para cada misa y ciclo se elige la fecha más reciente que el sitio tenga.
// La fecha se calcula con liturgical_calendar.js; el título que trae cada
// página se guarda en el índice para comprobar que el cálculo coincide con
// el calendario que usa el sitio.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const cal = require(path.join(ROOT, 'liturgical_calendar.js'));
const db = require(path.join(ROOT, 'liturgia_db.json'));

const BASE = 'https://www.eucaristiadiaria.cl';
const OUT = path.join(__dirname, 'eucaristiadiaria');
const PAGES = path.join(OUT, 'paginas');
const FORCE = process.argv.includes('--forzar');
const PAUSE_MS = 1000;

// curl respeta el proxy del entorno; fetch de Node no siempre.
function download(url) {
  return execFileSync('curl', ['-sS', '-L', '--fail', '--retry', '3', '--retry-delay', '2', url], { maxBuffer: 20 * 1024 * 1024 });
}

function sleep(ms) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); }

function iso(date) {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}

function parseIso(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }

const ENTITIES = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', laquo: '«', raquo: '»', mdash: '—', ndash: '–',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', hellip: '…', ordm: 'º', ordf: 'ª', iexcl: '¡', iquest: '¿' };
function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([aeiouAEIOUnNcCy])(acute|tilde|uml|cedil|grave|circ);/g, (_, l, mark) =>
      (l + { acute: '\u0301', tilde: '\u0303', uml: '\u0308', cedil: '\u0327', grave: '\u0300', circ: '\u0302' }[mark]).normalize('NFC'))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name] !== undefined ? ENTITIES[name] : m);
}

function pageText(html) {
  return decodeEntities(html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/\u200b/g, ''))
    .split('\n').map(l => l.trim()).filter(Boolean);
}

// Las líneas que el sitio pone entre «(Ver Ordinario de la Misa)» y la
// primera antífona u oración: fecha, nombre de la celebración, color, ciclo.
function pageHeading(html) {
  const lines = pageText(html);
  const start = lines.findIndex(l => l.startsWith('(Ver Ordinario'));
  if (start < 0) return [];
  const out = [];
  for (const l of lines.slice(start + 1)) {
    if (/^(Antífona|ORACIÓN|LITURGIA|Sugerencias|Misa |PRIMERA|SOLEMNE)/i.test(l) || out.length >= 6) break;
    out.push(l);
  }
  return out;
}

// 1. Fechas que el sitio tiene publicadas
const calendarHtml = download(BASE + '/calendario.php').toString('utf8');
const available = new Set((calendarHtml.match(/"(\d{4}-\d\d-\d\d)": \{/g) || [])
  .map(s => s.slice(1, 11))
  .filter(s => !s.startsWith('0000')));
const sortedDates = [...available].sort();
console.log('Fechas publicadas:', available.size, '(' + sortedDates[0] + ' a ' + sortedDates[sortedDates.length - 1] + ')');

// 2. Para cada misa y ciclo, la fecha más reciente disponible.
//
// Dónde pone el sitio cada misa (comprobado en las páginas descargadas):
// - La Misa de la Vigilia de Navidad está en la página del 25 de diciembre,
//   con las de la Noche, la Aurora y el Día; la del 24 es la feria de Adviento.
// - La Vigilia Pascual está en la página del Sábado Santo.
// - El Sábado Santo no tiene misa propia: no se le asigna página.
// - Cuando una fiesta ocupa el lugar de un domingo del Tiempo Ordinario
//   (Todos los Santos, San Pedro y San Pablo…), la página trae la fiesta y no
//   el domingo; esos días no sirven para ese domingo.
const NO_MASS = { 'pas-sabado-santo': 'Día sin misa; la página del Sábado Santo trae la Vigilia Pascual.' };

function addDay(s, n) { const d = parseIso(s); d.setDate(d.getDate() + n); return iso(d); }

function sourcesForDay(day) {
  const c = cal.celebrationFor(parseIso(day));
  if (!c) return [];
  const out = [];
  // La nota de un domingo del T. O. avisa que una fiesta lo reemplaza; en otros días solo explica el horario.
  const replaced = /^to-\d+$/.test(c.id) && c.nota;
  if (!replaced) out.push({ id: c.id, page: day, alt: false });
  c.alternativas.forEach(id => out.push({ id, page: day, alt: true }));
  return out.map(x => {
    if (x.id === 'nav-vigilia' || x.id === 'nav-noche' || x.id === 'nav-aurora') {
      const dec25 = day.slice(0, 5) + '12-25';
      return { id: x.id, page: dec25, alt: false };
    }
    if (x.id === 'pas-vigilia') return c.id === 'pas-sabado-santo' ? { id: x.id, page: day, alt: false } : null;
    return x;
  }).filter(x => x && !NO_MASS[x.id] && available.has(x.page));
}

const chosen = {}; // id -> ciclo -> { fecha, comoAlternativa }
for (const day of sortedDates) {
  const ciclo = cal.sundayCycle(parseIso(day));
  for (const x of sourcesForDay(day)) {
    chosen[x.id] = chosen[x.id] || {};
    const prev = chosen[x.id][ciclo];
    // Preferir el día propio de la misa a una página donde aparece como alternativa; luego, la más reciente
    if (!prev || (prev.comoAlternativa && !x.alt) || prev.comoAlternativa === x.alt) {
      chosen[x.id][ciclo] = { fecha: x.page, comoAlternativa: x.alt };
    }
  }
}

// 3. Descargar las páginas necesarias
fs.mkdirSync(PAGES, { recursive: true });
const indexPath = path.join(OUT, 'indice.json');
const previous = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath, 'utf8')) : { paginas: {} };
const needed = [...new Set(Object.values(chosen).flatMap(byCycle => Object.values(byCycle).map(x => x.fecha)))].sort();
const paginas = {};
let downloaded = 0;
for (const day of needed) {
  const file = path.join(PAGES, day + '.html');
  const url = BASE + '/dia_cal.php?fecha=' + day;
  let entry = previous.paginas[day];
  if (FORCE || !fs.existsSync(file) || !entry) {
    const body = download(url);
    fs.writeFileSync(file, body);
    entry = { url, descargado: new Date().toISOString() };
    downloaded++;
    process.stdout.write('.');
    sleep(PAUSE_MS);
  }
  const body = fs.readFileSync(file);
  paginas[day] = {
    url: entry.url,
    descargado: entry.descargado,
    bytes: body.length,
    sha256: crypto.createHash('sha256').update(body).digest('hex'),
    encabezado: pageHeading(body.toString('utf8'))
  };
}
if (downloaded) process.stdout.write('\n');

// Comprobar que las páginas de días con varias misas traigan la que buscamos
// (p. ej., la página del Jueves Santo de 2025 no trae la Misa Crismal).
const CONTENT_CHECKS = {
  'nav-vigilia': /vigilia/i,
  'nav-noche': /misa de la noche|medianoche/i,
  'nav-aurora': /aurora/i,
  'pas-vigilia': /vigilia pascual|lucernario|pregón/i,
  'sem-crismal': /crismal/i
};
const descartadas = [];
for (const [id, re] of Object.entries(CONTENT_CHECKS)) {
  for (const [ciclo, x] of Object.entries(chosen[id] || {})) {
    const text = pageText(fs.readFileSync(path.join(PAGES, x.fecha + '.html'), 'utf8')).join('\n');
    if (!re.test(text)) {
      delete chosen[id][ciclo];
      descartadas.push({ misa: id, ciclo, fecha: x.fecha, motivo: 'La página no trae esta misa.' });
    }
  }
}

// 4. Índice
const misas = {};
const misasSinCiclo = {};
for (const m of db.misas) {
  const byCycle = chosen[m.id] || {};
  misas[m.id] = { nombre: m.nombre };
  for (const ciclo of ['A', 'B', 'C']) {
    if (byCycle[ciclo]) misas[m.id][ciclo] = byCycle[ciclo];
  }
}
const sinFuente = {};
for (const m of db.misas) {
  if (NO_MASS[m.id]) sinFuente[m.id] = NO_MASS[m.id];
  else if (!chosen[m.id]) sinFuente[m.id] = 'No cayó en ninguna fecha publicada por el sitio.';
  else {
    const faltan = ['A', 'B', 'C'].filter(k => !chosen[m.id][k]);
    if (faltan.length) misasSinCiclo[m.id] = faltan;
  }
}

// Borrar páginas guardadas que ya no se usan
for (const f of fs.readdirSync(PAGES)) {
  if (f.endsWith('.html') && !paginas[f.replace('.html', '')]) fs.unlinkSync(path.join(PAGES, f));
}

const index = {
  fuente: 'Eucaristía Diaria — Departamento de Liturgia del Arzobispado de Santiago',
  sitio: BASE,
  nota: 'Textos con derechos de autor, guardados para preparar la app y pedir permiso (ver FUENTES_Y_CONSULTAS.md, D3). La fecha de cada misa se calculó con liturgical_calendar.js; el campo «encabezado» de cada página permite comprobarla.',
  generado: new Date().toISOString(),
  fechasPublicadas: { total: available.size, desde: sortedDates[0], hasta: sortedDates[sortedDates.length - 1] },
  sinFuente,
  ciclosFaltantes: misasSinCiclo,
  descartadas,
  misas,
  paginas
};
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

console.log('Páginas nuevas:', downloaded, '· páginas en el índice:', needed.length);
console.log('Misas sin página:', Object.keys(sinFuente).join(', ') || 'ninguna');
descartadas.forEach(d => console.log('Descartada:', d.misa, d.ciclo, d.fecha, '-', d.motivo));
console.log('Ciclos sin página:', Object.entries(misasSinCiclo).map(([id, c]) => id + ' (' + c.join(',') + ')').join(', ') || 'ninguno');
