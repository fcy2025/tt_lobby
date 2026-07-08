const fs = require('fs');
const c = fs.readFileSync('历史版本源代码/source22_clean.js', 'utf8');

// Find m definition
const mDef = c.match(/var\s+m\s*[=;]/);
console.log('m definition:', mDef ? mDef[0] : 'not found');

// Find m.dz
const mdzMatches = [...c.matchAll(/m\.dz/g)];
console.log('\nm.dz occurrences:', mdzMatches.length);
mdzMatches.slice(0, 5).forEach((m, i) => {
  const start = Math.max(0, m.index - 40);
  console.log(`  ${i+1}. ...${c.slice(start, m.index + 10)}`);
});

// Find aUk function
const aUkRegex = /function\s+aUk\s*\([^)]*\)\s*\{/g;
const aUkMatch = aUkRegex.exec(c);
if (aUkMatch) {
  const start = aUkMatch.index;
  let depth = 1;
  let i = start + aUkMatch[0].length;
  while (depth > 0 && i < c.length) {
    if (c[i] === '{') depth++;
    else if (c[i] === '}') depth--;
    i++;
  }
  console.log('\naUk function:');
  console.log(c.slice(start, i));
}

// Find aa.aHJ
const aaHJ = [...c.matchAll(/aa\.aHJ/g)];
console.log('\naa.aHJ assignments/usage (first 5):');
aaHJ.slice(0, 5).forEach((m, i) => {
  const start = Math.max(0, m.index - 30);
  console.log(`  ${i+1}. ...${c.slice(start, m.index + 15)}`);
});
