const mongoose = require('mongoose');
const Company = require('./models/Company.model');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './.env' });
// require('dns').setServers(['8.8.8.8', '8.8.4.4']);

async function getCompany() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const company = await Company.findOne();
    if (company) {
      console.log('--- COMPANY ACCOUNT ---');
      console.log('Company Name: ' + company.companyName);
      console.log('Company Email: ' + company.email);
      
      // Update password to something known
      // The pre-save hook handles hashing!
      company.password = 'password123';
      await company.save();
      
      console.log('-----------------------');
      console.log('Password has been reset to: password123');
    } else {
      console.log('No company found in regular collection check.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

getCompany();
