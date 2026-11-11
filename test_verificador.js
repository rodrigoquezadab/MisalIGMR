// Pruebas de «Seguir la Misa». Ejecutar con: node test_verificador.js
// Cada cita entre comillas debe aparecer literalmente en su fuente guardada,
// cada número IGMR debe existir, y no debe quedar ninguna forma de «vosotros».
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { PARTES, FUENTES } = require('./verificador_datos.js');

const extractor = fs.readFileSync(path.join(__dirname, 'fuentes/extraer_eucaristiadiaria.js'), 'utf8');
const decodeEntities = new Function(extractor.slice(extractor.indexOf('const ENTITIES'), extractor.indexOf('// Líneas de contenido')) + '; return decodeEntities;')();

const norm = s => s.normalize('NFC').replace(/[​﻿]/g, '').replace(/[«»“”"]/g, '').replace(/\s+/g, ' ').toLowerCase().trim();
const pageText = file => norm(decodeEntities(fs.readFileSync(file, 'utf8')
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ')));

const texts = {};
function sourceText(key) {
  if (texts[key]) return texts[key];
  const f = FUENTES[key];
  assert.ok(f, 'fuente desconocida: ' + key);
  const p = path.join(__dirname, f.archivo);
  texts[key] = fs.statSync(p).isDirectory()
    ? fs.readdirSync(p).map(n => pageText(path.join(p, n))).join(' ¶ ')
    : pageText(p);
  return texts[key];
}

const igmrNums = new Set(require('./igmr_full_399.json').map(x => x.num));
const VOSOTROS = /\b(vosotros|vosotras|vuestr[oa]s?|os|sois|tomad|comed|bebed|haced|orad|podéis|id)\b/i;

let failures = 0, quotes = 0;
function check(name, fn) {
  try { fn(); } catch (e) { failures++; console.error('✗ ' + name + '\n   ' + e.message); }
}

const ids = new Set();
for (const part of PARTES) {
  for (const p of part.pasos) {
    check(p.id + ': id único', () => { assert.ok(!ids.has(p.id)); ids.add(p.id); });
    check(p.id + ': IGMR', () => {
      assert.ok(p.igmr.length);
      p.igmr.forEach(n => assert.ok(igmrNums.has(n), 'IGMR ' + n));
    });
    for (const k of ['domingo', 'semana']) {
      check(p.id + ': ' + k, () => assert.ok(!p[k] || ['si', 'puede', 'no'].includes(p[k])));
    }
    for (const side of ['inicio', 'fin']) {
      const x = p[side];
      check(p.id + ' ' + side + ': tiene contenido', () => assert.ok(x && (x.nota || x.cita)));
      if (x && x.cita) {
        quotes++;
        check(p.id + ' ' + side + ': «' + x.cita.slice(0, 50) + '» está en ' + x.fuente, () => {
          assert.ok(sourceText(x.fuente).includes(norm(x.cita)), 'no se encontró en la fuente');
        });
      }
    }
    check(p.id + ': sin «vosotros»', () => {
      const visible = [p.titulo, p.nota, p.inicio.nota, p.inicio.cita, p.inicio.antes, p.inicio.despues,
        p.fin.nota, p.fin.cita, p.fin.antes, p.fin.despues].filter(Boolean).join(' ');
      const m = visible.match(VOSOTROS);
      assert.ok(!m, 'aparece «' + (m && m[0]) + '»');
    });
  }
}

// La consagración: materia y palabras sobre el pan y el vino, marcadas como esenciales
const cons = PARTES.find(x => x.id === 'consagracion');
check('consagración: pasos esenciales', () => {
  assert.deepStrictEqual(cons.pasos.filter(p => p.esencial).map(p => p.id), ['materia', 'pan', 'caliz']);
});
check('consagración: palabras completas sobre el pan y el cáliz', () => {
  const pan = cons.pasos.find(p => p.id === 'pan').fin.cita;
  const caliz = cons.pasos.find(p => p.id === 'caliz').fin.cita;
  assert.match(pan, /^TOMEN Y COMAN TODOS DE ÉL, PORQUE ESTO ES MI CUERPO/);
  assert.match(caliz, /^TOMEN Y BEBAN TODOS DE ÉL, PORQUE ÉSTE ES EL CÁLIZ DE MI SANGRE.*HAGAN ESTO EN CONMEMORACIÓN MÍA\.$/);
});
check('domingo y semana: el domingo tiene segunda lectura y Credo; la semana no', () => {
  const all = PARTES.flatMap(x => x.pasos);
  const get = id => all.find(p => p.id === id);
  assert.strictEqual(get('lectura2').semana, 'no');
  assert.strictEqual(get('credo').semana, 'no');
  assert.strictEqual(get('homilia').domingo, 'si');
});

if (failures) { console.error('\n' + failures + ' prueba(s) fallida(s)'); process.exit(1); }
console.log('✓ Seguir la Misa: todas las pruebas pasan (' + ids.size + ' pasos, ' + quotes + ' citas verificadas en su fuente)');
