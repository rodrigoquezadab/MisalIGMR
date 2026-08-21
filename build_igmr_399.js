const fs = require('fs');

const elements = JSON.parse(fs.readFileSync('igmr_elements.json', 'utf8'));

const items = [];
let currentChapter = "";
let currentSection = "";
let currentSubsection = "";

for (let i = 0; i < elements.length; i++) {
  const el = elements[i];

  if (/^(PROEMIO|CAP[ÍI]TULO|CAP\.)/i.test(el)) {
    currentChapter = el.replace(/\s+/g, ' ').trim();
    currentSection = "";
    currentSubsection = "";
    continue;
  }
  if (/^[IVXLCDM]+\.\s+[A-ZÁÉÍÓÚ]/i.test(el) && el.length < 120) {
    currentSection = el.replace(/\s+/g, ' ').trim();
    currentSubsection = "";
    continue;
  }
  if (/^[A-ZÁÉÍÓÚ\s,()–—]{4,90}$/.test(el) && !/^\d+\.?/.test(el) && el.length < 90) {
    currentSubsection = el.replace(/\s+/g, ' ').trim();
    continue;
  }

  // Check if it's a numbered paragraph (e.g., "46. ..." or "230 ...")
  const numMatch = el.match(/^(\d{1,3})\.?\s*([\s\S]*)$/);
  if (numMatch && parseInt(numMatch[1], 10) >= 1 && parseInt(numMatch[1], 10) <= 399) {
    items.push({
      num: parseInt(numMatch[1], 10),
      chapter: currentChapter,
      section: currentSection,
      subsection: currentSubsection,
      text: numMatch[2]
    });
  } else {
    // If continuation paragraph without number, attach to last item
    if (items.length > 0) {
      items[items.length - 1].text += "\n\n" + el;
    }
  }
}

console.log('Total numbered items parsed:', items.length);

const numSet = new Set(items.map(it => it.num));
const missing = [];
for (let n = 1; n <= 399; n++) {
  if (!numSet.has(n)) missing.push(n);
}
console.log('Missing paragraph numbers (1-399):', missing);

fs.writeFileSync('igmr_full_399.json', JSON.stringify(items, null, 2), 'utf8');
