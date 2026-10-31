// Pruebas de los textos para Chile (textos_chile.json). Ejecutar con: node test_textos.js
const assert = require('assert');
const db = require('./liturgia_db.json');
const textos = require('./textos_chile.json');

const ids = new Set(db.misas.map(m => m.id));
const VOSOTROS = /\b(vosotros|vosotras|vuestr[oa]s?|sois|estáis|tenéis|habéis|tomad|comed|bebed|haced|orad|podéis|sabéis)\b/i;
let failures = 0;
function check(name, fn) {
  try { fn(); } catch (e) { failures++; console.error('✗ ' + name + '\n   ' + e.message); }
}

const entries = Object.entries(textos.misas);
check('hay textos', () => assert.ok(entries.length >= 60, 'solo ' + entries.length + ' misas'));

for (const [id, m] of entries) {
  check(id + ' existe en el catálogo', () => assert.ok(ids.has(id)));
  for (const [f, part] of Object.entries(m.comunes)) {
    if (part && typeof part === 'object' && !Array.isArray(part)) {
      check(id + ' ' + f + ' tiene fuente', () => assert.ok(part.fuente && part.fuente.url && part.fuente.fecha));
      check(id + ' ' + f + ' tiene texto', () => assert.ok(part.texto && part.texto.join('').trim().length > 10));
    }
  }
  for (const [c, cyc] of Object.entries(m.ciclos)) {
    const name = id + ' ciclo ' + c;
    check(name + ': fuente', () => assert.ok(cyc.fuente && /eucaristiadiaria\.cl/.test(cyc.fuente.url)));
    check(name + ': primera lectura', () => assert.ok(cyc.lectura1.cita && cyc.lectura1.encabezado && cyc.lectura1.texto.length));
    check(name + ': salmo', () => assert.ok(cyc.salmo.respuesta && cyc.salmo.estrofas.length >= 2));
    check(name + ': evangelio', () => assert.ok(/^(Mateo|Marcos|Lucas|Juan)$/.test(cyc.evangelio.evangelista) && cyc.evangelio.cita && cyc.evangelio.texto.length));
  }
  check(id + ': sin «vosotros»', () => {
    const m2 = JSON.stringify(m).match(VOSOTROS);
    assert.ok(!m2, 'aparece «' + (m2 && m2[0]) + '»');
  });
}

// En los domingos del Tiempo Ordinario, el evangelio de cada ciclo es el de su evangelista
// (salvo San Juan, que completa algunos domingos, sobre todo del ciclo B)
const EXPECTED = { A: 'Mateo', B: 'Marcos', C: 'Lucas' };
for (const [id, m] of entries.filter(([id]) => /^to-\d+$/.test(id))) {
  for (const [c, cyc] of Object.entries(m.ciclos)) {
    check(id + ' ciclo ' + c + ': evangelista', () => {
      const ev = cyc.evangelio.evangelista;
      assert.ok(ev === EXPECTED[c] || ev === 'Juan', ev);
    });
  }
}

if (failures) { console.error('\n' + failures + ' prueba(s) fallida(s)'); process.exit(1); }
console.log('✓ Textos para Chile: todas las pruebas pasan (' + entries.length + ' misas)');
