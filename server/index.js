const express = require('express');
const path = require('path');
require("dotenv").config();
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
const allRoutes = require('./routes/all.routes.js');
const { requireAuth, checkUser } = require('./middleware/authmiddleware.js');
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
// app.set('view engine', 'ejs');
app.use(checkUser);



const http = require('http');
const socketManager = require('./socket');

// load .env

// Bypass Windows/ISP DNS issues with MongoDB Atlas SRV/TXT lookups
require('dns').setServers(['8.8.8.8', '8.8.4.4']);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected"))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.json({ message: "Server is running", status: "API only" }));
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const server = http.createServer(app);
socketManager.init(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
