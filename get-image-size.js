const fs = require('fs');
const buf = fs.readFileSync('public/bg_template.png');
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
console.log(`${width}x${height}`);
