const fs = require('fs');
const files = [
    'src/pages/StudentDashboard.jsx',
    'src/pages/ApplicationTracker.jsx',
    'src/pages/CompanyDashboard.jsx',
    'src/pages/AdminDashboard.jsx',
    'src/pages/ApplicationDetails.jsx',
    'src/components/StudentSidebar.jsx'
];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        // StudentDashboard specific patterns
        content = content.replace(/bg-background-light/g, 'bg-background-light dark:bg-background-dark');
        content = content.replace(/bg-surface-light/g, 'bg-surface-light dark:bg-surface-dark');
        content = content.replace(/text-text-main/g, 'text-text-main dark:text-gray-100');
        content = content.replace(/text-text-muted/g, 'text-text-muted dark:text-gray-400');
        content = content.replace(/border-border-color/g, 'border-border-color dark:border-slate-700/50');
        content = content.replace(/bg-white(?=[\s\"])/g, 'bg-white dark:bg-slate-800');
        
        // ApplicationTracker specific patterns (mostly slate)
        content = content.replace(/bg-slate-50/g, 'bg-slate-50 dark:bg-slate-900');
        content = content.replace(/text-slate-900/g, 'text-slate-900 dark:text-white');
        content = content.replace(/text-slate-800/g, 'text-slate-800 dark:text-slate-100');
        content = content.replace(/text-slate-700/g, 'text-slate-700 dark:text-slate-200');
        content = content.replace(/text-slate-600/g, 'text-slate-600 dark:text-slate-300');
        content = content.replace(/text-slate-500/g, 'text-slate-500 dark:text-slate-400');
        content = content.replace(/text-slate-400/g, 'text-slate-400 dark:text-slate-500');
        content = content.replace(/bg-slate-100/g, 'bg-slate-100 dark:bg-slate-800');
        content = content.replace(/bg-slate-200/g, 'bg-slate-200 dark:bg-slate-700');
        content = content.replace(/border-slate-200/g, 'border-slate-200 dark:border-slate-700');
        content = content.replace(/border-slate-100/g, 'border-slate-100 dark:border-slate-800');
        content = content.replace(/border-gray-100/g, 'border-gray-100 dark:border-slate-700');
        content = content.replace(/bg-gray-50/g, 'bg-gray-50 dark:bg-slate-800');
        
        // Remove duplicates if the script is run multiple times
        content = content.replace(/(dark:[\w\/-]+\s?)\1+/g, '\$1');
        
        fs.writeFileSync(file, content);
        console.log('Fixed ' + file);
    } catch (e) {
        console.error('Error on ' + file + ':', e.message);
    }
});
