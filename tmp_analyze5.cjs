const fs = require('fs');
const c = fs.readFileSync('历史版本源代码/source22_clean.js', 'utf8');

// Find aUa definition
const aUaRegex = /aUa\s*=\s*\[[^\]]*\]/;
const aUaMatch = c.match(aUaRegex);
console.log('aUa array:', aUaMatch ? aUaMatch[0] : 'not found');

// Find aW3 definition
const aW3Regex = /aW3\s*=\s*\[[^\]]*\]/;
const aW3Match = c.match(aW3Regex);
console.log('\naW3 array:', aW3Match ? aW3Match[0] : 'not found');

// Find aW1 definition/assignment
const aW1Regex = /aW1\s*=\s*\d+/;
const aW1Match = c.match(aW1Regex);
console.log('\naW1 value:', aW1Match ? aW1Match[0] : 'not found');

// Find where lobby is set (look for 0,1,2 assignments near connection)
// Search for the function containing Creation 2
const creation2Idx = c.indexOf('b=new WebSocket(lp)');
console.log('\nCreation 2 at index:', creation2Idx);
if (creation2Idx > 0) {
  const funcStart = Math.max(0, creation2Idx - 500);
  console.log('\nContext around Creation 2:');
  console.log(c.slice(funcStart, creation2Idx + 200));
}
