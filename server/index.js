
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const products = require('./routes/products.routes.js');
const cookieParser = require('cookie-parser');
const allRoutes = require('./routes/all.routes.js')
const {requireAuth , checkUser} = require('./middleware/authmiddleware.js');
require("dotenv").config();
//middleware
app.use(express.json());
app.use(express.urlencoded({extends:false}))
app.use(express.static('public'));
app.use(cookieParser());
app.set('view engine', 'ejs');
// app.use('/api/products' ,products)
app.use(checkUser);



 // load .env



// Bypass Windows/ISP DNS issues with MongoDB Atlas SRV/TXT lookups
require('dns').setServers(['8.8.8.8', '8.8.4.4']);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected"))
  .catch(err => console.log(err));




app.get('/' , (req , res)=> res.render('home'));
app.use(allRoutes);

app.get('/api/test-password-reset', async (req, res) => {
  const Company = require('./models/Company.model');
  const company = await Company.findOne();
  if (company) {
    company.password = 'password123';
    await company.save();
    return res.json({ name: company.companyName, email: company.email, newPass: 'password123' });
  }
  res.json({ error: 'No companies exist' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
