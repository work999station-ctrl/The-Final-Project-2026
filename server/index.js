
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
