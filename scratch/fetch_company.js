const mongoose = require('mongoose');
const Company = require('./server/models/Company.model');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './server/.env' });

async function getCompany() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const company = await Company.findOne();
    if (company) {
      console.log('Company Name:', company.companyName);
      console.log('Company Email:', company.email);
      
      // Update password to something known
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('password123', salt);
      company.password = hashedPassword;
      await company.save();
      
      console.log('Password has been reset to: password123');
    } else {
      console.log('No company found in the database.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

getCompany();
