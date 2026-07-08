const fs = require('fs');
const c = fs.readFileSync('历史版本源代码/source22_clean.js', 'utf8');

// Find dynamic script loading
const scriptMatches = c.match(/createElement\s*\(\s*['"]script['"]\s*\)/g);
console.log('Dynamic script loading:');
if (scriptMatches) console.log('  Found:', scriptMatches.length);

// Find eval usage
const evalMatches = c.match(/eval\s*\(/g);
console.log('\neval() usage:');
if (evalMatches) console.log('  Found:', evalMatches.length);

// Find Function constructor
const funcMatches = c.match(/new\s+Function\s*\(/g);
console.log('\nnew Function() usage:');
if (funcMatches) console.log('  Found:', funcMatches.length);

// Find fetch
const fetchMatches = c.match(/fetch\s*\(/g);
console.log('\nfetch() usage:');
if (fetchMatches) console.log('  Found:', fetchMatches.length);

// Find XMLHttpRequest
const xhrMatches = c.match(/XMLHttpRequest/g);
console.log('\nXMLHttpRequest usage:');
if (xhrMatches) console.log('  Found:', xhrMatches.length);

// Find WebRTC
const rtcMatches = c.match(/RTCPeerConnection|RTCDataChannel/g);
console.log('\nWebRTC usage:');
if (rtcMatches) console.log('  Found:', rtcMatches.length);

// Find all network-related patterns
const netMatches = c.match(/\.send\(|\.open\(|\.connect\(/g);
console.log('\nNetwork method calls:');
if (netMatches) {
  const counts = {};
  netMatches.forEach(m => counts[m] = (counts[m] || 0) + 1);
  Object.entries(counts).forEach(([k,v]) => console.log('  ' + k + ': ' + v));
}
