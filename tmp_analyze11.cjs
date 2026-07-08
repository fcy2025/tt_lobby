const fs = require('fs');
const c = fs.readFileSync('历史版本源代码/source22_clean.js', 'utf8');

// Find aU7 function
const aU7Regex = /this\.aU7\s*=\s*function\s*\([^)]*\)\s*\{/g;
const aU7Match = aU7Regex.exec(c);
if (aU7Match) {
  const start = aU7Match.index;
  let depth = 1;
  let i = start + aU7Match[0].length;
  while (depth > 0 && i < c.length) {
    if (c[i] === '{') depth++;
    else if (c[i] === '}') depth--;
    i++;
  }
  console.log('aU7 function:');
  console.log(c.slice(start, i));
}

// Check aHN call with a2F=1 (lobby 1)
// Find where lobby is selected
const lobbySelect = [...c.matchAll(/a2S\s*[=!]==?\s*\d/g)];
console.log('\n\na2S comparisons (first 10):');
lobbySelect.slice(0, 10).forEach(m => console.log('  ' + m[0]));

// Find the function that sets a2S
const a2SAssign = [...c.matchAll(/[^\w.]a2S\s*=[^=]/g)];
console.log('\na2S assignments:');
a2SAssign.forEach((m, i) => {
  const start = Math.max(0, m.index - 40);
  console.log(`  ${i+1}. ...${c.slice(start, m.index + 20)}`);
});
