const fs = require('fs');

const elements = JSON.parse(fs.readFileSync('igmr_elements.json', 'utf8'));

// Build structured IGMR documentation tree
// An element is either a Chapter, a Section heading, a Subsection heading, or a numbered paragraph.

const items = [];
let currentChapter = "";
let currentSection = "";
let currentSubsection = "";

for (let i = 0; i < elements.length; i++) {
  const el = elements[i];

  if (/^(PROEMIO|CAP[ÍI]TULO|CAP\.)/i.test(el)) {
    currentChapter = el;
    currentSection = "";
    currentSubsection = "";
    continue;
  }
  if (/^[IVXLCDM]+\.\s+[A-ZÁÉÍÓÚ]/i.test(el) && el.length < 120) {
    currentSection = el;
    currentSubsection = "";
    continue;
  }
  if (/^[A-ZÁÉÍÓÚ\s,()–—]{4,90}$/.test(el) && !/^\d+\./.test(el) && el.length < 90) {
    currentSubsection = el;
    continue;
  }

  // Check if it's a numbered paragraph
  const numMatch = el.match(/^(\d{1,3})\.\s*([\s\S]*)$/);
  if (numMatch) {
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
console.log('First item:', items[0].num, items[0].chapter, items[0].text.substring(0, 100));
console.log('Last item:', items[items.length - 1].num, items[items.length - 1].chapter, items[items.length - 1].text.substring(0, 100));

// Check missing numbers
const numSet = new Set(items.map(it => it.num));
const missing = [];
for (let n = 1; n <= 399; n++) {
  if (!numSet.has(n)) missing.push(n);
}
console.log('Missing paragraph numbers (1-399):', missing);

fs.writeFileSync('igmr_structured.json', JSON.stringify(items, null, 2), 'utf8');
