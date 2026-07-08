const fs = require('fs');
const c = fs.readFileSync('历史版本源代码/source22_clean.js', 'utf8');

// Find all .di( calls (this.di or b1.z.di etc)
const diCalls = [...c.matchAll(/\.di\s*\(/g)];
console.log('.di() calls:', diCalls.length);
diCalls.forEach((m, i) => {
  const start = Math.max(0, m.index - 60);
  const end = Math.min(c.length, m.index + 40);
  console.log(`\n${i+1}. ...${c.slice(start, end)}`);
});

// Find aUm assignments or usage
const aUmMatches = [...c.matchAll(/aUm[^a-zA-Z]/g)];
console.log('\n\naUm usages (first 20):');
aUmMatches.slice(0, 20).forEach(m => {
  const start = Math.max(0, m.index - 30);
  console.log('  ...' + c.slice(start, m.index + 10));
});

// Find m.dz value
const mdzMatch = c.match(/m\.dz\s*=\s*\d+/);
console.log('\nm.dz:', mdzMatch ? mdzMatch[0] : 'not found');
