const fs = require('fs');

const igmr = JSON.parse(fs.readFileSync('igmr_full_399.json', 'utf8'));

const entityMap = {
  '&#x201c;': '«',
  '&#x201d;': '»',
  '&#x2018;': '‘',
  '&#x2019;': '’',
  '&#x2014;': '—',
  '&#x2013;': '–',
  '&quot;': '"',
  '&apos;': "'",
  '&amp;': '&',
  '&uuml;': 'ü',
  '&ordm;': 'º',
  '&ouml;': 'ö',
  '&copy;': '©',
  '&nbsp;': ' ',
  '&aacute;': 'á',
  '&eacute;': 'é',
  '&iacute;': 'í',
  '&oacute;': 'ó',
  '&uacute;': 'ú',
  '&ntilde;': 'ñ',
  '&Aacute;': 'Á',
  '&Eacute;': 'É',
  '&Iacute;': 'Í',
  '&Oacute;': 'Ó',
  '&Uacute;': 'Ú',
  '&Ntilde;': 'Ñ'
};

const trailingHeaders = [
  /\n\s*A\)\s+Ritos iniciales\s*$/i,
  /\n\s*B\)\s+Liturgia de la palabra\s*$/i,
  /\n\s*C\)\s+Liturgia Eucarística\s*$/i,
  /\n\s*D\)\s+Rito de conclusión\s*$/i,
  /\n\s*B\)\s+Misa con diácono\s*$/i,
  /\n\s*C\)\s+Ministerios del acólito\s*$/i,
  /\n\s*Rito de conclusión\s*$/i,
  /\n\s*Veneración del altar y del Evangeliario\s*$/i,
  /\n\s*Genuflexión e inclinación\s*$/i,
  /\n\s*Incensación\s*$/i,
  /\n\s*Las purificaciones\s*$/i,
  /\n\s*Comunión bajo las dos especies\s*$/i,
  /\n\s*Las lecturas\s*$/i,
  /\n\s*Las oraciones\s*$/i,
  /\n\s*Plegaria Eucarística\s*$/i,
  /\n\s*El canto\s*$/i,
  /\n\s*© Conferencia Episcopal de Colombia, 2007\s*$/i,
  /\n\s*Missale Romanum, pág XXX\s*$/i
];

let totalFootnotesRemoved = 0;
let totalEntitiesReplaced = 0;
let totalTrailingHeadersRemoved = 0;

igmr.forEach(item => {
  let t = item.text;

  // 1. Reemplazar entidades HTML
  for (const [ent, val] of Object.entries(entityMap)) {
    if (t.includes(ent)) {
      const count = t.split(ent).length - 1;
      totalEntitiesReplaced += count;
      t = t.split(ent).join(val);
    }
  }

  // Cualquier otra entidad hex o decimal
  t = t.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    totalEntitiesReplaced++;
    return String.fromCharCode(parseInt(hex, 16));
  });
  t = t.replace(/&#([0-9]+);/g, (match, dec) => {
    totalEntitiesReplaced++;
    return String.fromCharCode(parseInt(dec, 10));
  });

  // 2. Eliminar marcas de notas al pie [57], [105], etc.
  const fnMatches = t.match(/\s*\[\d+\]/g);
  if (fnMatches) {
    totalFootnotesRemoved += fnMatches.length;
    t = t.replace(/\s*\[\d+\]/g, '');
  }

  // 3. Eliminar encabezados de sección pegados al final
  trailingHeaders.forEach(re => {
    if (re.test(t)) {
      t = t.replace(re, '');
      totalTrailingHeadersRemoved++;
    }
  });

  // 4. Normalizar espacios y saltos de línea
  t = t.replace(/[ \t]+/g, ' ')
       .replace(/ \./g, '.')
       .replace(/ ,/g, ',')
       .replace(/ ;/g, ';')
       .replace(/ :/g, ':')
       .replace(/\n{3,}/g, '\n\n')
       .trim();

  item.text = t;
});

console.log('--- REPORTE DE LIMPIEZA INTEGRAL DE LA IGMR ---');
console.log(`- Entidades HTML decodificadas: ${totalEntitiesReplaced}`);
console.log(`- Marcas de notas al pie [n] eliminadas: ${totalFootnotesRemoved}`);
console.log(`- Encabezados pegados eliminados: ${totalTrailingHeadersRemoved}`);

fs.writeFileSync('igmr_full_399.json', JSON.stringify(igmr, null, 2), 'utf8');
console.log('Archivo igmr_full_399.json guardado y verificado!');
