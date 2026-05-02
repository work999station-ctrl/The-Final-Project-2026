const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/ASPIRE 3 15/The-Final-Project-2026/client/src';
const searchRegex = /<img src=\{logoImage\}[^>]*className="([^"]+)"[^>]*\/>/g;

function walk(directory) {
    let results = [];
    const list = fs.readdirSync(directory);
    list.forEach(file => {
        file = path.join(directory, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walk(dir);

const newDarkClasses = 'dark:brightness-0 dark:invert dark:sepia dark:saturate-[10] dark:hue-rotate-[350deg] mix-blend-multiply dark:mix-blend-screen';

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    content = content.replace(searchRegex, (match, classNames) => {
        let cleanClasses = classNames
            .replace(/dark:invert(-\[\d+\])?/g, '')
            .replace(/dark:hue-rotate(-180|-\[\d+a-z]+)?/g, '')
            .replace(/mix-blend-multiply/g, '')
            .replace(/dark:mix-blend-screen/g, '')
            .replace(/dark:brightness-0/g, '')
            .replace(/dark:sepia/g, '')
            .replace(/dark:saturate-[^\s]+/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        
        let finalClasses = `${cleanClasses} ${newDarkClasses}`;
        modified = true;
        return match.replace(classNames, finalClasses);
    });

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
    }
});
