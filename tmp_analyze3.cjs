const fs = require('fs');
const c = fs.readFileSync('历史版本源代码/source22_clean.js', 'utf8');

// Find ALL WebSocket creations - check for variable assignments
const wsCreations = c.match(/new\s+WebSocket\s*\(/g);
console.log('new WebSocket() calls:', wsCreations ? wsCreations.length : 0);

// Find all variable assignments that might hold WebSocket
const varMatches = c.match(/var\s+\w+\s*=\s*new\s+WebSocket/g);
console.log('var x = new WebSocket:', varMatches ? varMatches.length : 0);

// Find .send() calls with context (previous 30 chars)
const sendMatches = [...c.matchAll(/[\w.]+\.send\(/g)];
console.log('\nAll .send() calls (first 20):');
sendMatches.slice(0, 20).forEach(m => {
  const start = Math.max(0, m.index - 30);
  const context = c.slice(start, m.index + 10);
  console.log('  ...' + context);
});

// Find where 'b' is used (the WebSocket variable in function a)
const bMatches = [...c.matchAll(/\bb\b/g)];
console.log('\nTotal "b" references:', bMatches.length);

// Find b.send specifically
const bSendMatches = [...c.matchAll(/\bb\.send\(/g)];
console.log('b.send() calls:', bSendMatches.length);
