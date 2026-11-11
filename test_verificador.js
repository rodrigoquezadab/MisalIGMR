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
      check(p.id + ': ' + k, () => assert.ok(!p[k] || p[k] === 'no'));
    }
    check(p.id + ': tiene frase o explicación', () => assert.ok(p.inicio || p.fin || p.nota));
    for (const side of ['inicio', 'fin']) {
      const x = p[side];
      // «Comienza» y «Termina» solo llevan la frase exacta: nada de descripciones ni añadidos
      check(p.id + ' ' + side + ': solo frase exacta', () => {
        if (!x) return;
        assert.ok(x.cita && x.fuente, 'falta la cita o la fuente');
        assert.deepStrictEqual(Object.keys(x).filter(k => !['cita', 'fuente', 'sigue'].includes(k)), []);
      });
      if (x && x.cita) {
        quotes++;
        check(p.id + ' ' + side + ': «' + x.cita.slice(0, 50) + '» está en ' + x.fuente, () => {
          assert.ok(sourceText(x.fuente).includes(norm(x.cita)), 'no se encontró en la fuente');
        });
      }
    }
    check(p.id + ': sin «vosotros»', () => {
      const visible = [p.titulo, p.tituloSemana, p.nota, p.inicio && p.inicio.cita, p.fin && p.fin.cita].filter(Boolean).join(' ');
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
  assert.ok(cons.pasos.find(p => p.id === 'pan').palabras && cons.pasos.find(p => p.id === 'caliz').palabras);
  assert.match(pan, /^TOMEN Y COMAN TODOS DE ÉL, PORQUE ESTO ES MI CUERPO/);
  assert.match(caliz, /^TOMEN Y BEBAN TODOS DE ÉL, PORQUE ÉSTE ES EL CÁLIZ DE MI SANGRE.*HAGAN ESTO EN CONMEMORACIÓN MÍA\.$/);
});
check('domingo y semana: el domingo tiene segunda lectura, Gloria y Credo; la semana no', () => {
  const all = PARTES.flatMap(x => x.pasos);
  const get = id => all.find(p => p.id === id);
  assert.strictEqual(get('lectura2').semana, 'no');
  assert.strictEqual(get('credo').semana, 'no');
  assert.strictEqual(get('gloria').semana, 'no');
  assert.ok(!get('homilia').domingo, 'la homilía está en la Misa dominical');
});

if (failures) { console.error('\n' + failures + ' prueba(s) fallida(s)'); process.exit(1); }
console.log('✓ Seguir la Misa: todas las pruebas pasan (' + ids.size + ' pasos, ' + quotes + ' citas verificadas en su fuente)');
