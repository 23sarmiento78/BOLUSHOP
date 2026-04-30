
const fs = require('fs');
const html = fs.readFileSync('debug_ml.html', 'utf8');
const regex = /"current_price":\s*\{\s*"value":\s*(\d+)/i;
const match = html.match(regex);
console.log('Match:', match ? match[1] : 'NOT FOUND');

const regex2 = /"id":"(MLA\d+)"/i;
const match2 = html.match(regex2);
console.log('ID Match:', match2 ? match2[1] : 'NOT FOUND');
