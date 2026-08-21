const fs = require('fs');

const items = JSON.parse(fs.readFileSync('igmr_full_399.json', 'utf8'));

// Map of paragraph numbers to items
const map = {};
items.forEach(it => {
  if (!map[it.num]) {
    map[it.num] = it;
  } else {
    map[it.num].text += "\n\n" + it.text;
  }
});

console.log('Unique numbered items: 1 to', Object.keys(map).length);

// Helper to format an IGMR block containing a range of paragraphs
function renderIGMR(title, numList) {
  let html = `      <div class="igmr-container">\n        <details>\n          <summary>IGMR: ${title}</summary>\n          <div class="igmr-content">\n`;
  
  let lastSub = "";
  numList.forEach(n => {
    const it = map[n];
    if (!it) return;
    if (it.subsection && it.subsection !== lastSub) {
      html += `            <h4>${it.subsection}</h4>\n`;
      lastSub = it.subsection;
    }
    const paragraphs = it.text.split('\n\n').map(p => p.trim()).filter(Boolean);
    paragraphs.forEach((p, idx) => {
      if (idx === 0) {
        html += `            <p><span class="igmr-num">IGMR ${n}:</span> ${p}</p>\n`;
      } else {
        html += `            <p>${p}</p>\n`;
      }
    });
  });

  html += `          </div>\n        </details>\n      </div>\n`;
  return html;
}

// Generate the whole misal.html integrating all 399 paragraphs
// Let's create the generator script
fs.writeFileSync('generate_full_misal.js', `
const fs = require('fs');
const items = JSON.parse(fs.readFileSync('igmr_full_399.json', 'utf8'));
const map = {};
items.forEach(it => {
  if (!map[it.num]) {
    map[it.num] = it;
  } else {
    map[it.num].text += "\\n\\n" + it.text;
  }
});

function range(start, end) {
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

function renderIGMR(title, numList) {
  let html = '      <div class="igmr-container">\\n        <details>\\n          <summary>IGMR: ' + title + '</summary>\\n          <div class="igmr-content">\\n';
  
  let lastSub = "";
  numList.forEach(n => {
    const it = map[n];
    if (!it) return;
    if (it.subsection && it.subsection !== lastSub) {
      html += '            <h4>' + it.subsection + '</h4>\\n';
      lastSub = it.subsection;
    }
    const paragraphs = it.text.split('\\n\\n').map(p => p.trim()).filter(Boolean);
    paragraphs.forEach((p, idx) => {
      if (idx === 0) {
        html += '            <p><span class="igmr-num">IGMR ' + n + ':</span> ' + p + '</p>\\n';
      } else {
        html += '            <p>' + p + '</p>\\n';
      }
    });
  });

  html += '          </div>\\n        </details>\\n      </div>\\n';
  return html;
}

// Let's check all ranges mapping from 1 to 399
// Proemio & Cap I: 1 - 26 (Introducción y Dignidad)
// Cap II: 27 - 90 (Estructura general, elementos y cada parte)
// Cap III: 91 - 111 (Oficios y ministerios)
// Cap IV: 112 - 287 (Formas de celebrar la misa: con pueblo, concelebrada, etc.)
// Cap V: 288 - 318 (Disposición y ornato de las iglesias)
// Cap VI: 319 - 351 (Cosas que se necesitan: pan, vino, vasos, vestiduras)
// Cap VII: 352 - 367 (Elección de la misa y sus partes)
// Cap VIII: 368 - 385 (Misas y oraciones por diversas necesidades y difuntos)
// Cap IX: 386 - 399 (Adaptaciones de los Obispos y Conferencias Episcopales)

console.log('Mapping verification ready.');
`);
