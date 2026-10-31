// Pruebas del calendario litúrgico. Ejecutar con: node test_calendar.js
const assert = require('assert');
const cal = require('./liturgical_calendar.js');
const db = require('./liturgia_db.json');

const ids = new Set(db.misas.map(m => m.id));
const d = (y, m, day) => new Date(y, m - 1, day);
const iso = date => date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');

let failures = 0;
function check(name, fn) {
  try { fn(); }
  catch (e) { failures++; console.error('✗ ' + name + '\n   ' + e.message); }
}

// Domingo de Pascua
[[2008, 3, 23], [2019, 4, 21], [2024, 3, 31], [2025, 4, 20], [2026, 4, 5], [2027, 3, 28], [2038, 4, 25]]
  .forEach(([y, m, day]) => check('Pascua ' + y, () => assert.strictEqual(iso(cal.easter(y)), iso(d(y, m, day)))));

// Fechas concretas -> celebración esperada
const expected = [
  // 2022-2023: Navidad en domingo, Año Nuevo en domingo, Epifanía el 8 de enero
  [d(2022, 12, 30), 'nav-sagrada-familia'],
  [d(2023, 1, 1), 'nav-maria-madre'],
  [d(2023, 1, 8), 'nav-epifania'],
  [d(2023, 1, 9), 'nav-bautismo'],
  [d(2023, 1, 15), 'to-2'],
  [d(2023, 12, 24), 'adv-4'],
  [d(2023, 12, 31), 'nav-sagrada-familia'],
  // 2025
  [d(2025, 1, 5), 'nav-epifania'],
  [d(2025, 1, 12), 'nav-bautismo'],
  [d(2025, 1, 19), 'to-2'],
  [d(2025, 3, 2), 'to-8'],
  [d(2025, 3, 5), 'cua-ceniza'],
  [d(2025, 6, 8), 'pas-pentecostes'],
  [d(2025, 6, 15), 'to-trinidad'],
  [d(2025, 6, 22), 'to-corpus'],
  [d(2025, 6, 27), 'to-sagrado-corazon'],
  [d(2025, 6, 29), 'to-13'],
  [d(2025, 11, 23), 'to-34'],
  [d(2025, 11, 30), 'adv-1'],
  // 2026
  [d(2026, 1, 4), 'nav-epifania'],
  [d(2026, 1, 11), 'nav-bautismo'],
  [d(2026, 2, 15), 'to-6'],
  [d(2026, 2, 18), 'cua-ceniza'],
  [d(2026, 2, 22), 'cua-1'],
  [d(2026, 3, 15), 'cua-4'],
  [d(2026, 3, 29), 'cua-ramos'],
  [d(2026, 4, 2), 'cua-jueves-santo'],
  [d(2026, 4, 3), 'pas-viernes-santo'],
  [d(2026, 4, 4), 'pas-sabado-santo'],
  [d(2026, 4, 5), 'pas-domingo'],
  [d(2026, 4, 6), 'pas-lunes-octava'],
  [d(2026, 4, 12), 'pas-2'],
  [d(2026, 5, 17), 'pas-ascension'],
  [d(2026, 5, 24), 'pas-pentecostes'],
  [d(2026, 6, 14), 'to-11'],
  [d(2026, 11, 1), 'to-31'],
  [d(2026, 11, 22), 'to-34'],
  [d(2026, 11, 29), 'adv-1'],
  [d(2026, 12, 20), 'adv-4'],
  [d(2026, 12, 24), 'nav-vigilia'],
  [d(2026, 12, 25), 'nav-dia'],
  [d(2026, 12, 27), 'nav-sagrada-familia'],
];
expected.forEach(([date, id]) => check(iso(date) + ' -> ' + id, () => {
  const c = cal.celebrationFor(date);
  assert.ok(c, 'sin celebración');
  assert.strictEqual(c.id, id);
}));

// Ferias sin misa en el catálogo
[d(2026, 10, 31), d(2026, 7, 15), d(2026, 12, 26)].forEach(date =>
  check(iso(date) + ' es feria', () => assert.strictEqual(cal.celebrationFor(date), null)));

// Aviso cuando una fiesta ocupa el lugar del domingo
check('Todos los Santos 2026 avisa', () => assert.match(cal.celebrationFor(d(2026, 11, 1)).nota, /Todos los Santos/));
check('Domingo común sin aviso', () => assert.strictEqual(cal.celebrationFor(d(2026, 11, 8)).nota, ''));

// Ciclo dominical
check('Ciclo 2025-01-05 = C', () => assert.strictEqual(cal.sundayCycle(d(2025, 1, 5)), 'C'));
check('Ciclo 2026-10-31 = A', () => assert.strictEqual(cal.sundayCycle(d(2026, 10, 31)), 'A'));
check('Ciclo 2026-11-29 = B', () => assert.strictEqual(cal.sundayCycle(d(2026, 11, 29)), 'B'));

// Año par/impar de las ferias (coincide con eucaristiadiaria.cl: «Inicio ciclo B - año impar», 29-11-2026)
check('Ferias 2026-10-31 = II', () => assert.strictEqual(cal.weekdayCycle(d(2026, 10, 31)), 'II'));
check('Ferias 2026-11-29 = I', () => assert.strictEqual(cal.weekdayCycle(d(2026, 11, 29)), 'I'));
check('Ferias 2025-06-10 = I', () => assert.strictEqual(cal.weekdayCycle(d(2025, 6, 10)), 'I'));

// Fechas móviles: coinciden con celebrationFor
check('Fechas móviles 2026', () => {
  const ids = { 'Miércoles de Ceniza': 'cua-ceniza', 'Domingo de Pascua': 'pas-domingo', 'Ascensión del Señor': 'pas-ascension',
    'Pentecostés': 'pas-pentecostes', 'Cuerpo y Sangre de Cristo': 'to-corpus', 'I Domingo de Adviento': 'adv-1',
    'Jesucristo, Rey del Universo': 'to-34', 'Epifanía del Señor': 'nav-epifania', 'Sagrada Familia': 'nav-sagrada-familia' };
  const list = cal.movableDates(2026);
  assert.strictEqual(list.length, 15);
  for (const x of list) if (ids[x.nombre]) assert.strictEqual(cal.celebrationFor(x.fecha).id, ids[x.nombre], x.nombre);
  assert.strictEqual(iso(list.find(x => x.nombre === 'Miércoles de Ceniza').fecha), '2026-02-18');
});
check('Pascua entre el 22 de marzo y el 25 de abril (1900-2199)', () => {
  for (let y = 1900; y < 2200; y++) {
    const e = cal.easter(y), md = (e.getMonth() + 1) * 100 + e.getDate();
    assert.ok(md >= 322 && md <= 425 && e.getDay() === 0, 'Pascua ' + y + ': ' + iso(e));
  }
});

// Hoy o la próxima
check('Sábado 2026-10-31 -> domingo siguiente', () => {
  const c = cal.todayOrNext(d(2026, 10, 31));
  assert.strictEqual(c.id, 'to-31');
  assert.strictEqual(c.esHoy, false);
  assert.strictEqual(c.diasHasta, 1);
  assert.strictEqual(iso(c.fecha), '2026-11-01');
});

// Barrido 2000-2100: todo domingo tiene celebración, todo id existe en el catálogo,
// y cada año produce cada domingo del Tiempo Ordinario a lo sumo una vez.
check('Barrido 2000-2100', () => {
  const reached = new Set();
  for (let y = 2000; y <= 2100; y++) {
    const seen = new Map();
    for (let t = d(y, 1, 1); t.getFullYear() === y; t = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1)) {
      const c = cal.celebrationFor(t);
      if (t.getDay() === 0) assert.ok(c, 'domingo sin celebración: ' + iso(t));
      if (!c) continue;
      assert.ok(ids.has(c.id), 'id inexistente ' + c.id + ' en ' + iso(t));
      c.alternativas.forEach(a => assert.ok(ids.has(a), 'alternativa inexistente ' + a));
      reached.add(c.id);
      c.alternativas.forEach(a => reached.add(a));
      if (/^to-\d+$/.test(c.id)) {
        assert.ok(!seen.has(c.id), c.id + ' repetido en ' + iso(t) + ' y ' + seen.get(c.id));
        seen.set(c.id, iso(t));
      }
    }
  }
  const unreachable = [...ids].filter(id => !reached.has(id)).sort();
  // to-1: el Domingo I lo ocupa el Bautismo. pas-7: en Chile la Ascensión se celebra ese domingo.
  assert.deepStrictEqual(unreachable, ['pas-7', 'to-1']);
});

if (failures) { console.error('\n' + failures + ' prueba(s) fallida(s)'); process.exit(1); }
console.log('✓ Calendario litúrgico: todas las pruebas pasan');
