const fs = require('fs');
const files = [
    'src/pages/StudentSignup.jsx',
    'src/pages/Login.jsx',
    'src/pages/Home.jsx',
    'src/pages/CompanySignup.jsx',
    'src/pages/AdminSignup.jsx',
    'src/pages/AdminAcceptanceValidation.jsx',
    'src/components/AdminNavbar.jsx',
    'src/components/SharedInbox.jsx',
    'src/components/StudentNavbar.jsx',
    'src/components/Navbar.jsx',
    'src/components/CompanyNavbar.jsx'
];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // Match className for logo images
        content = content.replace(/<img[^>]*src=\{logoImage\}[^>]*className="([^"]*)"/g, (fullMatch, classes) => {
            let newClasses = classes;
            if (!newClasses.includes('mix-blend-multiply')) {
                // If it is the special one in Home.jsx that is brightness-0 invert (meaning it's purely white on a dark footer)
                if (newClasses.includes('brightness-0 invert') && !newClasses.includes('dark:invert')) {
                    newClasses = newClasses + ' mix-blend-screen';
                } else {
                    newClasses = newClasses + ' mix-blend-multiply dark:mix-blend-[screen]';
                }
                modified = true;
                return fullMatch.replace(classes, newClasses.trim());
            }
            return fullMatch;
        });

        if (modified) {
            fs.writeFileSync(file, content);
            console.log('Added mix-blend to ' + file);
        }
    } catch (e) {
        console.error('Error on ' + file + ':', e.message);
    }
});
