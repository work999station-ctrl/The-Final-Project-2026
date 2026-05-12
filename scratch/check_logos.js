const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });
const Company = require('./server/models/Company.model');

async function checkCompanies() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        const companies = await Company.find({}, 'companyName email logo');
        console.log('Companies found:', companies.length);
        companies.forEach(c => {
            console.log(`- ${c.companyName}: ${c.logo}`);
        });
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkCompanies();
