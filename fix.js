const fs = require('fs');
const filepath = 'c:/Users/oopse/Desktop/projects/simple-crud-app/client/src/pages/InternshipOffers.jsx';
const content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\r\n'); // usually windows has \r\n, split by \n and handle \r

const newLines = [];
let actualLines = content.split(/\r?\n/);
let inUseEffect = true;

for(let i=0; i<actualLines.length; i++) {
    if (i < 20) {
        newLines.push(actualLines[i]);
    } else if (i === 20) {
        newLines.push("        return () => document.removeEventListener('mousedown', handleClickOutside);");
        newLines.push("    }, []);");
        newLines.push("");
        // from line 20 onwards we un-indent by 4 chars until we hit the last `        );`
        let unindented = actualLines[i].startsWith("    ") ? actualLines[i].substring(4) : actualLines[i];
        newLines.push(unindented);
    } else {
        if (actualLines[i].includes("        );") && i > actualLines.length - 10) {
             // this is the pre-final line.
             newLines.push(actualLines[i].substring(4));
             break;
        } else {
            let unindented = actualLines[i].startsWith("    ") ? actualLines[i].substring(4) : actualLines[i];
            newLines.push(unindented);
        }
    }
}
newLines.push("};");
newLines.push("");
newLines.push("export default InternshipOffers;");

fs.writeFileSync(filepath, newLines.join('\n'));
console.log("File fixed!");
