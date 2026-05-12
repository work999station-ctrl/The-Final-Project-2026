const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Company = require('./models/Company.model');

async function fixLogos() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const companies = await Company.find({ logo: { $exists: true, $ne: '' } });
        console.log(`Found ${companies.length} companies with logos.`);

        for (const company of companies) {
            let currentLogo = company.logo;
            console.log(`Checking ${company.companyName}: ${currentLogo}`);

            // Case 1: Logo is in /uploads/ instead of /uploads/company/
            if (currentLogo.startsWith('/uploads/') && !currentLogo.startsWith('/uploads/company/')) {
                const filename = currentLogo.replace('/uploads/', '');
                const oldPath = path.join(__dirname, 'public', 'uploads', filename);
                const newRelativePath = `/uploads/company/${filename}`;
                const newPath = path.join(__dirname, 'public', 'uploads', 'company', filename);

                if (fs.existsSync(oldPath)) {
                    console.log(`Moving ${oldPath} to ${newPath}`);
                    fs.renameSync(oldPath, newPath);
                    company.logo = newRelativePath;
                    await company.save();
                    console.log(`Updated DB for ${company.companyName} to ${newRelativePath}`);
                } else if (fs.existsSync(newPath)) {
                    console.log(`File already at ${newPath}, updating DB...`);
                    company.logo = newRelativePath;
                    await company.save();
                } else {
                    console.warn(`File NOT FOUND for ${company.companyName} at ${oldPath} or ${newPath}`);
                }
            }
            // Case 2: Logo doesn't start with /uploads/
            // General existence check
            const fullPath = path.join(__dirname, 'public', company.logo);
            if (!fs.existsSync(fullPath)) {
                console.warn(`[MISSING FILE] ${company.companyName}: ${fullPath}`);
            } else {
                console.log(`[OK] ${company.companyName}: File exists.`);
            }
        }

        console.log('Finished fixing logos.');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

fixLogos();
