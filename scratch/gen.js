const fs = require('fs');
const path = require('path');

const scan = (dir, root) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(scan(full, root));
    } else {
      results.push('/' + path.relative(root, full).replace(/\\/g, '/'));
    }
  });
  return results;
};

const files = scan('public/avatars', 'public');
let code = 'export const ImageMap: Record<string, any> = {\n';
files.forEach(f => {
  code += `  '${f}': require('../public${f}'),\n`;
});
code += '};\n';
fs.writeFileSync('constants/ImageMap.ts', code);
console.log('ImageMap.ts generated successfully');
