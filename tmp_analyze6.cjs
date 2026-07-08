const fs = require('fs');
const c = fs.readFileSync('历史版本源代码/source22_clean.js', 'utf8');

// Find all aUa occurrences
const aUaMatches = [...c.matchAll(/aUa/g)];
console.log('aUa occurrences:', aUaMatches.length);

// Show context around each aUa occurrence
aUaMatches.forEach((m, i) => {
  const start = Math.max(0, m.index - 80);
  const end = Math.min(c.length, m.index + 80);
  console.log(`\n--- aUa ${i + 1} ---`);
  console.log(c.slice(start, end));
});

// Find S[53] value
const s53Regex = /S\[53\]/g;
const s53Matches = [...c.matchAll(s53Regex)];
console.log('\n\nS[53] occurrences:', s53Matches.length);

// S is defined at the beginning, let's find it
const sDef = c.match(/var\s+S\s*=\s*\[[^\]]{0,5000}\]/);
if (sDef) {
  // Extract first few elements
  const sStr = sDef[0];
  console.log('\nS array start:', sStr.slice(0, 200));
  
  // Parse to get S[53]
  try {
    // Find the 54th element (index 53)
    const elements = [];
    let depth = 0;
    let current = '';
    let inString = false;
    let stringChar = '';
    
    for (let i = sStr.indexOf('[') + 1; i < sStr.length; i++) {
      const ch = sStr[i];
      if (inString) {
        current += ch;
        if (ch === stringChar && sStr[i-1] !== '\\') {
          inString = false;
        }
      } else if (ch === '"' || ch === "'") {
        inString = true;
        stringChar = ch;
        current += ch;
      } else if (ch === '[' || ch === '{') {
        depth++;
        current += ch;
      } else if (ch === ']' || ch === '}') {
        depth--;
        if (depth < 0) break;
        current += ch;
      } else if (ch === ',' && depth === 0) {
        elements.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    if (current.trim()) elements.push(current.trim());
    
    console.log('\nS[53] =', elements[53] || 'not found');
    console.log('S[0] =', elements[0]);
    console.log('S[1] =', elements[1]);
  } catch(e) {
    console.log('Parse error:', e.message);
  }
}
