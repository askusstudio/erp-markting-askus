const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function fix() {
  const dirs = ['app', 'components'];
  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) return;
    
    walkDir(fullPath, (filePath) => {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace space-colon-something with nothing
        content = content.replace(/\s+:[a-zA-Z0-9-\/\[\]\.]+/g, '');
        fs.writeFileSync(filePath, content);
      }
    });
  });
}
fix();
console.log('Fixed invalid classes');
