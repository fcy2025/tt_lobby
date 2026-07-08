const fs = require('fs');
const c = fs.readFileSync('历史版本源代码/source22_clean.js', 'utf8');

// Check if game uses self.WebSocket or other references
const selfWs = c.match(/self\.WebSocket/g);
const windowWs = c.match(/window\.WebSocket/g);
const topWs = c.match(/top\.WebSocket/g);
const parentWs = c.match(/parent\.WebSocket/g);

console.log('self.WebSocket:', selfWs ? selfWs.length : 0);
console.log('window.WebSocket:', windowWs ? windowWs.length : 0);
console.log('top.WebSocket:', topWs ? topWs.length : 0);
console.log('parent.WebSocket:', parentWs ? parentWs.length : 0);

// Check if WebSocket is saved to a local variable
const wsSave = c.match(/var\s+\w+\s*=\s*WebSocket\b/g);
console.log('\nLocal WebSocket saves:', wsSave ? wsSave.length : 0);
if (wsSave) wsSave.forEach(s => console.log('  ' + s));

// Check for b1 accessibility - is it exposed?
const b1Global = c.match(/window\.b1|self\.b1|top\.b1/g);
console.log('\nb1 exposed globally:', b1Global ? b1Global.length : 0);

// Find where b1 is assigned
const b1AssignPattern = /[^\w.]b1\s*=\s*[^=]/g;
const b1Assigns = [...c.matchAll(b1AssignPattern)];
console.log('\nb1 assignments:');
b1Assigns.slice(0, 5).forEach(m => {
  const start = Math.max(0, m.index - 30);
  console.log('  ...' + c.slice(start, m.index + 30));
});
