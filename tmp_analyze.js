const fs = require('fs');
const c = fs.readFileSync('历史版本源代码/source22_clean.js', 'utf8');

// Find all WebSocket URLs
const wsMatches = c.match(/wss?:\/\/[^"'\s]+/g);
console.log('WebSocket URLs found:');
if (wsMatches) {
  const unique = [...new Set(wsMatches)];
  unique.forEach(u => console.log('  ' + u));
}

// Find all territorial.io references
const tMatches = c.match(/territorial\.io[^"'\s]*/g);
console.log('\nAll territorial.io references:');
if (tMatches) {
  const unique = [...new Set(tMatches)];
  unique.forEach(u => console.log('  ' + u));
}

// Find aiCommand746 usage
const aiMatches = c.match(/aiCommand746[^;]*/g);
console.log('\naiCommand746 usages:');
if (aiMatches) {
  aiMatches.forEach(u => console.log('  ' + u));
}

// Find bw function calls
const bwMatches = c.match(/bw\([^)]*\)/g);
console.log('\nbw() calls:');
if (bwMatches) {
  bwMatches.slice(0, 10).forEach(u => console.log('  ' + u));
}
