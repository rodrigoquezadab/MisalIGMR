const fs = require('fs');

const igmr = JSON.parse(fs.readFileSync('igmr_full_399.json', 'utf8'));

// Mapa de entidades HTML a caracteres tipográficos limpios
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

// Limpieza de títulos de subsección que se habían pegado al final de los numerales
const trailingHeadersToRemove = {
  45: /\n\s*A\)\s+Ritos iniciales\s*$/i,
  54: /\n\s*B\)\s+Liturgia de la palabra\s*$/i,
  71: /\n\s*C\)\s+Liturgia Eucarística\s*$/i,
  89: /\n\s*D\)\s+Rito de conclusión\s*$/i,
  170: /\n\s*B\)\s+Misa con diácono\s*$/i,
  186: /\n\s*C\)\s+Ministerios del acólito\s*$/i
};

let modifiedCount = 0;
let entityReplacements = 0;

igmr.forEach(item => {
  let original = item.text;
  let t = item.text;

  // 1. Reemplazo de entidades
  for (const [ent, val] of Object.entries(entityMap)) {
    if (t.includes(ent)) {
      const count = t.split(ent).length - 1;
      entityReplacements += count;
      t = t.split(ent).join(val);
    }
  }

  // Decodificación de cualquier otra entidad hexadecimal &#x...; o decimal &#...;
  t = t.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    entityReplacements++;
    return String.fromCharCode(parseInt(hex, 16));
  });
  t = t.replace(/&#([0-9]+);/g, (match, dec) => {
    entityReplacements++;
    return String.fromCharCode(parseInt(dec, 10));
  });

  // 2. Limpieza de encabezados pegados
  if (trailingHeadersToRemove[item.num]) {
    t = t.replace(trailingHeadersToRemove[item.num], '').trim();
  }

  // 3. Limpieza de espaciados dobles o saltos espurios
  t = t.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

  if (t !== original) {
    item.text = t;
    modifiedCount++;
  }
});

console.log(`Limpieza completada:`);
console.log(`- Numerales modificados: ${modifiedCount}`);
console.log(`- Reemplazos de entidades HTML realizados: ${entityReplacements}`);

// Verificación de que no quede ninguna entidad HTML residual
let unmappedEntities = [];
igmr.forEach(item => {
  const matches = item.text.match(/&#?[a-zA-Z0-9]+;/g);
  if (matches) {
    unmappedEntities.push({ num: item.num, matches });
  }
});

console.log(`- Entidades residuales no mapeadas: ${unmappedEntities.length}`);
if (unmappedEntities.length > 0) {
  console.log(unmappedEntities);
}

fs.writeFileSync('igmr_full_399.json', JSON.stringify(igmr, null, 2), 'utf8');
console.log('Archivo igmr_full_399.json guardado con éxito!');
