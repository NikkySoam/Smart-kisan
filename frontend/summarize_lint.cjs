const fs = require('fs'); 
const data = JSON.parse(fs.readFileSync('lint-results.json', 'utf8')); 
const summary = data.filter(f => f.errorCount > 0 || f.warningCount > 0).map(f => ({ 
  file: f.filePath.replace(process.cwd(), ''), 
  errors: f.messages.map(m => `${m.line}:${m.column} ${m.ruleId} ${m.message}`) 
})); 
console.log(JSON.stringify(summary, null, 2));
