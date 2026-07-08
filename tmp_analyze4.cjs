const fs = require('fs');
const c = fs.readFileSync('历史版本源代码/source22_clean.js', 'utf8');

// Find all new WebSocket() with context
const wsRegex = /new\s+WebSocket\s*\(/g;
let match;
let count = 0;
console.log('All WebSocket creations with context:');
while ((match = wsRegex.exec(c)) !== null) {
  count++;
  const start = Math.max(0, match.index - 100);
  const end = Math.min(c.length, match.index + 150);
  console.log(`\n--- Creation ${count} ---`);
  console.log(c.slice(start, end));
}

// Find b1.z definition
const b1zRegex = /b1\.\w+\s*=\s*new\s+\w+/g;
const b1zMatches = [...c.matchAll(b1zRegex)];
console.log('\n\nb1 object property assignments with new:');
b1zMatches.forEach(m => console.log('  ' + m[0]));

// Find what b1 is
const b1Def = c.match(/var\s+b1\s*[=;]/);
console.log('\nb1 definition:', b1Def ? b1Def[0] : 'not found');

// Search for b1= pattern
const b1Assign = [...c.matchAll(/[^\w]b1\s*=/g)];
console.log('b1 assignments:', b1Assign.length);
