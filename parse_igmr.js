const fs = require('fs');

function decodeEntities(encodedString) {
  var translate_re = /&(nbsp|amp|quot|lt|gt|Aacute|aacute|Eacute|eacute|Iacute|iacute|Oacute|oacute|Uacute|uacute|Ntilde|ntilde|laquo|raquo|ldquo|rdquo|lsquo|rsquo|hellip|ndash|mdash);/g;
  var translate = {
    "nbsp": " ", "amp": "&", "quot": "\"", "lt": "<", "gt": ">",
    "Aacute": "Á", "aacute": "á", "Eacute": "É", "eacute": "é",
    "Iacute": "Í", "iacute": "í", "Oacute": "Ó", "oacute": "ó",
    "Uacute": "Ú", "uacute": "ú", "Ntilde": "Ñ", "ntilde": "ñ",
    "laquo": "«", "raquo": "»", "ldquo": "“", "rdquo": "”",
    "lsquo": "‘", "rsquo": "’", "hellip": "...", "ndash": "–", "mdash": "—"
  };
  return encodedString.replace(translate_re, function(match, entity) {
    return translate[entity] || match;
  }).replace(/&#(\d+);/gi, function(match, numStr) {
    var num = parseInt(numStr, 10);
    return String.fromCharCode(num);
  });
}

let raw = fs.readFileSync('igmr_vatican.html', 'utf8');
let decoded = decodeEntities(raw);

// Extract full text with headers and paragraphs intact
const pRegex = /<(?:p|h\d)[^>]*>([\s\S]*?)<\/(?:p|h\d)>/gi;
let pMatch;
const elements = [];
while ((pMatch = pRegex.exec(decoded)) !== null) {
  let content = pMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (content.length > 0) {
    elements.push(content);
  }
}

fs.writeFileSync('igmr_elements.json', JSON.stringify(elements, null, 2), 'utf8');
console.log('Total extracted elements:', elements.length);
