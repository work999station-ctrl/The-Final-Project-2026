const mongoose = require('mongoose');
const Admin = require('./server/models/Admin.model');
require('dotenv').config({ path: './server/.env' });

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Admin.login('company@example.com', 'wrong');
  } catch (err) {
    console.log("CAUGHT ERROR:", err.message);
    console.log("ERROR TYPE:", err.name);
    console.log("STACK:", err.stack);
  } finally {
    mongoose.disconnect();
  }
}
test();
