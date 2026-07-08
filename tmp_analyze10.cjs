const fs = require('fs');
const c = fs.readFileSync('历史版本源代码/source22_clean.js', 'utf8');

// Find aHN function definition
const aHNRegex = /this\.aHN\s*=\s*function\s*\([^)]*\)\s*\{/g;
const aHNMatch = aHNRegex.exec(c);
if (aHNMatch) {
  const start = aHNMatch.index;
  // Find matching closing brace
  let depth = 1;
  let i = start + aHNMatch[0].length;
  while (depth > 0 && i < c.length) {
    if (c[i] === '{') depth++;
    else if (c[i] === '}') depth--;
    i++;
  }
  console.log('aHN function:');
  console.log(c.slice(start, i));
}

// Find where aHN is called
const aHNCalls = [...c.matchAll(/\.aHN\s*\(/g)];
console.log('\n\naHN calls:', aHNCalls.length);
aHNCalls.forEach((m, i) => {
  const start = Math.max(0, m.index - 40);
  const end = Math.min(c.length, m.index + 40);
  console.log(`\n${i+1}. ...${c.slice(start, end)}`);
});

// Also check what aUm evaluates to in aHN
console.log('\n\nSearching for aUm in aHN context...');
