const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const csvPath = path.join(__dirname, 'app/producto/Products (4).csv');
const fileContent = fs.readFileSync(csvPath, 'utf8');

Papa.parse(fileContent, {
    header: false, // Force no header to see raw indices
    delimiter: ";",
    complete: (results) => {
        console.log("Total Rows:", results.data.length);
        console.log("\n--- Raw Column Analysis (Indices) ---");
        results.data.slice(0, 5).forEach((row, i) => {
            console.log(`\nRow ${i + 1}:`);
            console.log(`  [0] ID: ${row[0]}`);
            console.log(`  [1] Name: ${row[1]}`);
            console.log(`  [2] Col C: '${row[2]}'`);
            console.log(`  [21] Col V: '${row[21]}'`);
        });
    }
});
