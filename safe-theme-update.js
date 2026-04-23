const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function updateTheme() {
  const dirs = ['app', 'components'];
  
  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) return;
    
    walkDir(fullPath, (filePath) => {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove dark: classes carefully
        content = content.replace(/dark:[a-zA-Z0-9-\/\[\]]+/g, '');
        // Clean up multi-spaces safely
        content = content.replace(/\s{2,}/g, ' ');
        content = content.replace(/ \s*"/g, '"');
        content = content.replace(/"\s* /g, '"');
        content = content.replace(/'\s* /g, "'");
        content = content.replace(/ \s*'/g, "'");

        // Pastel replacements
        // Blue to soft violet
        content = content.replace(/bg-blue-600/g, 'bg-violet-400');
        content = content.replace(/hover:bg-blue-500/g, 'hover:bg-violet-500');
        content = content.replace(/text-blue-600/g, 'text-violet-500');
        content = content.replace(/text-blue-700/g, 'text-violet-600');
        content = content.replace(/bg-blue-50/g, 'bg-violet-50');
        content = content.replace(/bg-blue-900\/20/g, ''); // Was dark
        content = content.replace(/text-blue-400/g, 'text-violet-500');
        content = content.replace(/border-blue-500/g, 'border-violet-400');
        content = content.replace(/ring-blue-500/g, 'ring-violet-400');
        
        // Emerald to Teal (Pastel Green)
        content = content.replace(/bg-emerald-50/g, 'bg-teal-50');
        content = content.replace(/text-emerald-600/g, 'text-teal-500');
        content = content.replace(/text-emerald-700/g, 'text-teal-600');
        content = content.replace(/ring-emerald-600/g, 'ring-teal-500');

        // Red to Rose (Pastel Red/Pink)
        content = content.replace(/bg-red-50/g, 'bg-rose-50');
        content = content.replace(/text-red-600/g, 'text-rose-500');
        content = content.replace(/text-red-700/g, 'text-rose-600');
        content = content.replace(/ring-red-600/g, 'ring-rose-500');

        // Background to warm off-white and softer borders
        content = content.replace(/bg-zinc-50/g, 'bg-[#fdfbf7]');
        content = content.replace(/border-zinc-200/g, 'border-slate-200');
        content = content.replace(/border-zinc-300/g, 'border-slate-300');
        
        // Text softening (zinc -> slate)
        content = content.replace(/text-zinc-900/g, 'text-slate-800');
        content = content.replace(/text-zinc-700/g, 'text-slate-600');
        content = content.replace(/text-zinc-600/g, 'text-slate-500');
        content = content.replace(/text-zinc-500/g, 'text-slate-400');
        content = content.replace(/text-zinc-400/g, 'text-slate-400');
        
        // Inactive background softening
        content = content.replace(/bg-zinc-100/g, 'bg-slate-100');
        content = content.replace(/hover:bg-zinc-100/g, 'hover:bg-slate-100');
        content = content.replace(/hover:bg-zinc-50/g, 'hover:bg-slate-50');

        fs.writeFileSync(filePath, content);
      }
    });
  });

  // Update globals.css
  const cssPath = path.join(__dirname, 'app', 'globals.css');
  if (fs.existsSync(cssPath)) {
    let cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Completely remove dark theme blocks
    cssContent = cssContent.replace(/@media \(prefers-color-scheme: dark\) \{[\s\S]*?\}/g, '');
    
    // Use warmer pastel backgrounds
    cssContent = cssContent.replace(/--background: #ffffff;/, '--background: #fdfbf7;');
    cssContent = cssContent.replace(/--foreground: #171717;/, '--foreground: #334155;');
    
    fs.writeFileSync(cssPath, cssContent);
  }
}

updateTheme();
console.log('Theme safely updated!');
