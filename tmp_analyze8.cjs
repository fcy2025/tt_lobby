const fs = require('fs');
const c = fs.readFileSync('历史版本源代码/source22_clean.js', 'utf8');

// Find all aW1 assignments
const aW1Regex = /[^\w.]aW1\s*=[^=]/g;
const aW1Matches = [...c.matchAll(aW1Regex)];
console.log('aW1 assignments:', aW1Matches.length);
aW1Matches.forEach((m, i) => {
  const start = Math.max(0, m.index - 50);
  const end = Math.min(c.length, m.index + 50);
  console.log(`\n--- aW1 assign ${i+1} ---`);
  console.log(c.slice(start, end));
});

// Find aW1 in comparisons (like aW1===0 or aW1==1)
const aW1Comp = [...c.matchAll(/aW1\s*[!=]==?\s*\d/g)];
console.log('\n\naW1 comparisons (first 10):');
aW1Comp.slice(0, 10).forEach(m => console.log('  ' + m[0]));

// Find where aW5 is called
const aW5Call = [...c.matchAll(/aW5\s*\(/g)];
console.log('\naW5() calls:', aW5Call.length);
aW5Call.forEach((m, i) => {
  const start = Math.max(0, m.index - 30);
  const end = Math.min(c.length, m.index + 30);
  console.log(`  ${i+1}. ...${c.slice(start, end)}`);
});
