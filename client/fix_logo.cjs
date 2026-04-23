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
        
        content = content.replace(/<img[^>]*src=\{logoImage\}[^>]*className="([^"]*)"/g, (match, className) => {
            // Do not override if it already has invert or dark:invert
            if (!className.includes('invert')) {
                modified = true;
                return match.replace(className, className.trim() + ' dark:brightness-0 dark:invert');
            }
            return match;
        });

        if (modified) {
            fs.writeFileSync(file, content);
            console.log('Fixed logo dark mode in ' + file);
        }
    } catch (e) {
        console.error('Error on ' + file + ':', e.message);
    }
});
